-- Demo-historie voor het leerkrachtdashboard.
-- Uitvoeren in de Supabase SQL editor.
--
-- Dit script:
-- - gebruikt de bestaande klas met klascode TAAL-324;
-- - maakt geen leerlingen aan en wijzigt geen echte gegevens;
-- - vervangt alleen eerder door dit script gemaakte demodata;
-- - zet demotaken uit, zodat leerlingen ze niet kunnen starten;
-- - maakt twaalf taken en resultaten verspreid over circa zes maanden.

do $$
declare
  v_class public.classes%rowtype;
  v_student record;
  v_assignment_id uuid;
  v_round integer;
  v_goal_index integer;
  v_goal text;
  v_goals text[];
  v_summary jsonb;
  v_score integer;
  v_good integer;
  v_percentage numeric;
  v_created_at timestamptz;
  v_finished_at timestamptz;
  v_student_bias integer;
  v_goal_bias integer;
  v_variation integer;
  v_hash bigint;
  v_all_goals text[] := array[
    'hzd', 'td', 'tsk',
    'fom', 'sign', 'vw',
    'tk', 'sam', 'conc'
  ];
  v_titles text[] := array[
    '[DEMO] Startmeting winter',
    '[DEMO] Teksten herkennen',
    '[DEMO] Begrijpen en afleiden',
    '[DEMO] Herhaling januari',
    '[DEMO] Signalen in teksten',
    '[DEMO] Koppen en conclusies',
    '[DEMO] Tussenmeting voorjaar',
    '[DEMO] Gericht oefenen',
    '[DEMO] Verdiepende mix',
    '[DEMO] Herhaling april',
    '[DEMO] Eindspurt begrijpend lezen',
    '[DEMO] Recente voortgangsmeting'
  ];
begin
  select c.*
  into v_class
  from public.classes c
  where upper(c.class_code) = 'TAAL-324'
    and c.archived_at is null
  limit 1;

  if not found then
    raise exception 'Geen actieve klas gevonden met klascode TAAL-324.';
  end if;

  if not exists (
    select 1
    from public.students s
    where s.class_id = v_class.id
      and s.active = true
  ) then
    raise exception 'De klas TAAL-324 heeft nog geen actieve leerlingen.';
  end if;

  -- Door de cascade worden alleen pogingen van eerdere demotaken verwijderd.
  delete from public.assignments a
  where a.class_id = v_class.id
    and a.settings ->> 'demo' = 'true';

  for v_round in 0..11 loop
    v_created_at := date_trunc(
      'day',
      now() - interval '22 weeks' + (v_round * interval '2 weeks')
    ) + interval '9 hours';

    -- Iedere taak meet drie doelen. Na drie taken zijn alle negen doelen aan bod geweest.
    v_goal_index := mod(v_round, 3) * 3 + 1;
    v_goals := array[
      v_all_goals[v_goal_index],
      v_all_goals[v_goal_index + 1],
      v_all_goals[v_goal_index + 2]
    ];

    insert into public.assignments (
      teacher_id,
      class_id,
      title,
      mode,
      goals,
      question_count,
      settings,
      active,
      due_at,
      created_at
    )
    values (
      v_class.teacher_id,
      v_class.id,
      v_titles[v_round + 1],
      'mix',
      v_goals,
      18,
      jsonb_build_object(
        'demo', true,
        'source', 'demo-history-v1',
        'measurement', v_round + 1
      ),
      false,
      v_created_at + interval '10 days',
      v_created_at
    )
    returning id into v_assignment_id;

    for v_student in
      select s.id, s.display_name
      from public.students s
      where s.class_id = v_class.id
        and s.active = true
      order by s.display_name
    loop
      v_hash := abs(hashtextextended(v_student.id::text || ':' || v_round::text, 0));

      -- Een klein deel van de taken wordt bewust gemist, zoals in een echte klas.
      if mod(v_hash, 13) = 0 then
        continue;
      end if;

      v_summary := '{}'::jsonb;
      v_score := 0;
      v_student_bias := mod(abs(hashtext(v_student.id::text)), 19) - 9;

      foreach v_goal in array v_goals loop
        v_goal_bias := mod(abs(hashtext(v_goal)), 13) - 6;
        v_variation := mod(
          abs(hashtext(v_student.id::text || ':' || v_goal || ':' || v_round::text)),
          9
        ) - 4;

        -- Start rond 48%, daarna groei met individuele en doelgerichte verschillen.
        v_percentage := least(
          96,
          greatest(28, 48 + (v_round * 3) + v_student_bias + v_goal_bias + v_variation)
        );
        v_good := least(6, greatest(0, round((v_percentage / 100) * 6)::integer));
        v_score := v_score + v_good;
        v_summary := v_summary || jsonb_build_object(
          v_goal,
          jsonb_build_object('good', v_good, 'total', 6)
        );
      end loop;

      v_finished_at := v_created_at
        + ((1 + mod(v_hash, 6)) * interval '1 day')
        + ((9 + mod(v_hash, 7)) * interval '1 hour');

      insert into public.attempts (
        assignment_id,
        student_id,
        started_at,
        finished_at,
        score,
        total,
        goal_summary,
        details
      )
      values (
        v_assignment_id,
        v_student.id,
        v_finished_at - interval '18 minutes',
        v_finished_at,
        v_score,
        18,
        v_summary,
        '[]'::jsonb
      );
    end loop;
  end loop;

  raise notice 'Demohistorie aangemaakt voor % (%).', v_class.name, v_class.class_code;
end;
$$;

-- Demodata later verwijderen zonder echte taken te raken:
-- delete from public.assignments
-- where class_id = (select id from public.classes where upper(class_code) = 'TAAL-324')
--   and settings ->> 'demo' = 'true';
