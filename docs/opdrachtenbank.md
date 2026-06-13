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

## Richtlijn voor dekking

Streef per combinatie van leerdoel en thema eerst naar minimaal vijf unieke vragen. Vanaf tien unieke vragen kan een thema ook bij langere taken voldoende variatie bieden.
