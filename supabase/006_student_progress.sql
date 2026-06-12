-- Veilige voortgangsgegevens voor de ingelogde leerlingomgeving.
-- Uitvoeren in de Supabase SQL editor na 005_targeted_assignments.sql.

create or replace function public.student_progress(
  p_student_id uuid,
  p_login_code text
)
returns table (
  attempt_id uuid,
  assignment_id uuid,
  assignment_title text,
  assignment_active boolean,
  assignment_goals text[],
  finished_at timestamptz,
  score integer,
  total integer,
  goal_summary jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    at.id,
    a.id,
    a.title,
    a.active,
    a.goals,
    at.finished_at,
    at.score,
    at.total,
    at.goal_summary
  from public.students s
  join public.assignments a on a.class_id = s.class_id
  join public.attempts at
    on at.assignment_id = a.id
   and at.student_id = s.id
  join public.classes c on c.id = s.class_id
  where s.id = p_student_id
    and upper(s.login_code) = upper(trim(p_login_code))
    and s.active = true
    and c.archived_at is null
    and at.finished_at is not null
    and (
      coalesce(a.settings ->> 'audience', 'class') <> 'selected'
      or exists (
        select 1
        from public.assignment_students ast
        where ast.assignment_id = a.id
          and ast.student_id = s.id
      )
    )
  order by at.finished_at desc;
$$;

grant execute on function public.student_progress(uuid, text) to anon;
