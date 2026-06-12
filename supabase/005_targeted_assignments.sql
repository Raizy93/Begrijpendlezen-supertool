-- Taken gericht toewijzen aan de hele klas of aan geselecteerde leerlingen.
-- Uitvoeren in de Supabase SQL editor.
-- Bestaande taken blijven voor de hele klas beschikbaar.

create table if not exists public.assignment_students (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

create index if not exists assignment_students_student_id_idx
on public.assignment_students(student_id);

alter table public.assignment_students enable row level security;

drop policy if exists "Teachers can manage assignment recipients" on public.assignment_students;
create policy "Teachers can manage assignment recipients"
on public.assignment_students
for all
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    join public.students s on s.id = assignment_students.student_id
    where a.id = assignment_students.assignment_id
      and a.teacher_id = (select auth.uid())
      and s.class_id = a.class_id
  )
)
with check (
  exists (
    select 1
    from public.assignments a
    join public.students s on s.id = assignment_students.student_id
    where a.id = assignment_students.assignment_id
      and a.teacher_id = (select auth.uid())
      and s.class_id = a.class_id
      and s.active = true
  )
);

grant select, insert, update, delete on public.assignment_students to authenticated;

create or replace function public.student_assignments(
  p_student_id uuid,
  p_login_code text
)
returns table (
  assignment_id uuid,
  title text,
  mode text,
  goals text[],
  question_count integer,
  settings jsonb,
  due_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select a.id, a.title, a.mode, a.goals, a.question_count, a.settings, a.due_at
  from public.students s
  join public.assignments a on a.class_id = s.class_id
  join public.classes c on c.id = s.class_id
  where s.id = p_student_id
    and upper(s.login_code) = upper(trim(p_login_code))
    and s.active = true
    and a.active = true
    and c.archived_at is null
    and (a.due_at is null or a.due_at > now())
    and (
      coalesce(a.settings ->> 'audience', 'class') <> 'selected'
      or exists (
        select 1
        from public.assignment_students ast
        where ast.assignment_id = a.id
          and ast.student_id = s.id
      )
    )
  order by a.created_at desc;
$$;

create or replace function public.student_assignments_status(
  p_student_id uuid,
  p_login_code text
)
returns table (
  assignment_id uuid,
  title text,
  mode text,
  goals text[],
  question_count integer,
  settings jsonb,
  due_at timestamptz,
  completed boolean,
  last_score integer,
  last_total integer,
  last_finished_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with latest_attempt as (
    select distinct on (at.assignment_id)
      at.assignment_id,
      at.score,
      at.total,
      at.finished_at
    from public.attempts at
    where at.student_id = p_student_id
    order by at.assignment_id, at.finished_at desc nulls last, at.started_at desc
  )
  select
    a.id,
    a.title,
    a.mode,
    a.goals,
    a.question_count,
    a.settings,
    a.due_at,
    (la.assignment_id is not null) as completed,
    la.score,
    la.total,
    la.finished_at
  from public.students s
  join public.assignments a on a.class_id = s.class_id
  join public.classes c on c.id = s.class_id
  left join latest_attempt la on la.assignment_id = a.id
  where s.id = p_student_id
    and upper(s.login_code) = upper(trim(p_login_code))
    and s.active = true
    and a.active = true
    and c.archived_at is null
    and (a.due_at is null or a.due_at > now())
    and (
      coalesce(a.settings ->> 'audience', 'class') <> 'selected'
      or exists (
        select 1
        from public.assignment_students ast
        where ast.assignment_id = a.id
          and ast.student_id = s.id
      )
    )
  order by a.created_at desc;
$$;

create or replace function public.submit_student_attempt(
  p_student_id uuid,
  p_login_code text,
  p_assignment_id uuid,
  p_score integer,
  p_total integer,
  p_goal_summary jsonb default '{}'::jsonb,
  p_details jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_id uuid;
begin
  if not exists (
    select 1
    from public.students s
    join public.assignments a on a.class_id = s.class_id
    join public.classes c on c.id = s.class_id
    where s.id = p_student_id
      and upper(s.login_code) = upper(trim(p_login_code))
      and s.active = true
      and a.id = p_assignment_id
      and a.active = true
      and c.archived_at is null
      and (a.due_at is null or a.due_at > now())
      and (
        coalesce(a.settings ->> 'audience', 'class') <> 'selected'
        or exists (
          select 1
          from public.assignment_students ast
          where ast.assignment_id = a.id
            and ast.student_id = s.id
        )
      )
  ) then
    raise exception 'Ongeldige leerling of taak';
  end if;

  insert into public.attempts (
    assignment_id,
    student_id,
    finished_at,
    score,
    total,
    goal_summary,
    details
  )
  values (
    p_assignment_id,
    p_student_id,
    now(),
    greatest(0, p_score),
    greatest(0, p_total),
    coalesce(p_goal_summary, '{}'::jsonb),
    coalesce(p_details, '[]'::jsonb)
  )
  returning id into v_attempt_id;

  return v_attempt_id;
end;
$$;

grant execute on function public.student_assignments(uuid, text) to anon;
grant execute on function public.student_assignments_status(uuid, text) to anon;
grant execute on function public.submit_student_attempt(uuid, text, uuid, integer, integer, jsonb, jsonb) to anon;
