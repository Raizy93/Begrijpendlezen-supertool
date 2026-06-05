(function () {
  "use strict";

  const GOALS = [
    { id: "hzd", label: "Hoofdzaak of detail" },
    { id: "td", label: "Tekstdoel herkennen" },
    { id: "tsk", label: "Tekstsoort kiezen" },
    { id: "fom", label: "Feit of mening" },
    { id: "sign", label: "Signaalwoorden" },
    { id: "vw", label: "Verwijswoorden" },
    { id: "tk", label: "Titel of tussenkop" },
    { id: "sam", label: "Samenvatting kiezen" },
    { id: "conc", label: "Conclusie trekken" }
  ];

  const TYPE_LABELS = {};

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function clean(text) {
    return String(text == null ? "" : text);
  }

  function addParagraph(host, text) {
    const p = document.createElement("p");
    p.textContent = clean(text);
    host.appendChild(p);
  }

  function regexEscape(text) {
    return clean(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function appendMarkedText(parent, text, mark) {
    text = clean(text);
    mark = clean(mark);
    if (!mark) {
      parent.textContent = text;
      return;
    }
    const re = new RegExp("(^|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])(" + regexEscape(mark) + ")(?=$|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])", "i");
    const match = re.exec(text);
    if (!match) {
      parent.textContent = text;
      return;
    }
    const start = match.index + match[1].length;
    const end = start + match[2].length;
    parent.append(document.createTextNode(text.slice(0, start)));
    const span = document.createElement("span");
    span.className = "mark";
    span.textContent = text.slice(start, end);
    parent.appendChild(span);
    parent.append(document.createTextNode(text.slice(end)));
  }

  function addMarkedParagraph(host, text, mark) {
    const p = document.createElement("p");
    appendMarkedText(p, text, mark);
    host.appendChild(p);
  }

  function renderAlineas(host, alineas, markedSentence, mark) {
    host.innerHTML = "";
    (alineas || []).forEach((alinea) => {
      const p = document.createElement("p");
      (alinea || []).forEach((zin, index) => {
        if (index) p.append(document.createTextNode(" "));
        if (zin === markedSentence) appendMarkedText(p, zin, mark || zin);
        else p.append(document.createTextNode(clean(zin)));
      });
      host.appendChild(p);
    });
  }

  function renderBlocks(host, blocks) {
    host.innerHTML = "";
    (blocks || []).forEach((block) => {
      if (block.kind === "headline") {
        const h = document.createElement("h3");
        h.textContent = block.text;
        host.appendChild(h);
      } else if (block.kind === "meta" || block.kind === "signature") {
        const p = document.createElement("p");
        p.className = "meta";
        p.textContent = block.text;
        host.appendChild(p);
      } else if (block.kind === "subhead") {
        const h = document.createElement("h3");
        h.textContent = block.text;
        host.appendChild(h);
      } else if (block.kind === "list") {
        const ul = document.createElement("ul");
        (block.items || []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        host.appendChild(ul);
      } else if (block.kind === "steps") {
        const ol = document.createElement("ol");
        (block.items || []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ol.appendChild(li);
        });
        host.appendChild(ol);
      } else if (block.kind === "qa") {
        addParagraph(host, "Vraag: " + block.q);
        addParagraph(host, "Antwoord: " + block.a);
      } else if (block.kind === "quote") {
        addMarkedParagraph(host, block.text, "");
      } else {
        addParagraph(host, block.text);
      }
    });
  }

  function renderBlank(host, sentence) {
    host.innerHTML = "";
    const p = document.createElement("p");
    const parts = clean(sentence).split("{{blank}}");
    p.append(document.createTextNode(parts[0] || ""));
    const span = document.createElement("span");
    span.className = "blank";
    span.textContent = "antwoord";
    p.appendChild(span);
    p.append(document.createTextNode(parts[1] || ""));
    host.appendChild(p);
  }

  function textFromSections(host, item, question) {
    host.innerHTML = "";
    if (question.type === "tussenkop" && typeof question.section === "number") {
      (item.sections[question.section].zinnen || []).forEach((zin) => addParagraph(host, zin));
      return;
    }
    (item.sections || []).forEach((section) => {
      (section.zinnen || []).forEach((zin) => addParagraph(host, zin));
    });
  }

  function goalLabel(id) {
    const goal = GOALS.find((g) => g.id === id);
    return goal ? goal.label : id;
  }

  function makeOption(label, correct, uitleg, hint) {
    return { label: clean(label), correct: !!correct, uitleg: clean(uitleg), hint: clean(hint || "") };
  }

  function buildItems() {
    const out = [];
    const tskTypes = window.TSK_TYPES || [];
    tskTypes.forEach((t) => { TYPE_LABELS[t.id] = t.label; });

    (window.HZD_ITEMS || []).forEach((item) => {
      out.push({
        goal: "hzd",
        topic: item.onderwerp,
        question: "Is de gemarkeerde zin hoofdzaak of detail?",
        render: (host) => renderAlineas(host, [item.zinnen], item.zinnen[item.highlightedIndex], item.zinnen[item.highlightedIndex]),
        options: [
          makeOption("Hoofdzaak", item.correctLabel === "hoofdzaak", item.uitleg, "kern van de tekst"),
          makeOption("Detail", item.correctLabel === "detail", item.uitleg, "extra informatie")
        ]
      });
    });

    (window.TD_ITEMS || []).forEach((item) => {
      out.push({
        goal: "td",
        topic: item.type,
        question: "Wat is het tekstdoel?",
        render: (host) => renderAlineas(host, item.alineas),
        options: item.options.map((o) => makeOption(o, o === item.correct, item.uitleg, "tekstdoel"))
      });
    });

    (window.TSK_ITEMS || []).forEach((item) => {
      out.push({
        goal: "tsk",
        topic: "Tekstsoort",
        question: "Welke tekstsoort is dit?",
        render: (host) => renderBlocks(host, item.blocks),
        options: item.options.map((o) => makeOption(TYPE_LABELS[o] || o, o === item.type, item.uitleg, "tekstsoort"))
      });
    });

    (window.FOM_ITEMS || []).forEach((item) => {
      (item.vragen || []).forEach((vraag) => {
        out.push({
          goal: "fom",
          topic: item.onderwerp,
          question: "Is de gemarkeerde zin een feit of mening?",
          render: (host) => renderAlineas(host, item.alineas, vraag.zin, vraag.zin),
          options: [
            makeOption("Feit", vraag.correct === "feit", vraag.uitleg, "controleerbaar"),
            makeOption("Mening", vraag.correct === "mening", vraag.uitleg, "wat iemand vindt")
          ]
        });
      });
    });

    (window.SIGN_ITEMS || []).forEach((item) => {
      (item.vragen || []).forEach((vraag) => {
        out.push({
          goal: "sign",
          topic: item.onderwerp,
          question: vraag.type === "kies" ? "Welk signaalwoord past op de lege plek?" : "Welk verband geeft het signaalwoord aan?",
          render: (host) => vraag.type === "kies" ? renderBlank(host, vraag.zin) : (host.innerHTML = "", addMarkedParagraph(host, vraag.zin, vraag.mark)),
          options: vraag.options.map((o) => makeOption(o, o === vraag.correct, vraag.uitleg, vraag.type === "kies" ? vraag.relatie : "verband"))
        });
      });
    });

    (window.VW_ITEMS || []).forEach((item) => {
      (item.vragen || []).forEach((vraag) => {
        out.push({
          goal: "vw",
          topic: item.onderwerp,
          question: "Waar verwijst het gemarkeerde woord naar?",
          render: (host) => renderAlineas(host, item.alineas, vraag.zin, vraag.mark),
          options: vraag.options.map((o) => makeOption(o, o === vraag.antwoord, vraag.uitleg, "verwijzing"))
        });
      });
    });

    (window.TK_ITEMS || []).forEach((item) => {
      const vraag = shuffle(item.vragen || [])[0];
      if (!vraag) return;
      out.push({
        goal: "tk",
        topic: item.onderwerp,
        question: vraag.type === "titel" ? "Welke titel past het best?" : "Welke tussenkop past het best?",
        render: (host) => textFromSections(host, item, vraag),
        options: vraag.options.map((o) => makeOption(o, o === vraag.correct, vraag.uitleg, vraag.type))
      });
    });

    (window.SAM_ITEMS || []).forEach((item) => {
      out.push({
        goal: "sam",
        topic: item.onderwerp,
        question: "Welke samenvatting past het best?",
        render: (host) => renderAlineas(host, item.alineas),
        options: item.opties.map((o) => makeOption(o.tekst, o.tekst === item.correct, o.uitleg, o.type || "samenvatting"))
      });
    });

    (window.CONC_ITEMS || []).forEach((item) => {
      out.push({
        goal: "conc",
        topic: item.onderwerp,
        question: "Welke conclusie kun je trekken?",
        render: (host) => renderAlineas(host, item.alineas),
        options: item.opties.map((o) => makeOption(o.tekst, o.tekst === item.correct, o.uitleg, o.type || "conclusie"))
      });
    });

    return out;
  }

  function initMIX(root) {
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));
    const el = {
      menu: $("[data-mix-menu]"),
      game: $("[data-mix-game]"),
      end: $("[data-mix-end]"),
      goals: $("[data-mix-goals]"),
      warning: $("[data-mix-warning]"),
      start: $("[data-mix-start]"),
      all: $("[data-mix-all]"),
      none: $("[data-mix-none]"),
      goal: $("[data-mix-goal]"),
      question: $("[data-mix-question]"),
      story: $("[data-mix-story]"),
      choices: $("[data-mix-choices]"),
      feedback: $("[data-mix-feedback]"),
      next: $("[data-mix-next]"),
      reset: $("[data-mix-reset]"),
      replay: $("[data-mix-replay]"),
      progress: $("[data-mix-progress]"),
      good: $("[data-mix-good]"),
      bad: $("[data-mix-bad]"),
      streak: $("[data-mix-streak]"),
      qnow: $("[data-mix-qnow]"),
      qtot: $("[data-mix-qtot]"),
      endScore: $("[data-mix-endscore]"),
      endTotal: $("[data-mix-endtotal]"),
      endMsg: $("[data-mix-endmsg]"),
      subtitle: $("[data-mix-subtitle]")
    };

    const allItems = buildItems();
    let total = 10, queue = [], idx = 0, good = 0, bad = 0, streak = 0, answered = false;

    function renderGoalChecks() {
      el.goals.innerHTML = "";
      GOALS.forEach((goal) => {
        const label = document.createElement("label");
        label.className = "goal-check";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = goal.id;
        input.checked = true;
        input.setAttribute("data-mix-goal-check", "");
        const span = document.createElement("span");
        span.textContent = goal.label;
        label.append(input, span);
        el.goals.appendChild(label);
      });
    }

    function selectedGoals() {
      return $$("[data-mix-goal-check]").filter((box) => box.checked).map((box) => box.value);
    }

    function setAll(on) {
      $$("[data-mix-goal-check]").forEach((box) => { box.checked = on; });
      syncWarning();
    }

    function syncWarning() {
      const selected = selectedGoals();
      el.warning.textContent = selected.length ? "" : "Kies minimaal een leesdoel.";
      el.start.disabled = !selected.length;
    }

    function makeQueue(limit) {
      const allowed = selectedGoals();
      const pool = allItems.filter((item) => allowed.includes(item.goal));
      const picked = [];
      while (picked.length < limit && pool.length) {
        picked.push.apply(picked, shuffle(pool).slice(0, limit - picked.length));
      }
      return picked;
    }

    function updateStats() {
      el.good.textContent = good;
      el.bad.textContent = bad;
      el.streak.textContent = streak;
      el.qnow.textContent = queue.length ? Math.min(idx + 1, total) : 0;
      el.qtot.textContent = total;
      el.progress.style.width = total ? Math.round((idx / total) * 100) + "%" : "0%";
    }

    function setFeedback(kind, text) {
      el.feedback.classList.remove("good", "bad");
      if (kind) el.feedback.classList.add(kind);
      el.feedback.textContent = text;
    }

    function renderQuestion() {
      answered = false;
      const item = queue[idx];
      el.goal.textContent = goalLabel(item.goal);
      el.question.textContent = item.question;
      el.subtitle.textContent = goalLabel(item.goal) + " oefenen in de mix.";
      item.render(el.story);
      el.choices.innerHTML = "";
      shuffle(item.options).forEach((option) => {
        const btn = document.createElement("button");
        btn.className = "choice";
        const icon = document.createElement("span");
        icon.className = "icon";
        icon.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
        const tx = document.createElement("span");
        const big = document.createElement("span");
        big.className = "big";
        big.textContent = option.label;
        const hint = document.createElement("span");
        hint.className = "hint";
        hint.textContent = option.hint || goalLabel(item.goal);
        tx.append(big, hint);
        btn.append(icon, tx);
        btn.addEventListener("click", () => answer(option, btn));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("", "Lees goed en kies het beste antwoord.");
      updateStats();
    }

    function answer(option, clicked) {
      if (answered) return;
      answered = true;
      const correctOption = queue[idx].options.find((o) => o.correct);
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.querySelector(".big").textContent;
        btn.disabled = true;
        if (correctOption && label === correctOption.label) btn.classList.add("correct");
        else btn.classList.add("dim");
      });
      if (!option.correct) {
        clicked.classList.remove("dim");
        clicked.classList.add("wrong");
        bad++;
        streak = 0;
        setFeedback("bad", "Net niet. " + (option.uitleg || "Kijk nog eens naar de aanwijzingen in de tekst.") + " Goed antwoord: " + (correctOption ? correctOption.label : "") + ".");
      } else {
        good++;
        streak++;
        setFeedback("good", "Mooi! " + (option.uitleg || "Je koos het beste antwoord."));
      }
      el.next.disabled = false;
      updateStats();
    }

    function show(screen) {
      el.menu.classList.toggle("hidden", screen !== "menu");
      el.game.classList.toggle("hidden", screen !== "game");
      el.end.classList.toggle("hidden", screen !== "end");
    }

    function start() {
      syncWarning();
      if (!selectedGoals().length) return;
      queue = makeQueue(total);
      idx = 0;
      good = 0;
      bad = 0;
      streak = 0;
      show("game");
      renderQuestion();
    }

    function next() {
      if (idx + 1 >= total) {
        el.progress.style.width = "100%";
        el.endScore.textContent = good;
        el.endTotal.textContent = total;
        const pct = Math.round((good / total) * 100);
        el.endMsg.textContent = pct >= 80 ? "Sterk gewerkt. Je schakelt goed tussen verschillende leesdoelen." : pct >= 60 ? "Goed geoefend. Kijk vooral naar de uitleg bij de lastige doelen." : "Prima oefenronde. Probeer straks minder snel te kiezen en eerst het doel te herkennen.";
        show("end");
        return;
      }
      idx++;
      renderQuestion();
    }

    renderGoalChecks();
    syncWarning();
    $$("[data-mix-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-mix-count]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        total = Number(btn.getAttribute("data-mix-count")) || 10;
      });
    });
    el.goals.addEventListener("change", syncWarning);
    el.all.addEventListener("click", () => setAll(true));
    el.none.addEventListener("click", () => setAll(false));
    el.start.addEventListener("click", start);
    el.reset.addEventListener("click", start);
    el.replay.addEventListener("click", () => show("menu"));
    el.next.addEventListener("click", next);
  }

  window.initMIX = initMIX;
})();
