(function () {
  "use strict";

  const COLORS = ["sam-blue", "sam-purple", "sam-orange", "sam-green"];
  const PRAISE = ["Goed samengevat!", "Scherp gelezen!", "Precies!", "Mooi gekozen!", "Knap de hoofdzaak gezien!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  const TYPE_LABELS = {
    "te gedetailleerd": "te gedetailleerd",
    "te smal": "te smal",
    "te breed": "te breed",
    "onjuist": "onjuist",
    "belangrijk punt mist": "mist een belangrijk punt",
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

  function initSAM(root, config) {
    config = config || {};
    const texts = (config.items || window.SAM_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-sam-menu]"),
      game: $("[data-sam-game]"),
      end: $("[data-sam-end]"),
      story: $("[data-sam-story]"),
      topic: $("[data-sam-topic]"),
      feedback: $("[data-sam-feedback]"),
      choices: $("[data-sam-choices]"),
      good: $("[data-sam-good]"),
      bad: $("[data-sam-bad]"),
      streak: $("[data-sam-streak]"),
      qnow: $("[data-sam-qnow]"),
      qtot: $("[data-sam-qtot]"),
      progress: $("[data-sam-progress]"),
      next: $("[data-sam-next]"),
      reset: $("[data-sam-reset]"),
      replay: $("[data-sam-replay]"),
      endScore: $("[data-sam-endscore]"),
      endTotal: $("[data-sam-endtotal]"),
      endPct: $("[data-sam-endpct]"),
      endMsg: $("[data-sam-endmsg]"),
      stars: $("#samEndStars"),
      streakbox: $("#samStreakbox")
    };

    let queue = [], idx = 0, total = 10, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const available = window.SupertoolThemes ? window.SupertoolThemes.activeItems("sam", texts) : texts;
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
        btn.setAttribute("data-sam-choice", option.tekst);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16H5z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg></span><span class="tx"><span class="big">' + option.tekst + '</span><span class="hint">samenvatting</span></span>';
        btn.addEventListener("click", () => answer(option));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", "Lees de tekst. Welke samenvatting noemt de hoofdzaak en laat kleine details weg?");
      updateStats();
    }

    function answer(option) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const correct = option.tekst === current.correct;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-sam-choice");
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
        setFeedback("bad", "<strong>Net niet.</strong> Deze samenvatting is <strong>" + type + "</strong>. " + option.uitleg + " De beste samenvatting is: <strong>" + current.correct + "</strong> " + (goodOption ? goodOption.uitleg : ""));
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
      if (pct >= 80) msg = "Sterk! Je kiest samenvattingen die de hoofdzaak goed bewaren.";
      else if (pct >= 60) msg = "Goed op weg. Let erop dat een samenvatting klopt, kort is en geen belangrijke punten mist.";
      else msg = "Blijf oefenen. Vraag steeds: wat is de hoofdzaak en welke details kan ik weglaten?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-sam-count].is-selected") || $("[data-sam-count]");
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

    $$("[data-sam-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-sam-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-sam-menu-start]").addEventListener("click", start);
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

  window.initSAM = initSAM;
})();
