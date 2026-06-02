(function () {
  "use strict";

  const LABELS = {
    informeren: { big: "INFORMEREN", hint: "iets vertellen of uitleggen", cls: "td-info" },
    overtuigen: { big: "OVERTUIGEN", hint: "zorgen dat je iets gaat vinden", cls: "td-overtuig" },
    vermaken: { big: "VERMAKEN", hint: "je laten genieten of meeleven", cls: "td-vermaak" },
    instrueren: { big: "INSTRUEREN", hint: "uitleggen wat je moet doen", cls: "td-instrueer" },
    overhalen: { big: "OVERHALEN", hint: "zorgen dat je iets gaat doen", cls: "td-extra" },
    mening: { big: "MENING GEVEN", hint: "laten zien wat iemand vindt", cls: "td-overtuig" },
    waarschuwen: { big: "WAARSCHUWEN", hint: "zorgen dat je oplet", cls: "td-extra" }
  };
  const PRAISE = ["Goed gezien!", "Scherp gelezen!", "Precies!", "Knap gekozen!", "Mooi beredeneerd!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initTD(root, config) {
    config = config || {};
    const items = (config.items || window.TD_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);

    const el = {
      menu: $("[data-td-menu]"),
      game: $("[data-td-game]"),
      end: $("[data-td-end]"),
      story: $("[data-td-story]"),
      type: $("[data-td-type]"),
      feedback: $("[data-td-feedback]"),
      choices: $("[data-td-choices]"),
      good: $("[data-td-good]"),
      bad: $("[data-td-bad]"),
      streak: $("[data-td-streak]"),
      qnow: $("[data-td-qnow]"),
      qtot: $("[data-td-qtot]"),
      progress: $("[data-td-progress]"),
      next: $("[data-td-next]"),
      reset: $("[data-td-reset]"),
      replay: $("[data-td-replay]"),
      endScore: $("[data-td-endscore]"),
      endTotal: $("[data-td-endtotal]"),
      endPct: $("[data-td-endpct]"),
      endMsg: $("[data-td-endmsg]"),
      stars: $("#tdEndStars"),
      streakbox: $("#tdStreakbox")
    };

    let pool = [], idx = 0, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function setFeedback(state, html) {
      el.feedback.classList.remove("is-good", "is-bad", "is-neutral");
      el.feedback.classList.add("is-" + state);
      el.feedback.innerHTML = html;
    }

    function updateStats() {
      el.good.textContent = good;
      el.bad.textContent = bad;
      el.streak.textContent = streak;
      el.qnow.textContent = Math.min(idx + 1, pool.length);
      el.qtot.textContent = pool.length;
      el.progress.style.width = pool.length ? Math.round((idx / pool.length) * 100) + "%" : "0%";
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
      const item = pool[idx];
      el.type.textContent = item.type;
      renderStory(item);
      el.choices.innerHTML = "";

      item.options.forEach((label) => {
        const meta = LABELS[label];
        const btn = document.createElement("button");
        btn.className = "choice " + meta.cls;
        btn.setAttribute("data-td-choice", label);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></span><span class="tx"><span class="big">' + meta.big + '</span><span class="hint">' + meta.hint + '</span></span>';
        btn.addEventListener("click", () => answer(label));
        el.choices.appendChild(btn);
      });

      el.next.disabled = true;
      setFeedback("neutral", "Lees de hele tekst. Wat wil de schrijver vooral bereiken?");
      updateStats();
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const item = pool[idx];
      const correct = choice === item.correct;

      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-td-choice");
        btn.disabled = true;
        if (label === item.correct) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === choice && !correct) {
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
        setFeedback("bad", "<strong>Net niet.</strong> Het beste antwoord is <strong>" + LABELS[item.correct].big.toLowerCase() + "</strong>. " + item.uitleg);
      }

      el.next.disabled = false;
      el.next.focus();
      updateStats();
    }

    function next() {
      if (!answered) return;
      idx++;
      if (idx >= pool.length) return finish();
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
      const pct = Math.round((good / pool.length) * 100);
      el.endScore.textContent = good;
      el.endTotal.textContent = pool.length;
      el.endPct.textContent = pct + "%";
      let msg;
      if (pct >= 80) msg = "Sterk! Je kijkt goed naar de bedoeling van de schrijver.";
      else if (pct >= 60) msg = "Goed op weg. Let vooral op woorden die actie, mening of gevaar laten zien.";
      else msg = "Blijf oefenen. Vraag steeds: wat wil de schrijver dat ik weet, vind, voel of doe?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      pool = shuffle(items);
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

    $("[data-td-menu-start]").addEventListener("click", start);
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

  window.initTD = initTD;
})();
