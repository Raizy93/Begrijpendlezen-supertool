-- Begrijpend lezen Supertool - eerste Supabase schema
-- Uitvoeren in de Supabase SQL editor.
-- Ontwerp: leerkrachten via Supabase Auth, leerlingen via klascode + leerlingcode.

create extension if not exists pgcrypto;

create table if not exists public.teacher_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  school_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  class_code text not null unique,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  display_name text not null,
  login_code text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (class_id, display_name),
  unique (class_id, login_code)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null,
  mode text not null default 'mix',
  goals text[] not null default '{}',
  question_count integer not null default 10,
  settings jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  check (question_count between 1 and 100)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer not null default 0,
  total integer not null default 0,
  goal_summary jsonb not null default '{}'::jsonb,
  details jsonb not null default '[]'::jsonb,
  check (score >= 0),
  check (total >= 0)
);

alter table public.teacher_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.assignments enable row level security;
alter table public.attempts enable row level security;

drop policy if exists "Teachers can manage own profile" on public.teacher_profiles;
create policy "Teachers can manage own profile"
on public.teacher_profiles
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Teachers can manage own classes" on public.classes;
create policy "Teachers can manage own classes"
on public.classes
for all
to authenticated
using ((select auth.uid()) = teacher_id)
with check ((select auth.uid()) = teacher_id);

drop policy if exists "Teachers can manage students in own classes" on public.students;
create policy "Teachers can manage students in own classes"
on public.students
for all
to authenticated
using (
  exists (
    select 1 from public.classes c
    where c.id = students.class_id
      and c.teacher_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.classes c
    where c.id = students.class_id
      and c.teacher_id = (select auth.uid())
  )
);

drop policy if exists "Teachers can manage own assignments" on public.assignments;
create policy "Teachers can manage own assignments"
on public.assignments
for all
to authenticated
using ((select auth.uid()) = teacher_id)
with check (
  (select auth.uid()) = teacher_id
  and exists (
    select 1 from public.classes c
    where c.id = assignments.class_id
      and c.teacher_id = (select auth.uid())
  )
);

drop policy if exists "Teachers can read attempts in own classes" on public.attempts;
create policy "Teachers can read attempts in own classes"
on public.attempts
for select
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    where a.id = attempts.assignment_id
      and a.teacher_id = (select auth.uid())
  )
);

-- Leerlingen krijgen geen directe table policies.
-- Ze gebruiken alleen de beperkte RPC-functies hieronder.

create or replace function public.student_login(
  p_class_code text,
  p_display_name text,
  p_login_code text
)
returns table (
  student_id uuid,
  class_id uuid,
  class_name text,
  display_name text
)
language sql
security definer
set search_path = public
as $$
  select s.id, c.id, c.name, s.display_name
  from public.students s
  join public.classes c on c.id = s.class_id
  where upper(c.class_code) = upper(trim(p_class_code))
    and lower(s.display_name) = lower(trim(p_display_name))
    and upper(s.login_code) = upper(trim(p_login_code))
    and s.active = true
    and c.archived_at is null
  limit 1;
$$;

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

grant execute on function public.student_login(text, text, text) to anon;
grant execute on function public.student_assignments(uuid, text) to anon;
grant execute on function public.submit_student_attempt(uuid, text, uuid, integer, integer, jsonb, jsonb) to anon;

create or replace function public.class_students_by_code(
  p_class_code text
)
returns table (
  class_id uuid,
  class_name text,
  student_id uuid,
  display_name text
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.name, s.id, s.display_name
  from public.classes c
  join public.students s on s.class_id = c.id
  where upper(c.class_code) = upper(trim(p_class_code))
    and c.archived_at is null
    and s.active = true
  order by lower(s.display_name), s.created_at;
$$;

grant execute on function public.class_students_by_code(text) to anon;

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
  order by a.created_at desc;
$$;

grant execute on function public.student_assignments_status(uuid, text) to anon;
