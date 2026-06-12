-- Extra functie voor leerlingflow:
-- leerling vult klascode in en ziet alleen de actieve namen/pseudoniemen van die klas.
-- Login-codes worden bewust niet teruggegeven.

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

