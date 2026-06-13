(function () {
  "use strict";

  const RELATIONS = {
    opsomming: { big: "OPSOMMING", hint: "er komt iets bij", cls: "sig-blue" },
    tegenstelling: { big: "TEGENSTELLING", hint: "iets staat tegenover elkaar", cls: "sig-purple" },
    oorzaak: { big: "OORZAAK-GEVOLG", hint: "waardoor of wat gebeurt erna", cls: "sig-green" },
    reden: { big: "REDEN", hint: "waarom iets zo is", cls: "sig-orange" },
    voorbeeld: { big: "VOORBEELD", hint: "een voorbeeld wordt genoemd", cls: "sig-teal" },
    tijd: { big: "TIJD/VOLGORDE", hint: "wat eerst, daarna of later komt", cls: "sig-pink" },
    conclusie: { big: "CONCLUSIE", hint: "samenvatting of gevolgtrekking", cls: "sig-gold" }
  };

  const PRAISE = ["Goed gezien!", "Scherp gelezen!", "Precies!", "Mooi verbonden!", "Knap gekozen!"];
  const STAR = '<svg viewBox="0 0 24 24"><path class="st" d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 22l1.2-6.5L2.5 8.9 9.1 8z"/></svg>';

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function optionLabel(value, type) {
    if (type === "verband") return RELATIONS[value] ? RELATIONS[value].big : value.toUpperCase();
    return value;
  }

  function optionHint(value, type) {
    if (type === "verband") return RELATIONS[value] ? RELATIONS[value].hint : "";
    return "signaalwoord";
  }

  function optionClass(value, type, index) {
    if (type === "verband" && RELATIONS[value]) return RELATIONS[value].cls;
    return ["sig-blue", "sig-purple", "sig-orange", "sig-green"][index % 4];
  }

  function initSIGN(root, config) {
    config = config || {};
    const texts = (config.items || window.SIGN_ITEMS || []).slice();
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    const el = {
      menu: $("[data-sign-menu]"),
      game: $("[data-sign-game]"),
      end: $("[data-sign-end]"),
      story: $("[data-sign-story]"),
      topic: $("[data-sign-topic]"),
      prompt: $("[data-sign-prompt]"),
      feedback: $("[data-sign-feedback]"),
      choices: $("[data-sign-choices]"),
      good: $("[data-sign-good]"),
      bad: $("[data-sign-bad]"),
      streak: $("[data-sign-streak]"),
      qnow: $("[data-sign-qnow]"),
      qtot: $("[data-sign-qtot]"),
      progress: $("[data-sign-progress]"),
      next: $("[data-sign-next]"),
      reset: $("[data-sign-reset]"),
      replay: $("[data-sign-replay]"),
      endScore: $("[data-sign-endscore]"),
      endTotal: $("[data-sign-endtotal]"),
      endPct: $("[data-sign-endpct]"),
      endMsg: $("[data-sign-endmsg]"),
      stars: $("#signEndStars"),
      streakbox: $("#signStreakbox")
    };

    let queue = [], idx = 0, total = 15, good = 0, bad = 0, streak = 0, bestStreak = 0, answered = false;

    function buildQueue(limit) {
      const grouped = shuffle(texts).map((text) => ({ text, vragen: shuffle(text.vragen) }));
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

    function appendHighlightedWord(container, sentence, vraag) {
      const pos = sentence.indexOf(vraag.mark);
      if (pos < 0) {
        container.appendChild(document.createTextNode(sentence + " "));
        return;
      }
      container.appendChild(document.createTextNode(sentence.slice(0, pos)));
      const mark = document.createElement("mark");
      mark.className = "sig-hl";
      mark.setAttribute("data-sign-mark", "");
      mark.textContent = vraag.mark;
      container.appendChild(mark);
      container.appendChild(document.createTextNode(sentence.slice(pos + vraag.mark.length) + " "));
    }

    function appendBlankSentence(container, sentence, word) {
      const pos = sentence.indexOf(word);
      if (pos < 0) {
        container.appendChild(document.createTextNode(sentence + " "));
        return;
      }
      container.appendChild(document.createTextNode(sentence.slice(0, pos)));
      const mark = document.createElement("mark");
      mark.className = "sig-blank";
      mark.setAttribute("data-sign-mark", "");
      mark.textContent = "_____";
      container.appendChild(mark);
      container.appendChild(document.createTextNode(sentence.slice(pos + word.length) + " "));
    }

    function appendSentence(container, sentence, vraag) {
      if (vraag.type === "verband" && sentence === vraag.zin) appendHighlightedWord(container, sentence, vraag);
      else if (vraag.type === "kies" && sentence === vraag.target) appendBlankSentence(container, sentence, vraag.correct);
      else container.appendChild(document.createTextNode(sentence + " "));
    }

    function contextAlineas(text, vraag) {
      const target = vraag.type === "kies" ? vraag.target : vraag.zin;
      const matching = (text.alineas || []).find((alinea) => alinea.includes(target));
      if (matching) return [matching];
      const fallback = (text.alineas || []).reduce((all, alinea) => all.concat(alinea), []).slice(0, 4);
      return fallback.length ? [fallback] : [];
    }

    function renderStory(text, vraag) {
      el.story.innerHTML = "";
      contextAlineas(text, vraag).forEach((alinea) => {
        const p = document.createElement("p");
        alinea.forEach((sentence) => appendSentence(p, sentence, vraag));
        el.story.appendChild(p);
      });
    }

    function renderQuestion() {
      answered = false;
      const current = queue[idx];
      const vraag = current.vraag;
      el.topic.textContent = current.text.onderwerp;
      el.prompt.textContent = vraag.type === "verband" ? "Welk verband geeft het gemarkeerde signaalwoord aan?" : "Welk signaalwoord past het best op de lege plek?";
      renderStory(current.text, vraag);
      el.choices.innerHTML = "";
      shuffle(vraag.options).forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.className = "choice " + optionClass(choice, vraag.type, index);
        btn.setAttribute("data-sign-choice", choice);
        btn.innerHTML = '<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg></span><span class="tx"><span class="big">' + optionLabel(choice, vraag.type) + '</span><span class="hint">' + optionHint(choice, vraag.type) + '</span></span>';
        btn.addEventListener("click", () => answer(choice));
        el.choices.appendChild(btn);
      });
      el.next.disabled = true;
      setFeedback("neutral", vraag.type === "verband" ? "Lees rondom het gemarkeerde woord. Welk verband laat het zien?" : "Lees de zin ervoor en erna. Welk signaalwoord maakt het verband logisch?");
      updateStats();
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      const current = queue[idx];
      const vraag = current.vraag;
      const correct = choice === vraag.correct;
      Array.from(el.choices.children).forEach((btn) => {
        const label = btn.getAttribute("data-sign-choice");
        btn.disabled = true;
        if (label === vraag.correct) btn.classList.add("is-correct");
        else btn.classList.add("is-dim");
        if (label === choice && !correct) {
          btn.classList.remove("is-dim");
          btn.classList.add("is-wrong");
        }
      });
      const mark = el.story.querySelector("[data-sign-mark]");
      if (mark) {
        if (vraag.type === "kies") mark.textContent = vraag.correct;
        mark.classList.add(correct ? "is-good" : "is-bad");
      }

      if (correct) {
        good++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        const praise = PRAISE[(Math.random() * PRAISE.length) | 0];
        setFeedback("good", "<strong>" + praise + "</strong> " + vraag.uitleg);
      } else {
        bad++;
        streak = 0;
        const label = vraag.type === "verband" ? optionLabel(vraag.correct, "verband").toLowerCase() : "\"" + vraag.correct + "\"";
        setFeedback("bad", "<strong>Net niet.</strong> Het juiste antwoord is <strong>" + label + "</strong>. " + vraag.uitleg);
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
      if (pct >= 80) msg = "Sterk! Je herkent goed hoe zinnen met elkaar verbonden zijn.";
      else if (pct >= 60) msg = "Goed op weg. Let steeds op wat het woord doet: toevoegen, uitleggen, tegenstellen of afronden.";
      else msg = "Blijf oefenen. Vraag jezelf af: komt er een reden, voorbeeld, tegenstelling, volgorde of conclusie?";
      if (bestStreak >= 3) msg += " Langste reeks: " + bestStreak + " op rij.";
      el.endMsg.textContent = msg;
      renderStars(pct);
      el.game.style.display = "none";
      el.end.style.display = "";
    }

    function start() {
      const selected = $("[data-sign-count].is-selected") || $("[data-sign-count]");
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

    $$("[data-sign-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-sign-count]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });
    $("[data-sign-menu-start]").addEventListener("click", start);
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

  window.initSIGN = initSIGN;
})();
