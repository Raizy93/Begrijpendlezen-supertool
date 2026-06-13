-- Compacte tussenstanden voor leerlingtaken.
-- Uitvoeren in de Supabase SQL editor na 006_student_progress.sql.

create table if not exists public.assignment_progress (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (assignment_id, student_id),
  check (octet_length(state::text) <= 50000)
);

create index if not exists assignment_progress_updated_at_idx
on public.assignment_progress (updated_at);

alter table public.assignment_progress enable row level security;

create or replace function public.student_assignment_progress(
  p_student_id uuid,
  p_login_code text,
  p_assignment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_state jsonb;
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
      and not exists (
        select 1 from public.attempts at
        where at.assignment_id = a.id and at.student_id = s.id
      )
      and (
        coalesce(a.settings ->> 'audience', 'class') <> 'selected'
        or exists (
          select 1 from public.assignment_students ast
          where ast.assignment_id = a.id and ast.student_id = s.id
        )
      )
  ) then
    return null;
  end if;

  delete from public.assignment_progress
  where assignment_id = p_assignment_id
    and student_id = p_student_id
    and updated_at < now() - interval '60 days';

  select ap.state into v_state
  from public.assignment_progress ap
  where ap.assignment_id = p_assignment_id
    and ap.student_id = p_student_id;

  return v_state;
end;
$$;

-- Laat in de leerlingtakenlijst zien welke taak al begonnen is.
drop function if exists public.student_assignments_status(uuid, text);
create function public.student_assignments_status(
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
  last_finished_at timestamptz,
  in_progress boolean,
  progress_current integer
)
language sql
security definer
set search_path = public
as $$
  with latest_attempt as (
    select distinct on (at.assignment_id)
      at.assignment_id, at.score, at.total, at.finished_at
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
    la.finished_at,
    (la.assignment_id is null and ap.assignment_id is not null) as in_progress,
    case
      when la.assignment_id is null then greatest(0, least(a.question_count, coalesce((ap.state ->> 'nextIndex')::integer, 0)))
      else 0
    end as progress_current
  from public.students s
  join public.assignments a on a.class_id = s.class_id
  join public.classes c on c.id = s.class_id
  left join latest_attempt la on la.assignment_id = a.id
  left join public.assignment_progress ap
    on ap.assignment_id = a.id
   and ap.student_id = s.id
   and ap.updated_at >= now() - interval '60 days'
  where s.id = p_student_id
    and upper(s.login_code) = upper(trim(p_login_code))
    and s.active = true
    and a.active = true
    and c.archived_at is null
    and (a.due_at is null or a.due_at > now())
    and (
      coalesce(a.settings ->> 'audience', 'class') <> 'selected'
      or exists (
        select 1 from public.assignment_students ast
        where ast.assignment_id = a.id and ast.student_id = s.id
      )
    )
  order by a.created_at desc;
$$;

create or replace function public.save_student_assignment_progress(
  p_student_id uuid,
  p_login_code text,
  p_assignment_id uuid,
  p_state jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_state is null or octet_length(p_state::text) > 50000 then
    raise exception 'Ongeldige of te grote tussenstand';
  end if;

  delete from public.assignment_progress
  where updated_at < now() - interval '60 days';

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
      and not exists (
        select 1 from public.attempts at
        where at.assignment_id = a.id and at.student_id = s.id
      )
      and (
        coalesce(a.settings ->> 'audience', 'class') <> 'selected'
        or exists (
          select 1 from public.assignment_students ast
          where ast.assignment_id = a.id and ast.student_id = s.id
        )
      )
  ) then
    raise exception 'Ongeldige leerling of taak';
  end if;

  insert into public.assignment_progress (assignment_id, student_id, state, updated_at)
  values (p_assignment_id, p_student_id, p_state, now())
  on conflict (assignment_id, student_id)
  do update set state = excluded.state, updated_at = excluded.updated_at;
end;
$$;

-- Vervangt de bestaande functie zodat een afgeronde taak meteen zijn tussenstand opruimt.
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
          select 1 from public.assignment_students ast
          where ast.assignment_id = a.id and ast.student_id = s.id
        )
      )
  ) then
    raise exception 'Ongeldige leerling of taak';
  end if;

  select at.id into v_attempt_id
  from public.attempts at
  where at.assignment_id = p_assignment_id
    and at.student_id = p_student_id
  order by at.finished_at desc nulls last, at.started_at desc
  limit 1;

  if v_attempt_id is not null then
    delete from public.assignment_progress
    where assignment_id = p_assignment_id and student_id = p_student_id;
    return v_attempt_id;
  end if;

  insert into public.attempts (
    assignment_id, student_id, finished_at, score, total, goal_summary, details
  ) values (
    p_assignment_id, p_student_id, now(), greatest(0, p_score), greatest(0, p_total),
    coalesce(p_goal_summary, '{}'::jsonb), coalesce(p_details, '[]'::jsonb)
  ) returning id into v_attempt_id;

  delete from public.assignment_progress
  where assignment_id = p_assignment_id and student_id = p_student_id;

  return v_attempt_id;
end;
$$;

revoke all on table public.assignment_progress from anon, authenticated;
revoke all on function public.student_assignment_progress(uuid, text, uuid) from public;
revoke all on function public.save_student_assignment_progress(uuid, text, uuid, jsonb) from public;
revoke all on function public.submit_student_attempt(uuid, text, uuid, integer, integer, jsonb, jsonb) from public;
revoke all on function public.student_assignments_status(uuid, text) from public;
grant execute on function public.student_assignment_progress(uuid, text, uuid) to anon;
grant execute on function public.save_student_assignment_progress(uuid, text, uuid, jsonb) to anon;
grant execute on function public.submit_student_attempt(uuid, text, uuid, integer, integer, jsonb, jsonb) to anon;
grant execute on function public.student_assignments_status(uuid, text) to anon;
