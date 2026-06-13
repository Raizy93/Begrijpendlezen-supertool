# Opdrachtenbank

## Thema's

Een thema is altijd optioneel. Zonder keuze gebruikt de tool `Alle thema's` en doet alle geschikte inhoud mee. Er kunnen ook meerdere thema's tegelijk worden gekozen; een tekst doet mee zodra die bij minimaal een van de gekozen thema's past.

Beschikbare themacodes:

- `natuur-milieu`
- `wetenschap-techniek`
- `geschiedenis`
- `wereld`
- `gezondheid-bewegen`
- `kunst-cultuur`
- `media-communicatie`
- `samenleving`
- `school-dagelijks`
- `dieren`

## Nieuwe teksten toevoegen

Geef iedere nieuwe tekst een stabiel `id` en een of twee passende themalabels:

```js
{
  id: "bijen-in-de-stad",
  onderwerp: "Bijen in de stad",
  themas: ["dieren", "natuur-milieu"],
  alineas: [
    ["Eerste zin.", "Tweede zin.", "Derde zin."]
  ],
  vragen: []
}
```

Gebruik alleen een tweede thema als de inhoud werkelijk bij beide thema's past. Tekstsoort en leerdoel zijn geen thema.

## Bestaande inhoud

`shared-themes.js` geeft oudere items automatisch een voorlopig themalabel. Nieuwe en herziene items krijgen bij voorkeur expliciete `themas`, zodat de indeling inhoudelijk gecontroleerd blijft.

## Centrale bronteksten

`content-history-world-pilot.js` is de eerste centrale inhoudsbatch. Deze bevat tien bronteksten: vijf met een nadruk op geschiedenis en vijf met een nadruk op de wereld. Uit iedere tekst worden opdrachten afgeleid voor:

- signaalwoorden;
- verwijswoorden;
- titel kiezen;
- samenvatting kiezen;
- conclusie trekken.

Zo kan een sterke tekst in meerdere leerdoelen terugkomen, terwijl iedere afgeleide vraag inhoudelijk apart wordt gecontroleerd. De pilot voegt in totaal zeventig vragen toe.

Bij uitbreiding van deze bank gelden drie extra controles:

- de gemarkeerde zin en het antecedent moeten letterlijk in de brontekst voorkomen;
- iedere vraag heeft vier geloofwaardige antwoordmogelijkheden;
- het goede antwoord mag niet systematisch aan lengte of positie herkenbaar zijn.

## Richtlijn voor dekking

Streef per combinatie van leerdoel en thema eerst naar minimaal vijf unieke vragen. Vanaf tien unieke vragen kan een thema ook bij langere taken voldoende variatie bieden.
