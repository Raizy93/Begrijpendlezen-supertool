# Login, klassen en voortgang - stappenplan

## Doel

We bouwen een lichte laag om de bestaande Supertool heen:

- leerkrachten loggen in met e-mail
- leerkrachten maken klassen aan
- leerlingen gebruiken alleen een klascode plus voornaam/pincode
- leerkrachten zetten taken klaar
- leerlingen maken taken
- voortgang wordt minimaal opgeslagen

De bestaande oefenmodules blijven bruikbaar zonder login. De login-laag komt er stap voor stap naast.

## AVG-uitgangspunten

- Leerlingen krijgen geen e-mailaccount.
- We slaan alleen voornaam of pseudoniem op.
- Elke leerling krijgt een korte pincode of code, vooral voor dubbele namen.
- Geen achternamen, geboortedata, IP-adressen of vrije leerlingnotities in de database.
- Voortgang is gekoppeld aan een leerling-id binnen een klas.
- Leerkrachten kunnen een klas met leerlingen en resultaten verwijderen.
- Resultaatdetails blijven compact: doel, goed/fout, score en tijdstip.

## Technische keuze

Supabase is het meest logisch voor de eerste versie:

- Supabase Auth voor leerkrachten
- Postgres database voor klassen, leerlingen, taken en resultaten
- Row Level Security voor leerkrachtdata
- RPC-functies voor leerlingen, zodat leerlingen geen brede toegang tot tabellen krijgen

Belangrijk: tabellen in de publieke API krijgen RLS. Voor leerlingtoegang gebruiken we alleen beperkte functies zoals `student_login` en `submit_student_attempt`.

## Fase 1 - Fundament

1. Supabase-project aanmaken.
2. SQL-schema uitvoeren uit `supabase/schema.sql`.
3. Configbestand in de tool maken met Supabase URL en anon key.
4. Leerkracht-loginpagina bouwen.
5. Dashboard-shell bouwen.

Resultaat: een leerkracht kan inloggen en in een leeg dashboard komen.

## Fase 2 - Klassen

1. Klas aanmaken met naam en automatisch gegenereerde klascode.
2. Leerlingen toevoegen met voornaam/pseudoniem en korte pincode.
3. Leerlingenlijst tonen.
4. Klas verwijderen of archiveren.

Resultaat: de leerkracht kan veilig een klas beheren zonder leerlingaccounts.

## Fase 3 - Taken

1. Taak aanmaken voor Mixmodus.
2. Doelen kiezen.
3. Aantal vragen kiezen.
4. Taak actief zetten.

Resultaat: leerlingen kunnen een klaargezette Mixmodus-taak starten.

## Fase 4 - Leerlingmodus

1. Leerling vult klascode in.
2. Leerling kiest of typt voornaam.
3. Leerling vult pincode in.
4. Tool toont actieve taken.
5. Na afronden wordt score opgeslagen.

Resultaat: een leerling kan zonder e-mail of wachtwoord oefenen.

## Fase 5 - Voortgang

1. Dashboard toont score per leerling.
2. Dashboard toont voortgang per doel.
3. Leerkracht kan resultaten per taak bekijken.
4. Leerkracht kan oude resultaten verwijderen/exporteren.

Resultaat: bruikbare voortgang zonder onnodige persoonsgegevens.

## Eerste MVP-keuze

We starten met alleen Mixmodus als taaktype. Dat is het slimst omdat Mixmodus alle doelen kan bevatten. Daarna koppelen we losse doelen als aparte taaktypes.

