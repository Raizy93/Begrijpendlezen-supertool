(function () {
  "use strict";

  const LABELS = {
    feit: { big: "FEIT", hint: "kun je controleren of bewijzen", cls: "fm-feit" },
    mening: { big: "MENING", hint: "wat iemand vindt of voelt", cls: "fm-mening" }
  };
  const PRAISE = ["Goed gezien!", "Scherp!", "Precies!", "Knap gekozen!", "Mooi gecontroleerd!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initFOM(root, config) {
    config = config || {};
    const texts = (config.items || window.FOM_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-fom-menu]"),
      game: $("[data-fom-game]"),
      end: $("[data-fom-end]"),
      story: $("[data-fom-story]"),
      topic: $("[data-fom-topic]"),
      feedback: $("[data-fom-feedback]"),
      choices: $("[data-fom-choices]"),
      good: $("[data-fom-good]"),
      bad: $("[data-fom-bad]"),
      streak: $("[data-fom-streak]"),
      qnow: $("[data-fom-qnow]"),
      qtot: $("[data-fom-qtot]"),
      progress: $("[data-fom-progress]"),
      next: $("[data-fom-next]"),
      reset: $("[data-fom-reset]"),
      replay: $("[data-fom-replay]"),
      endScore: $("[data-fom-endscore]"),
      endTotal: $("[data-fom-endtotal]"),
      endPct: $("[data-fom-endpct]"),
      endMsg: $("[data-fom-endmsg]"),
      stars: $("#fomEndStars"),
      streakbox: $("#fomStreakbox")
    };

    let queue = [], idx = 0, total = 15, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const grouped = shuffle(texts).map((text) => ({
        text,
        vragen: shuffle(text.vragen)
      }));
      const result = [];
      grouped.forEach((group) => {
        group.vragen.forEach((vraag) => {
          if (result.length < limit) result.push({ text: group.text, vraag });
        });
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

    function appendSentence(container, sentence, target) {
      if (sentence === target) {
        const mark = document.createElement("mark");
        mark.className = "fom-hl";
        mark.setAttribute("data-fom-mark", "");
        mark.textContent = sentence;
        container.appendChild(mark);
      } else {
        container.appendChild(document.createTextNode(sentence));
      }
      container.appendChild(document.createTextNode(" "));
    }

    function renderStory(text, vraag) {
      el.story.innerHTML = "";
      text.alineas.forEach((alinea) => {
        const p = document.createElement("p");
        alinea.forEach((sentence) => appendSentence(p, sentence, vraag.zin));
        el.story.appendChild(p);
      });
    }

    function renderQuestion() {
      answered = false;
      const current = queue[idx];
      el.topic.textContent = current.text.onderwerp;
      renderStory(current.text, current.vraag);
      el.choices.innerHTML = "";
      ["feit", "mening"].forEach((label) => {
        const meta = LABELS[label];
        const btn = document.createElement("button");
        btn.className = "choice " + meta.cls;
        btn.setAttribute("data-fom-choice", label);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><span class="tx"><span class="big">' + meta.big + '</span><span class="hint">' + meta.hint + '</span></span>';
        btn.addEventListener("click", () => answer(label));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", "Lees de tekst. Is de gemarkeerde zin een feit of een mening?");
      updateStats();
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const correct = choice === current.vraag.correct;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-fom-choice");
        btn.disabled = true;
        if (label === current.vraag.correct) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === choice && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });
      const mark = el.story.querySelector("[data-fom-mark]");
      if (mark) mark.classList.add(correct ? "is-good" : "is-bad");

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + current.vraag.uitleg);
      } else {
        bad++;
        streak = 0;
        setFeedback("bad", "<strong>Net niet.</strong> Dit is een <strong>" + LABELS[current.vraag.correct].big.toLowerCase() + "</strong>. " + current.vraag.uitleg);
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
      if (pct >= 80) msg = "Sterk! Je ziet goed wat controleerbaar is en wat iemand vindt.";
      else if (pct >= 60) msg = "Goed op weg. Let op woorden als ik vind, mooier, beter en leukste.";
      else msg = "Blijf oefenen. Vraag steeds: kan ik dit controleren, meten of opzoeken?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-fom-count].is-selected") || $("[data-fom-count]");
      const requested = parseInt(selected.getAttribute("data-count"), 10) || 15;
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

    $$("[data-fom-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-fom-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-fom-menu-start]").addEventListener("click", start);
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

  window.initFOM = initFOM;
})();
