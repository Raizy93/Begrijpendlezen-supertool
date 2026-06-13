(function () {
  "use strict";

  const ALL = "all";
  const THEMES = [
    { id: "natuur-milieu", label: "Natuur en milieu" },
    { id: "wetenschap-techniek", label: "Wetenschap en techniek" },
    { id: "geschiedenis", label: "Geschiedenis" },
    { id: "wereld", label: "Aardrijkskunde en wereld" },
    { id: "gezondheid-bewegen", label: "Gezondheid en bewegen" },
    { id: "kunst-cultuur", label: "Kunst en cultuur" },
    { id: "media-communicatie", label: "Media en communicatie" },
    { id: "samenleving", label: "Samenleving en burgerschap" },
    { id: "school-dagelijks", label: "School en dagelijks leven" },
    { id: "dieren", label: "Dieren" }
  ];

  const EXPLICIT = {
    "td:1": ["school-dagelijks", "media-communicatie"],
    "td:2": ["gezondheid-bewegen", "school-dagelijks"],
    "td:3": ["kunst-cultuur", "school-dagelijks"],
    "td:4": ["samenleving", "natuur-milieu"],
    "td:5": ["natuur-milieu", "gezondheid-bewegen"],
    "tsk:1": ["samenleving", "school-dagelijks"],
    "tsk:2": ["gezondheid-bewegen", "school-dagelijks"],
    "tsk:3": ["school-dagelijks", "media-communicatie"],
    "tsk:4": ["kunst-cultuur", "school-dagelijks"],
    "tsk:5": ["dieren", "natuur-milieu"],
    "tsk:6": ["samenleving", "school-dagelijks"],
    "tsk:7": ["school-dagelijks"],
    "tsk:8": ["kunst-cultuur", "media-communicatie"],
    "tsk:9": ["kunst-cultuur"],
    "tsk:10": ["school-dagelijks"],
    "fom:1": ["school-dagelijks"],
    "fom:2": ["wetenschap-techniek"],
    "fom:3": ["gezondheid-bewegen", "school-dagelijks"],
    "fom:4": ["kunst-cultuur", "school-dagelijks"],
    "fom:5": ["natuur-milieu", "wereld"],
    "fom:6": ["dieren"],
    "fom:7": ["geschiedenis", "kunst-cultuur"],
    "fom:8": ["kunst-cultuur", "school-dagelijks"],
    "fom:9": ["wetenschap-techniek", "gezondheid-bewegen"],
    "fom:10": ["samenleving", "school-dagelijks"]
  };
  let preparedState = null;

  const KEYWORDS = {
    "natuur-milieu": ["natuur", "milieu", "klimaat", "recycl", "afval", "wateronderzoek", "rivier", "bos", "bospad", "storm", "weer", "oceaan", "tuin", "plant", "bloem", "fossiel", "energie"],
    "wetenschap-techniek": ["wetenschap", "techniek", "robot", "programmeren", "onderzoek", "ruimte", "maan", "uitvinding", "brug", "fiets", "vulkaan", "elektr", "koelkast"],
    geschiedenis: ["geschiedenis", "middeleeuw", "romein", "museum", "fossiel", "vroeger", "oudheid"],
    wereld: ["aardrijkskunde", "wereld", "land", "kaart", "woestijn", "rivier", "oceaan", "station", "stad", "wijk"],
    "gezondheid-bewegen": ["gezondheid", "sport", "voetbal", "keeper", "training", "bewegen", "lichaam", "slaap", "eten", "koken", "recept", "water drinken", "emotie", "dans"],
    "kunst-cultuur": ["kunst", "cultuur", "muziek", "theater", "film", "boek", "bibliotheek", "verhaal", "schrijver", "recensie", "fotografie", "museum", "dans"],
    "media-communicatie": ["media", "communicatie", "nieuws", "blog", "interview", "brief", "e-mail", "telefoon", "reclame", "poster", "taal", "spelling"],
    samenleving: ["samenleving", "burgerschap", "buurt", "gemeente", "verkeer", "plein", "afspraak", "regel", "geld", "uniform", "veilig", "wijk"],
    "school-dagelijks": ["school", "klas", "leerling", "toets", "bibliotheek", "schoolplein", "kamp", "uitje", "boekenkast", "lunch", "speelplein", "stiltehoek", "dagelijks"],
    dieren: ["dier", "bij", "bijen", "egel", "vlinder", "hond", "kat", "cavia", "vogel", "huisdier"]
  };

  function normalize(value) {
    return String(value == null ? "" : value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function validThemes(values) {
    const valid = new Set(THEMES.map((theme) => theme.id));
    return Array.from(new Set((values || []).filter((value) => valid.has(value))));
  }

  function inferThemes(collection, item) {
    if (Array.isArray(item.themas) && item.themas.length) return validThemes(item.themas);
    const explicit = EXPLICIT[collection + ":" + item.id];
    if (explicit) return explicit.slice();
    const heading = normalize([item.onderwerp, item.title, item.label, item.type, item.id].filter(Boolean).join(" "));
    const body = normalize(JSON.stringify(item));
    const scores = THEMES.map((theme) => {
      const words = KEYWORDS[theme.id] || [];
      let score = 0;
      words.forEach((word) => {
        const token = normalize(word);
        if (heading.includes(token)) score += 4;
        if (body.includes(token)) score += 1;
      });
      return { id: theme.id, score };
    }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score);
    if (!scores.length) return ["school-dagelijks"];
    const best = scores[0].score;
    return scores.filter((entry, index) => index < 2 && entry.score >= Math.max(2, best - 2)).map((entry) => entry.id);
  }

  function getItemThemes(collection, item) {
    if (!item) return [];
    if (!Array.isArray(item.themas) || !item.themas.length) item.themas = inferThemes(collection, item);
    return validThemes(item.themas);
  }

  function selectedTheme() {
    const value = new URLSearchParams(window.location.search).get("theme") || ALL;
    return value === ALL || THEMES.some((theme) => theme.id === value) ? value : ALL;
  }

  function filter(collection, items, theme) {
    const chosen = theme || selectedTheme();
    return (items || []).filter((item) => {
      const labels = getItemThemes(collection, item);
      return chosen === ALL || labels.includes(chosen);
    });
  }

  function prepareGlobal(collection, globalName) {
    const items = window[globalName] || [];
    items.forEach((item) => getItemThemes(collection, item));
    const counts = {};
    THEMES.forEach((theme) => {
      counts[theme.id] = items.reduce((total, item) => {
        if (!getItemThemes(collection, item).includes(theme.id)) return total;
        return total + (Array.isArray(item.vragen) && item.vragen.length ? item.vragen.length : 1);
      }, 0);
    });
    const chosen = selectedTheme();
    window[globalName] = filter(collection, items, chosen);
    preparedState = {
      collection,
      selected: chosen,
      counts,
      available: window[globalName].reduce((total, item) => total + (Array.isArray(item.vragen) && item.vragen.length ? item.vragen.length : 1), 0)
    };
    return window[globalName];
  }

  function enrichGlobals() {
    const collections = {
      hzd: "HZD_ITEMS", td: "TD_ITEMS", tsk: "TSK_ITEMS", fom: "FOM_ITEMS", sign: "SIGN_ITEMS",
      vw: "VW_ITEMS", tk: "TK_ITEMS", sam: "SAM_ITEMS", conc: "CONC_ITEMS"
    };
    Object.keys(collections).forEach((collection) => {
      (window[collections[collection]] || []).forEach((item) => getItemThemes(collection, item));
    });
  }

  function label(themeId) {
    if (!themeId || themeId === ALL) return "Alle thema's";
    const theme = THEMES.find((entry) => entry.id === themeId);
    return theme ? theme.label : "Alle thema's";
  }

  function makeSelect(value, counts) {
    const select = document.createElement("select");
    select.className = "theme-select";
    select.setAttribute("aria-label", "Kies een thema");
    [{ id: ALL, label: "Alle thema's" }].concat(THEMES).forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.id;
      option.textContent = theme.label;
      option.selected = theme.id === value;
      if (counts && theme.id !== ALL && !counts[theme.id]) {
        option.disabled = true;
        option.textContent += " (nog niet beschikbaar)";
      }
      select.appendChild(option);
    });
    return select;
  }

  function mountStandaloneSelector() {
    if (document.querySelector("[data-theme-standalone]")) return;
    const countRow = document.querySelector(".countrow");
    if (!countRow || !countRow.parentElement) return;
    const wrap = document.createElement("div");
    wrap.className = "theme-picker";
    wrap.setAttribute("data-theme-standalone", "");
    const title = document.createElement("strong");
    title.textContent = "Thema (optioneel)";
    const select = makeSelect(selectedTheme(), preparedState && preparedState.counts);
    const note = document.createElement("small");
    note.textContent = preparedState
      ? preparedState.available + " unieke passende vragen beschikbaar."
      : "Kies 'Alle thema's' voor algemeen oefenen.";
    select.addEventListener("change", function () {
      const url = new URL(window.location.href);
      if (select.value === ALL) url.searchParams.delete("theme");
      else url.searchParams.set("theme", select.value);
      window.location.href = url.href;
    });
    wrap.append(title, select, note);
    countRow.parentElement.insertBefore(wrap, countRow);
    if (preparedState && preparedState.available === 0) {
      note.textContent = "Voor dit leerdoel is binnen dit thema nog geen materiaal beschikbaar. Kies een ander thema.";
      note.style.color = "#9d2525";
      document.querySelectorAll("[data-menu-start], [data-td-menu-start], [data-tsk-menu-start], [data-fom-menu-start], [data-sign-menu-start], [data-vw-menu-start], [data-tk-menu-start], [data-sam-menu-start], [data-conc-menu-start]").forEach((button) => { button.disabled = true; });
    }
  }

  const style = document.createElement("style");
  style.textContent = ".theme-picker{display:grid;gap:6px;margin:10px 0;padding:10px;border:2px solid rgba(21,32,43,.16);border-radius:12px;background:#f7fafc}.theme-picker strong{font-size:15px}.theme-picker small{color:var(--ink-500,#516174);font-weight:800}.theme-select{width:100%;min-height:44px;padding:7px 10px;border:3px solid var(--ink-900,#15202b);border-radius:12px;background:#fff;color:var(--ink-900,#15202b);font:900 15px var(--font-body,Nunito,system-ui,sans-serif)}";
  document.head.appendChild(style);

  window.SupertoolThemes = {
    ALL,
    themes: THEMES.slice(),
    label,
    makeSelect,
    selectedTheme,
    getItemThemes,
    filter,
    prepareGlobal,
    enrichGlobals,
    mountStandaloneSelector
  };
})();
