(function () {
  "use strict";

  const COLORS = ["conc-blue", "conc-purple", "conc-orange", "conc-green"];
  const PRAISE = ["Sterke conclusie!", "Goed afgeleid!", "Scherp gelezen!", "Precies!", "Mooi tussen de regels gelezen!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  const TYPE_LABELS = {
    "te sterke conclusie": "te sterke conclusie",
    "staat niet in de tekst": "staat niet in de tekst",
    "tegenstrijdig": "gaat tegen de tekst in",
    "onjuist": "onjuist",
    "verkeerde nadruk": "legt de nadruk verkeerd"
  };

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initCONC(root, config) {
    config = config || {};
    const texts = (config.items || window.CONC_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-conc-menu]"),
      game: $("[data-conc-game]"),
      end: $("[data-conc-end]"),
      story: $("[data-conc-story]"),
      topic: $("[data-conc-topic]"),
      feedback: $("[data-conc-feedback]"),
      choices: $("[data-conc-choices]"),
      good: $("[data-conc-good]"),
      bad: $("[data-conc-bad]"),
      streak: $("[data-conc-streak]"),
      qnow: $("[data-conc-qnow]"),
      qtot: $("[data-conc-qtot]"),
      progress: $("[data-conc-progress]"),
      next: $("[data-conc-next]"),
      reset: $("[data-conc-reset]"),
      replay: $("[data-conc-replay]"),
      endScore: $("[data-conc-endscore]"),
      endTotal: $("[data-conc-endtotal]"),
      endPct: $("[data-conc-endpct]"),
      endMsg: $("[data-conc-endmsg]"),
      stars: $("#concEndStars"),
      streakbox: $("#concStreakbox")
    };

    let queue = [], idx = 0, total = 10, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const available = window.SupertoolThemes ? window.SupertoolThemes.activeItems("conc", texts) : texts;
      return shuffle(available).slice(0, limit);
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

    function renderStory(item) {
      el.story.innerHTML = "";
      item.alineas.forEach((alinea) => {
        const p = document.createElement("p");
        p.textContent = alinea.join(" ");
        el.story.appendChild(p);
      });
    }

    function renderQuestion() {
      answered = false;
      const current = queue[idx];
      el.topic.textContent = current.onderwerp;
      renderStory(current);
      el.choices.innerHTML = "";
      shuffle(current.opties).forEach((option, index) => {
        const btn = document.createElement("button");
        btn.className = "choice " + COLORS[index % COLORS.length];
        btn.setAttribute("data-conc-choice", option.tekst);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19c4-8 12-8 16-14"/><path d="M14 5h6v6"/><path d="M4 19h6"/></svg></span><span class="tx"><span class="big">' + option.tekst + '</span><span class="hint">conclusie</span></span>';
        btn.addEventListener("click", () => answer(option));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", "Lees de aanwijzingen in de tekst. Welke conclusie kun je trekken?");
      updateStats();
    }

    function answer(option) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const correct = option.tekst === current.correct;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-conc-choice");
        btn.disabled = true;
        if (label === current.correct) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === option.tekst && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + option.uitleg);
      } else {
        bad++;
        streak = 0;
        const type = TYPE_LABELS[option.type] || option.type;
        const goodOption = current.opties.find((o) => o.tekst === current.correct);
        setFeedback("bad", "<strong>Net niet.</strong> Deze keuze <strong>" + type + "</strong>. " + option.uitleg + " De beste conclusie is: <strong>" + current.correct + "</strong> " + (goodOption ? goodOption.uitleg : ""));
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
      if (pct >= 80) msg = "Sterk! Je gebruikt tekstaanwijzingen om logische conclusies te trekken.";
      else if (pct >= 60) msg = "Goed op weg. Let erop dat je conclusie uit de tekst moet blijken.";
      else msg = "Blijf oefenen. Zoek eerst aanwijzingen en kies daarna pas de conclusie.";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-conc-count].is-selected") || $("[data-conc-count]");
      const requested = parseInt(selected.getAttribute("data-count"), 10) || 10;
      queue = buildQueue(requested);
      total = queue.length;
      idx = 0;
      good = 0;
      bad = 0;
      streak = 0;
      bestStreak = 0;
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

    $$("[data-conc-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-conc-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-conc-menu-start]").addEventListener("click", start);
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

  window.initCONC = initCONC;
})();
