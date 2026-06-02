# Hoofdzaak of detail?

Een interactieve digibord-tool begrijpend lezen voor **groep 7 & 8**, in de
huisstijl van Meester Danny. De leerling leest een korte tekst, kijkt naar de
**gele gemarkeerde zin** en kiest: is dat de **hoofdzaak** of een **detail**?

Met scorebord, reeks-teller, een startmenu met uitleg, directe feedback met
uitleg, en een eindscherm met een 1–3 sterren beoordeling op basis van je score.
Bevat 100 teksten (50 hoofdzaak, 50 detail — mooi in balans). Speelbaar met muis/touch én toetsenbord (← hoofdzaak,
→ detail, Enter = volgende). Rechtsboven zit een **volledig-scherm-knop**
(of toets `F`) om het bord af te leiden van andere prikkels.

> Let op: voor de volledig-scherm-knop in een embed moet het `iframe` het
> attribuut `allowfullscreen` / `allow="fullscreen"` hebben — zie hieronder.

---

## Bestanden

```
index.html                         ← de tool (ingang)
engine.js                          ← spellogica
items.js                           ← de 100 teksten
assets/logo-meesterdanny.png       ← logo
hoofdzaak-of-detail.standalone.html ← alles-in-één losse versie (zie hieronder)
```

Alle paden zijn relatief, dus de map werkt zodra hij via een webserver
(of GitHub Pages, Netlify, etc.) wordt geserveerd. De lettertypes komen van
Google Fonts; een internetverbinding is dus nodig.

---

## Embedden op je website

### Optie 1 — de map hosten en embedden (aanbevolen)

Plaats deze map in je repository en host hem (bijv. GitHub Pages). Embed
hem dan met een `iframe`. De tool is gemaakt voor liggend (digibord)
formaat — houd ongeveer **16:10** aan:

```html
<div style="position:relative; width:100%; max-width:1280px; aspect-ratio:16/10; margin:0 auto;">
  <iframe
    src="https://JOUW-DOMEIN/pad-naar-map/index.html"
    style="position:absolute; inset:0; width:100%; height:100%; border:0; border-radius:16px;"
    title="Hoofdzaak of detail?"
    allow="autoplay; fullscreen"
    allowfullscreen>
  </iframe>
</div>
```

### Optie 2 — één los bestand

`hoofdzaak-of-detail.standalone.html` bevat **alles** (logica, teksten, logo)
in één bestand. Handig als je geen map kunt hosten: upload alleen dit bestand
en verwijs er met een `iframe` naar, of open het direct.

```html
<iframe src="hoofdzaak-of-detail.standalone.html"
        style="width:100%; aspect-ratio:16/10; border:0;"
        title="Hoofdzaak of detail?"
        allow="autoplay; fullscreen" allowfullscreen></iframe>
```

---

## Teksten aanpassen of toevoegen

Open `items.js`. Elk item ziet er zo uit:

```js
{
  id: 51,
  onderwerp: "sport",
  zinnen: [ "Zin 1.", "Zin 2.", /* ... 10 zinnen ... */ ],
  highlightedIndex: 8,          // welke zin wordt gemarkeerd (0 = eerste)
  correctLabel: "hoofdzaak",    // "hoofdzaak" of "detail"
  uitleg: "Korte uitleg die na het antwoord verschijnt."
}
```

Voeg een object toe aan de lijst en de tool pakt het automatisch mee.
Maak je `items.js` aan? Genereer dan daarna de standalone opnieuw als je die
gebruikt.
