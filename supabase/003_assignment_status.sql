-- Leerlingtaken met afrondstatus.
-- Deze functie vervangt de leerlingzijde niet in de database, maar geeft de frontend
-- extra informatie: is deze taak al afgerond door deze leerling?

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

