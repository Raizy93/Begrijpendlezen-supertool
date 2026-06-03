(function () {
  "use strict";

  const TYPE_META = {
    nieuwsbericht: { big: "NIEUWSBERICHT", hint: "kop, datum, plaats en feiten", cls: "ts-blue" },
    recept: { big: "RECEPT", hint: "ingredienten en stappen", cls: "ts-teal" },
    instructietekst: { big: "INSTRUCTIE", hint: "stappenplan om iets te doen", cls: "ts-green" },
    verhaal: { big: "VERHAAL", hint: "personen en gebeurtenissen", cls: "ts-purple" },
    informatieve_tekst: { big: "INFO-TEKST", hint: "uitleg, feiten en kopjes", cls: "ts-blue" },
    reclame: { big: "RECLAME", hint: "aanprijzen en oproepen", cls: "ts-orange" },
    brief_email: { big: "BRIEF / E-MAIL", hint: "aanhef en afsluiting", cls: "ts-green" },
    interview: { big: "INTERVIEW", hint: "vragen en antwoorden", cls: "ts-purple" },
    recensie: { big: "RECENSIE", hint: "oordeel met argumenten", cls: "ts-orange" },
    dagboek_blog: { big: "DAGBOEK / BLOG", hint: "ik-vorm en ervaring", cls: "ts-pink" }
  };
  const PRAISE = ["Goed gezien!", "Scherp herkend!", "Precies!", "Knap gekozen!", "Mooi gekeken naar de vorm!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initTSK(root, config) {
    config = config || {};
    const items = (config.items || window.TSK_ITEMS || []).slice();
    const types = (config.types || window.TSK_TYPES || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-tsk-menu]"),
      game: $("[data-tsk-game]"),
      end: $("[data-tsk-end]"),
      story: $("[data-tsk-story]"),
      type: $("[data-tsk-type]"),
      feedback: $("[data-tsk-feedback]"),
      choices: $("[data-tsk-choices]"),
      filters: $("[data-tsk-filters]"),
      warning: $("[data-tsk-warning]"),
      good: $("[data-tsk-good]"),
      bad: $("[data-tsk-bad]"),
      streak: $("[data-tsk-streak]"),
      qnow: $("[data-tsk-qnow]"),
      qtot: $("[data-tsk-qtot]"),
      progress: $("[data-tsk-progress]"),
      next: $("[data-tsk-next]"),
      reset: $("[data-tsk-reset]"),
      replay: $("[data-tsk-replay]"),
      endScore: $("[data-tsk-endscore]"),
      endTotal: $("[data-tsk-endtotal]"),
      endPct: $("[data-tsk-endpct]"),
      endMsg: $("[data-tsk-endmsg]"),
      stars: $("#tskEndStars"),
      streakbox: $("#tskStreakbox")
    };

    let pool = [], idx = 0, total = 10, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildFilters() {
      el.filters.innerHTML = "";
      types.forEach((type) => {
        const label = document.createElement("label");
        label.className = "filter-chip";
        label.innerHTML = '<input type="checkbox" data-tsk-filter value="' + type.id + '" checked><span>' + type.label + '</span>';
        el.filters.appendChild(label);
      });
    }

    function selectedTypes() {
      return $$("[data-tsk-filter]").filter((box) => box.checked).map((box) => box.value);
    }

    function setAllFilters(on) {
      $$("[data-tsk-filter]").forEach((box) => { box.checked = on; });
    }

    function setFeedback(state, html) {
      el.feedback.classList.remove("is-good", "is-bad", "is-neutral");
      el.feedback.classList.add("is-" + state);
      el.feedback.innerHTML = html;
    }

    function updateStats() {
      el.good.textContent = good;
      el.bad.textContent = bad;
      el.streak.textContent = streak;
      el.qnow.textContent = Math.min(idx + 1, total);
      el.qtot.textContent = total;
      el.progress.style.width = total ? Math.round((idx / total) * 100) + "%" : "0%";
      el.streakbox.classList.toggle("hot", streak >= 3);
    }

    function renderBlocks(item) {
      el.story.innerHTML = "";
      item.blocks.forEach((block) => {
        let node;
        if (block.kind === "headline") {
          node = document.createElement("h2");
          node.textContent = block.text;
        } else if (block.kind === "subhead") {
          node = document.createElement("h3");
          node.textContent = block.text;
        } else if (block.kind === "meta") {
          node = document.createElement("div");
          node.className = "text-meta";
          node.textContent = block.text;
        } else if (block.kind === "list" || block.kind === "steps") {
          node = block.kind === "steps" ? document.createElement("ol") : document.createElement("ul");
          block.items.forEach((text) => {
            const li = document.createElement("li");
            li.textContent = text;
            node.appendChild(li);
          });
        } else if (block.kind === "qa") {
          node = document.createElement("div");
          node.className = "qa";
          const q = document.createElement("p");
          q.innerHTML = "<strong>Vraag:</strong> " + block.q;
          const a = document.createElement("p");
          a.innerHTML = "<strong>Antwoord:</strong> " + block.a;
          node.append(q, a);
        } else if (block.kind === "quote") {
          node = document.createElement("blockquote");
          node.textContent = block.text;
        } else if (block.kind === "signature") {
          node = document.createElement("p");
          node.className = "signature";
          node.textContent = block.text;
        } else {
          node = document.createElement("p");
          node.textContent = block.text;
        }
        el.story.appendChild(node);
      });
    }

    function renderQuestion() {
      answered = false;
      const item = pool[idx];
      el.type.textContent = item.badge || "Tekst";
      renderBlocks(item);
      el.choices.innerHTML = "";

      item.options.forEach((typeId) => {
        const meta = TYPE_META[typeId];
        const btn = document.createElement("button");
        btn.className = "choice " + meta.cls;
        btn.setAttribute("data-tsk-choice", typeId);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/></svg></span><span class="tx"><span class="big">' + meta.big + '</span><span class="hint">' + meta.hint + '</span></span>';
        btn.addEventListener("click", () => answer(typeId));
        el.choices.appendChild(btn);
      });

      el.next.disabled = true;
      setFeedback("neutral", "Bekijk de vorm van de tekst. Welke tekstsoort herken je?");
      updateStats();
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const item = pool[idx];
      const correct = choice === item.type;

      Array.from(el.choices.children).forEach((btn) => {
        const typeId = btn.getAttribute("data-tsk-choice");
        btn.disabled = true;
        if (typeId === item.type) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (typeId === choice && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + item.uitleg);
      } else {
        bad++;
        streak = 0;
        setFeedback("bad", "<strong>Net niet.</strong> " + item.uitleg);
      }

      el.next.disabled = false;
      el.next.focus();
      updateStats();
    }

    function next() {
      if (!answered) return;
      idx++;
      if (idx >= total) return finish();
      renderQuestion();
    }

    function renderStars(pct) {
      const earned = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
      el.stars.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        const s = document.createElement("span");
        s.className = "estar" + (i < earned ? " on" : "");
        s.style.animationDelay = (0.15 + i * 0.18) + "s";
        s.innerHTML = STAR;
        el.stars.appendChild(s);
      }
    }

    function finish() {
      const pct = Math.round((good / total) * 100);
      el.endScore.textContent = good;
      el.endTotal.textContent = total;
      el.endPct.textContent = pct + "%";
      let msg;
      if (pct >= 80) msg = "Sterk! Je herkent tekstsoorten aan vorm, opbouw en taal.";
      else if (pct >= 60) msg = "Goed op weg. Kijk extra naar kopjes, datum, aanhef, stappen en oordeel.";
      else msg = "Blijf oefenen. Vraag steeds: hoe ziet deze tekst eruit en waar kom je zo'n tekst tegen?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const chosen = selectedTypes();
      const available = items.filter((item) => chosen.includes(item.type));
      if (!available.length) {
        el.warning.textContent = "Kies minimaal 1 tekstsoort om te oefenen.";
        return;
      }
      total = Math.min(parseInt(($("[data-tsk-count].is-selected") || {}).getAttribute?.("data-count") || "10", 10), available.length);
      pool = shuffle(available).slice(0, total);
      idx = 0;
      good = 0;
      bad = 0;
      streak = 0;
      bestStreak = 0;
      el.warning.textContent = total < parseInt(($("[data-tsk-count].is-selected") || {}).getAttribute?.("data-count") || "10", 10) ? "Je hebt minder tekstsoorten gekozen; de oefening gebruikt alle beschikbare teksten." : "";
      el.menu.style.display = "none";
      el.end.style.display = "none";
      el.game.style.display = "";
      renderQuestion();
    }

    function backToStart() {
      el.menu.style.display = "";
      el.end.style.display = "none";
      el.game.style.display = "none";
      el.streakbox.classList.remove("hot");
    }

    buildFilters();
    $("[data-tsk-menu-start]").addEventListener("click", start);
    $("[data-tsk-all]").addEventListener("click", () => setAllFilters(true));
    $("[data-tsk-none]").addEventListener("click", () => setAllFilters(false));
    $$("[data-tsk-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-tsk-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    el.next.addEventListener("click", next);
    el.reset.addEventListener("click", backToStart);
    el.replay.addEventListener("click", backToStart);
    document.addEventListener("keydown", (e) => {
      if (el.game.style.display === "none") return;
      if ((e.key === "Enter" || e.key === " ") && answered) {
        e.preventDefault();
        next();
      }
    });

    return { start, backToStart };
  }

  window.initTSK = initTSK;
})();
