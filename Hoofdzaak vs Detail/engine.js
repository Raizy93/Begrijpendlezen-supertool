/* ============================================================
   Hoofdzaak of detail? — gedeelde game-engine
   Skin-onafhankelijk. Elke variant levert markup met data-hzd-* hooks.
   ============================================================ */
(function () {
  "use strict";

  const PRAISE = ["Goed gezien!", "Knap gedaan!", "Scherp!", "Precies!", "Top!", "Lekker bezig!"];
  const STREAK_MSG = { 3: "3 op rij — je bent op dreef!", 5: "5 op rij — wat een reeks!", 8: "8 op rij — onverslaanbaar!", 10: "10 op rij — meester-lezer!" };

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // --- Geluid (WebAudio, klein) ---
  let actx = null;
  function ensureAudio() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
    } catch (e) {}
    return actx;
  }
  function tone(freqs, dur, type) {
    try {
      ensureAudio();
      const t0 = actx.currentTime;
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type || "sine"; o.frequency.value = f;
        const st = t0 + i * (dur / freqs.length);
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.18, st + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, st + dur / freqs.length);
        o.connect(g); g.connect(actx.destination);
        o.start(st); o.stop(st + dur / freqs.length);
      });
    } catch (e) {}
  }

  function initHZD(root, config) {
    config = config || {};
    const items = (config.items || window.HZD_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      start: $("[data-hzd-start]"),
      game: $("[data-hzd-game]"),
      end: $("[data-hzd-end]"),
      story: $("[data-hzd-story]"),
      topic: $("[data-hzd-topic]"),
      feedback: $("[data-hzd-feedback]"),
      next: $("[data-hzd-next]"),
      reset: $("[data-hzd-reset]"),
      good: $("[data-hzd-good]"),
      bad: $("[data-hzd-bad]"),
      streak: $("[data-hzd-streak]"),
      qnow: $("[data-hzd-qnow]"),
      qtot: $("[data-hzd-qtot]"),
      progress: $("[data-hzd-progress]"),
      endscore: $("[data-hzd-endscore]"),
      endtotal: $("[data-hzd-endtotal]"),
      endpct: $("[data-hzd-endpct]"),
      endmsg: $("[data-hzd-endmsg]"),
    };
    const choiceBtns = $$("[data-hzd-choice]");
    const countBtns = $$("[data-hzd-count]");
    const soundSwitches = $$("[data-hzd-sound]");
    const replayBtns = $$("[data-hzd-replay]");

    let pool = [], idx = 0, total = config.defaultCount || 10, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false, soundOn = false;

    function setSound(on) {
      const was = soundOn;
      soundOn = !!on;
      if (soundOn) ensureAudio();
      soundSwitches.forEach((sw) => { sw.classList.toggle("is-on", soundOn); sw.setAttribute("aria-checked", soundOn ? "true" : "false"); });
      if (soundOn && !was) tone([660, 990], 0.18, "sine"); // korte bevestiging dat geluid werkt
    }
    function lock(l) { choiceBtns.forEach((b) => { b.disabled = l; }); }

    function setProgress() {
      if (el.progress) el.progress.style.width = (total ? Math.round((idx / total) * 100) : 0) + "%";
    }
    function updateStats() {
      if (el.good) el.good.textContent = good;
      if (el.bad) el.bad.textContent = bad;
      if (el.streak) el.streak.textContent = streak;
      if (el.qnow) el.qnow.textContent = Math.min(idx + 1, total);
      if (el.qtot) el.qtot.textContent = total;
      setProgress();
    }

    function renderStory(item) {
      el.story.innerHTML = "";
      item.zinnen.forEach((zin, i) => {
        if (i === item.highlightedIndex) {
          const m = document.createElement("mark");
          m.className = "hzd-hl";
          m.setAttribute("data-hzd-mark", "");
          m.textContent = zin;
          el.story.appendChild(m);
        } else {
          el.story.appendChild(document.createTextNode(zin));
        }
        el.story.appendChild(document.createTextNode(" "));
      });
    }

    function feedback(state, html) {
      if (!el.feedback) return;
      el.feedback.classList.remove("is-good", "is-bad", "is-neutral");
      el.feedback.classList.add(state ? "is-" + state : "is-neutral");
      el.feedback.innerHTML = html;
    }

    function showQuestion() {
      answered = false;
      const item = pool[idx];
      if (el.topic) el.topic.textContent = cap(item.onderwerp);
      renderStory(item);
      choiceBtns.forEach((b) => { b.classList.remove("is-correct", "is-wrong", "is-dim"); });
      const mark = el.story.querySelector("[data-hzd-mark]");
      if (mark) mark.classList.remove("is-good", "is-bad");
      lock(false);
      if (el.next) el.next.disabled = true;
      feedback("neutral", config.prompt || "Lees de tekst. Is de <strong>gemarkeerde zin</strong> de hoofdzaak of een detail?");
      updateStats();
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const item = pool[idx];
      const correct = choice === item.correctLabel;
      lock(true);

      choiceBtns.forEach((b) => {
        const lbl = b.getAttribute("data-hzd-choice");
        if (lbl === item.correctLabel) b.classList.add("is-correct");
        else b.classList.add("is-dim");
        if (lbl === choice && !correct) { b.classList.remove("is-dim"); b.classList.add("is-wrong"); }
      });
      const mark = el.story.querySelector("[data-hzd-mark]");
      if (mark) mark.classList.add(correct ? "is-good" : "is-bad");

      if (correct) {
        good++; streak++; bestStreak = Math.max(bestStreak, streak);
        if (soundOn) tone([523, 659, 784], 0.28, "sine");
        let extra = STREAK_MSG[streak] ? ` <span class="hzd-streakmsg">${STREAK_MSG[streak]}</span>` : "";
        const p = PRAISE[(Math.random() * PRAISE.length) | 0];
        feedback("good", `<strong>${p}</strong> ${item.uitleg}${extra}`);
      } else {
        bad++; streak = 0;
        if (soundOn) tone([311, 247], 0.3, "triangle");
        const juist = item.correctLabel === "hoofdzaak" ? "hoofdzaak" : "detail";
        feedback("bad", `<strong>Net niet.</strong> Dit is een <strong>${juist}</strong>. ${item.uitleg}`);
      }
      if (el.next) { el.next.disabled = false; el.next.focus(); }
      if (typeof config.onAnswer === "function") config.onAnswer(correct, item, { good, bad, streak });
      updateStats();
    }

    function next() {
      if (!answered) return;
      idx++;
      if (idx >= total) return finish();
      showQuestion();
    }

    function finish() {
      const pct = total ? Math.round((good / total) * 100) : 0;
      if (el.endscore) el.endscore.textContent = good;
      if (el.endtotal) el.endtotal.textContent = total;
      if (el.endpct) el.endpct.textContent = pct + "%";
      if (el.endmsg) {
        let m;
        if (pct >= 90) m = "Wauw! Je herkent de hoofdzaak bijna altijd. Echt meesterlijk.";
        else if (pct >= 70) m = "Goed bezig! Je voelt het verschil tussen hoofdzaak en detail goed aan.";
        else if (pct >= 50) m = "Op de goede weg. Let op signaalwoorden: getallen en namen wijzen vaak op een detail.";
        else m = "Blijven oefenen helpt. Vraag jezelf steeds af: waar gaat het hele stukje over?";
        if (bestStreak >= 3) m += ` Langste reeks: ${bestStreak} op rij.`;
        el.endmsg.textContent = m;
      }
      if (soundOn) tone([523, 659, 784, 1047], 0.5, "sine");
      if (typeof config.onFinish === "function") config.onFinish({ good, bad, total, pct, bestStreak });
      if (el.game) el.game.style.display = "none";
      if (el.end) el.end.style.display = "";
    }

    function startGame(count) {
      const available = window.SupertoolThemes ? window.SupertoolThemes.activeItems("hzd", items) : items;
      pool = shuffle(available.slice()).slice(0, count);
      total = pool.length;
      if (!total) return;
      idx = 0; good = 0; bad = 0; streak = 0; bestStreak = 0;
      if (el.start) el.start.style.display = "none";
      if (el.end) el.end.style.display = "none";
      if (el.game) el.game.style.display = "";
      showQuestion();
    }

    function backToStart() {
      if (el.game) el.game.style.display = "none";
      if (el.end) el.end.style.display = "none";
      if (el.start) el.start.style.display = "";
    }

    // --- Events ---
    choiceBtns.forEach((b) => b.addEventListener("click", () => answer(b.getAttribute("data-hzd-choice"))));
    if (el.next) el.next.addEventListener("click", next);
    if (el.reset) el.reset.addEventListener("click", backToStart);
    countBtns.forEach((b) => b.addEventListener("click", () => startGame(parseInt(b.getAttribute("data-count"), 10) || 10)));
    replayBtns.forEach((b) => b.addEventListener("click", backToStart));
    soundSwitches.forEach((sw) => {
      const toggle = () => setSound(!soundOn);
      sw.addEventListener("click", toggle);
      sw.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });

    root.addEventListener("keydown", (e) => { handleKey(e); });
    document.addEventListener("keydown", (e) => { if (root.contains(document.activeElement) || config.captureGlobalKeys) handleKey(e); });
    function handleKey(e) {
      if (el.game && el.game.style.display === "none") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); answer("hoofdzaak"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); answer("detail"); }
      else if (e.key === "Enter" || e.key === " ") { if (answered) { e.preventDefault(); next(); } }
    }

    setSound(false);
    if (config.autostart) startGame(config.defaultCount || 10);

    return { startGame, backToStart, get state() { return { idx, total, good, bad, streak }; } };
  }

  window.initHZD = initHZD;
})();
