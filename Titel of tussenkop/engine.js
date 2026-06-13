(function () {
  "use strict";

  const COLORS = ["tk-blue", "tk-purple", "tk-orange", "tk-green"];
  const PRAISE = ["Goede kop gekozen!", "Scherp gelezen!", "Precies!", "Mooi passend!", "Knap gekeken naar de kern!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initTK(root, config) {
    config = config || {};
    const texts = (config.items || window.TK_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-tk-menu]"),
      game: $("[data-tk-game]"),
      end: $("[data-tk-end]"),
      story: $("[data-tk-story]"),
      topic: $("[data-tk-topic]"),
      prompt: $("[data-tk-prompt]"),
      feedback: $("[data-tk-feedback]"),
      choices: $("[data-tk-choices]"),
      good: $("[data-tk-good]"),
      bad: $("[data-tk-bad]"),
      streak: $("[data-tk-streak]"),
      qnow: $("[data-tk-qnow]"),
      qtot: $("[data-tk-qtot]"),
      progress: $("[data-tk-progress]"),
      next: $("[data-tk-next]"),
      reset: $("[data-tk-reset]"),
      replay: $("[data-tk-replay]"),
      endScore: $("[data-tk-endscore]"),
      endTotal: $("[data-tk-endtotal]"),
      endPct: $("[data-tk-endpct]"),
      endMsg: $("[data-tk-endmsg]"),
      stars: $("#tkEndStars"),
      streakbox: $("#tkStreakbox")
    };

    let queue = [], idx = 0, total = 10, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const result = [];
      const available = window.SupertoolThemes ? window.SupertoolThemes.activeItems("tk", texts) : texts;
      shuffle(available).forEach((text) => {
        const vragen = shuffle(text.vragen || []);
        if (vragen.length && result.length < limit) {
          result.push({ text, vraag: vragen[0] });
        }
      });
      return result;
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

    function makeHeading(tag, text, missing, attr) {
      const node = document.createElement(tag);
      if (missing) {
        node.className = "missing-head";
        node.setAttribute(attr, "");
        node.textContent = tag === "h2" ? "Titel ontbreekt" : "Tussenkop ontbreekt";
      } else {
        node.textContent = text;
      }
      return node;
    }

    function renderStory(text, vraag) {
      el.story.innerHTML = "";
      el.story.appendChild(makeHeading("h2", text.titel, vraag.type === "titel", "data-tk-missing"));
      text.sections.forEach((section, index) => {
        const missing = vraag.type === "tussenkop" && vraag.section === index;
        el.story.appendChild(makeHeading("h3", section.kop, missing, "data-tk-missing"));
        section.zinnen.forEach((zin) => {
          const p = document.createElement("p");
          p.textContent = zin;
          el.story.appendChild(p);
        });
      });
    }

    function renderQuestion() {
      answered = false;
      const current = queue[idx];
      const vraag = current.vraag;
      el.topic.textContent = current.text.onderwerp;
      el.prompt.textContent = vraag.type === "titel" ? "Welke titel past het best bij de hele tekst?" : "Welke tussenkop past het best bij dit stukje tekst?";
      renderStory(current.text, vraag);
      el.choices.innerHTML = "";
      shuffle(vraag.options).forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.className = "choice " + COLORS[index % COLORS.length];
        btn.setAttribute("data-tk-choice", choice);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h16"/></svg></span><span class="tx"><span class="big">' + choice + '</span><span class="hint">' + (vraag.type === "titel" ? "titel" : "tussenkop") + '</span></span>';
        btn.addEventListener("click", () => answer(choice));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", vraag.type === "titel" ? "Lees de hele tekst. Welke titel noemt het belangrijkste onderwerp?" : "Lees vooral de alinea onder het lege vak. Welke tussenkop vat die alinea goed samen?");
      updateStats();
    }

    function revealHeading(correct) {
      const missing = el.story.querySelector("[data-tk-missing]");
      if (!missing) return;
      const current = queue[idx];
      missing.textContent = current.vraag.correct;
      missing.classList.add(correct ? "is-good" : "is-bad");
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const vraag = current.vraag;
      const correct = choice === vraag.correct;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-tk-choice");
        btn.disabled = true;
        if (label === vraag.correct) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === choice && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });
      revealHeading(correct);

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + vraag.uitleg);
      } else {
        bad++;
        streak = 0;
        setFeedback("bad", "<strong>Net niet.</strong> De beste keuze is <strong>" + vraag.correct + "</strong>. " + vraag.uitleg);
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
      if (pct >= 80) msg = "Sterk! Je kiest koppen die goed bij de kern van de tekst passen.";
      else if (pct >= 60) msg = "Goed op weg. Let op: een titel past bij de hele tekst, een tussenkop bij een deel.";
      else msg = "Blijf oefenen. Vraag steeds: waar gaat deze hele tekst of deze alinea vooral over?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-tk-count].is-selected") || $("[data-tk-count]");
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

    $$("[data-tk-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-tk-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-tk-menu-start]").addEventListener("click", start);
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

  window.initTK = initTK;
})();
