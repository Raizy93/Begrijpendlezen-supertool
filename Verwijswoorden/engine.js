(function () {
  "use strict";

  const COLORS = ["vw-blue", "vw-purple", "vw-orange", "vw-green"];
  const PRAISE = ["Goed teruggelezen!", "Scherp!", "Precies!", "Mooi gevonden!", "Knap gekoppeld!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initVW(root, config) {
    config = config || {};
    const texts = (config.items || window.VW_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-vw-menu]"),
      game: $("[data-vw-game]"),
      end: $("[data-vw-end]"),
      story: $("[data-vw-story]"),
      topic: $("[data-vw-topic]"),
      feedback: $("[data-vw-feedback]"),
      choices: $("[data-vw-choices]"),
      good: $("[data-vw-good]"),
      bad: $("[data-vw-bad]"),
      streak: $("[data-vw-streak]"),
      qnow: $("[data-vw-qnow]"),
      qtot: $("[data-vw-qtot]"),
      progress: $("[data-vw-progress]"),
      next: $("[data-vw-next]"),
      reset: $("[data-vw-reset]"),
      replay: $("[data-vw-replay]"),
      endScore: $("[data-vw-endscore]"),
      endTotal: $("[data-vw-endtotal]"),
      endPct: $("[data-vw-endpct]"),
      endMsg: $("[data-vw-endmsg]"),
      stars: $("#vwEndStars"),
      streakbox: $("#vwStreakbox"),
      arrow: $("[data-vw-arrow]")
    };

    let queue = [], idx = 0, total = 15, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const available = window.SupertoolThemes ? window.SupertoolThemes.activeItems("vw", texts) : texts;
      const grouped = shuffle(available).map((text) => ({ text, vragen: shuffle(text.vragen) }));
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

    function appendMarkedText(container, text, cls, attr) {
      const mark = document.createElement("mark");
      mark.className = cls;
      mark.setAttribute(attr, "");
      mark.textContent = text;
      container.appendChild(mark);
    }

    function appendSentence(container, sentence, vraag) {
      let chunks = [{ text: sentence, type: "text" }];

      function isWordChar(char) {
        return !!char && /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/.test(char);
      }

      function findPhrase(text, phrase) {
        let start = 0;
        while (start <= text.length) {
          const pos = text.indexOf(phrase, start);
          if (pos < 0) return -1;
          const before = text.charAt(pos - 1);
          const after = text.charAt(pos + phrase.length);
          if (!isWordChar(before) && !isWordChar(after)) return pos;
          start = pos + Math.max(phrase.length, 1);
        }
        return -1;
      }

      function splitFirst(list, phrase, type) {
        const next = [];
        let used = false;
        list.forEach((chunk) => {
          if (used || chunk.type !== "text") {
            next.push(chunk);
            return;
          }
          const pos = findPhrase(chunk.text, phrase);
          if (pos < 0) {
            next.push(chunk);
            return;
          }
          if (pos > 0) next.push({ text: chunk.text.slice(0, pos), type: "text" });
          next.push({ text: phrase, type });
          const after = chunk.text.slice(pos + phrase.length);
          if (after) next.push({ text: after, type: "text" });
          used = true;
        });
        return next;
      }

      chunks = splitFirst(chunks, vraag.verwijstNaar, "ref");
      if (sentence === vraag.zin) chunks = splitFirst(chunks, vraag.mark, "mark");

      chunks.forEach((chunk) => {
        if (chunk.type === "mark") appendMarkedText(container, chunk.text, "vw-hl", "data-vw-mark");
        else if (chunk.type === "ref") appendMarkedText(container, chunk.text, "vw-ref is-hidden", "data-vw-ref");
        else container.appendChild(document.createTextNode(chunk.text));
      });
      container.appendChild(document.createTextNode(" "));
    }

    function renderStory(text, vraag) {
      el.story.innerHTML = "";
      clearArrow();
      text.alineas.forEach((alinea) => {
        const p = document.createElement("p");
        alinea.forEach((sentence) => appendSentence(p, sentence, vraag));
        el.story.appendChild(p);
      });
    }

    function clearArrow() {
      if (!el.arrow) return;
      el.arrow.setAttribute("width", "0");
      el.arrow.setAttribute("height", "0");
      el.arrow.innerHTML = "";
      el.arrow.style.display = "none";
    }

    function drawArrow() {
      if (!el.arrow) return;
      const mark = el.story.querySelector("[data-vw-mark]");
      const ref = el.story.querySelector("[data-vw-ref]");
      if (!mark || !ref) return;
      const wrap = el.story.getBoundingClientRect();
      const a = mark.getBoundingClientRect();
      const b = ref.getBoundingClientRect();
      const width = Math.max(el.story.scrollWidth, el.story.clientWidth);
      const height = Math.max(el.story.scrollHeight, el.story.clientHeight);
      const sx = a.left - wrap.left + a.width / 2 + el.story.scrollLeft;
      const sy = a.top - wrap.top + a.height / 2 + el.story.scrollTop;
      const ex = b.left - wrap.left + b.width / 2 + el.story.scrollLeft;
      const ey = b.top - wrap.top + b.height / 2 + el.story.scrollTop;
      const curve = Math.max(32, Math.min(130, Math.abs(sy - ey) + 36));
      const c1x = sx;
      const c1y = sy - curve;
      const c2x = ex;
      const c2y = ey - curve;
      const angle = Math.atan2(ey - c2y, ex - c2x);
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const px = -uy;
      const py = ux;
      const headLength = 16;
      const headWidth = 9;
      const baseX = ex - ux * headLength;
      const baseY = ey - uy * headLength;
      const leftX = baseX + px * headWidth;
      const leftY = baseY + py * headWidth;
      const rightX = baseX - px * headWidth;
      const rightY = baseY - py * headWidth;
      el.arrow.setAttribute("width", width);
      el.arrow.setAttribute("height", height);
      el.arrow.setAttribute("viewBox", "0 0 " + width + " " + height);
      el.arrow.innerHTML = '<path d="M' + sx + " " + sy + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + baseX + " " + baseY + '" fill="none" stroke="#f28a2e" stroke-width="4" stroke-linecap="round"/><polygon points="' + ex + "," + ey + " " + leftX + "," + leftY + " " + rightX + "," + rightY + '" fill="#f28a2e"/>';
      el.arrow.style.display = "block";
    }

    function renderQuestion() {
      answered = false;
      const current = queue[idx];
      const vraag = current.vraag;
      el.topic.textContent = current.text.onderwerp;
      renderStory(current.text, vraag);
      el.choices.innerHTML = "";
      shuffle(vraag.options).forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.className = "choice " + COLORS[index % COLORS.length];
        btn.setAttribute("data-vw-choice", choice);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></span><span class="tx"><span class="big">' + choice + '</span><span class="hint">waar verwijst het naar?</span></span>';
        btn.addEventListener("click", () => answer(choice));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", "Lees terug in de tekst. Waar verwijst het gemarkeerde woord naar?");
      updateStats();
    }

    function showReference(correct) {
      const ref = el.story.querySelector("[data-vw-ref]");
      const mark = el.story.querySelector("[data-vw-mark]");
      if (ref) ref.classList.remove("is-hidden");
      if (mark) mark.classList.add(correct ? "is-good" : "is-bad");
      if (ref) ref.classList.add("is-answer");
      window.setTimeout(drawArrow, 80);
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const vraag = current.vraag;
      const correct = choice === vraag.antwoord;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-vw-choice");
        btn.disabled = true;
        if (label === vraag.antwoord) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === choice && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });
      showReference(correct);

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + vraag.uitleg);
      } else {
        bad++;
        streak = 0;
        setFeedback("bad", "<strong>Net niet.</strong> Het juiste antwoord is <strong>" + vraag.antwoord + "</strong>. " + vraag.uitleg);
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
      if (pct >= 80) msg = "Sterk! Je leest goed terug waar woorden naar verwijzen.";
      else if (pct >= 60) msg = "Goed op weg. Kijk steeds naar de zin ervoor en vraag: wie of wat wordt bedoeld?";
      else msg = "Blijf oefenen. Een verwijswoord wijst vaak terug naar een persoon, ding of hele gebeurtenis.";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-vw-count].is-selected") || $("[data-vw-count]");
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
      clearArrow();
      el.menu.style.display = "";
      el.end.style.display = "none";
      el.game.style.display = "none";
      el.streakbox.classList.remove("hot");
    }

    $$("[data-vw-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-vw-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-vw-menu-start]").addEventListener("click", start);
    el.next.addEventListener("click", next);
    el.reset.addEventListener("click", backToStart);
    el.replay.addEventListener("click", backToStart);
    window.addEventListener("resize", () => { if (answered) drawArrow(); });
    el.story.addEventListener("scroll", () => { if (answered) drawArrow(); });
    document.addEventListener("keydown", (e) => {
      if (el.game.style.display === "none") return;
      if ((e.key === "Enter" || e.key === " ") && answered) {
        e.preventDefault();
        next();
      }
    });

    return { start, backToStart };
  }

  window.initVW = initVW;
})();
