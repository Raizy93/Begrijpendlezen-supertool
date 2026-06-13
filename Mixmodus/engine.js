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

  function isWordChar(char) {
    return !!char && /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/.test(char);
  }

  function findPhrase(text, phrase) {
    text = clean(text);
    phrase = clean(phrase);
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

  function appendVwMarkedText(container, text, cls, attr) {
    const mark = document.createElement("mark");
    mark.className = cls;
    mark.setAttribute(attr, "");
    mark.textContent = text;
    container.appendChild(mark);
  }

  function appendVwSentence(container, sentence, vraag) {
    let chunks = [{ text: sentence, type: "text" }];

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
      if (chunk.type === "mark") appendVwMarkedText(container, chunk.text, "vw-hl", "data-mix-vw-mark");
      else if (chunk.type === "ref") appendVwMarkedText(container, chunk.text, "vw-ref is-hidden", "data-mix-vw-ref");
      else container.appendChild(document.createTextNode(chunk.text));
    });
    container.appendChild(document.createTextNode(" "));
  }

  function renderVwStory(host, text, vraag) {
    host.innerHTML = '<svg class="vw-arrow" data-mix-vw-arrow aria-hidden="true"></svg>';
    text.alineas.forEach((alinea) => {
      const p = document.createElement("p");
      alinea.forEach((sentence) => appendVwSentence(p, sentence, vraag));
      host.appendChild(p);
    });
  }

  function drawVwArrow(story) {
    const arrow = story.querySelector("[data-mix-vw-arrow]");
    const mark = story.querySelector("[data-mix-vw-mark]");
    const ref = story.querySelector("[data-mix-vw-ref]");
    if (!arrow || !mark || !ref) return;
    const wrap = story.getBoundingClientRect();
    const a = mark.getBoundingClientRect();
    const b = ref.getBoundingClientRect();
    const width = Math.max(story.scrollWidth, story.clientWidth);
    const height = Math.max(story.scrollHeight, story.clientHeight);
    const sx = a.left - wrap.left + a.width / 2 + story.scrollLeft;
    const sy = a.top - wrap.top + a.height / 2 + story.scrollTop;
    const ex = b.left - wrap.left + b.width / 2 + story.scrollLeft;
    const ey = b.top - wrap.top + b.height / 2 + story.scrollTop;
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
    arrow.setAttribute("width", width);
    arrow.setAttribute("height", height);
    arrow.setAttribute("viewBox", "0 0 " + width + " " + height);
    arrow.innerHTML = '<path d="M' + sx + " " + sy + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + baseX + " " + baseY + '" fill="none" stroke="#f28a2e" stroke-width="4" stroke-linecap="round"/><polygon points="' + ex + "," + ey + " " + leftX + "," + leftY + " " + rightX + "," + rightY + '" fill="#f28a2e"/>';
    arrow.style.display = "block";
  }

  function showVwReference(story, correct) {
    const ref = story.querySelector("[data-mix-vw-ref]");
    const mark = story.querySelector("[data-mix-vw-mark]");
    if (ref) {
      ref.classList.remove("is-hidden");
      ref.classList.add("is-answer");
    }
    if (mark) mark.classList.add(correct ? "is-good" : "is-bad");
    window.setTimeout(() => drawVwArrow(story), 80);
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

  function appendSignalBlank(parent, sentence, word) {
    const pos = findPhrase(sentence, word);
    if (pos < 0) {
      parent.append(document.createTextNode(clean(sentence)));
      return;
    }
    parent.append(document.createTextNode(sentence.slice(0, pos)));
    const span = document.createElement("span");
    span.className = "blank";
    span.textContent = "antwoord";
    parent.appendChild(span);
    parent.append(document.createTextNode(sentence.slice(pos + word.length)));
  }

  function renderSignalContext(host, item, vraag) {
    host.innerHTML = "";
    const target = vraag.type === "kies" ? vraag.target : vraag.zin;
    const matching = (item.alineas || []).find((alinea) => alinea.includes(target));
    const fallback = (item.alineas || []).reduce((all, alinea) => all.concat(alinea), []).slice(0, 4);
    const sentences = matching || fallback;
    const p = document.createElement("p");
    (sentences || []).forEach((sentence, index) => {
      if (index) p.append(document.createTextNode(" "));
      if (sentence !== target) p.append(document.createTextNode(clean(sentence)));
      else if (vraag.type === "kies") appendSignalBlank(p, sentence, vraag.correct);
      else appendMarkedText(p, sentence, vraag.mark);
    });
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
          render: (host) => renderSignalContext(host, item, vraag),
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
          render: (host) => renderVwStory(host, item, vraag),
          onAnswer: (correct, host) => showVwReference(host, correct),
          redraw: (host) => drawVwArrow(host),
          options: vraag.options.map((o) => makeOption(o, o === vraag.antwoord, vraag.uitleg, "verwijzing"))
        });
      });
    });

    (window.TK_ITEMS || []).forEach((item) => {
      const vraag = (item.vragen || [])[0];
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

    return out.map((item, index) => {
      item.resumeId = item.goal + ":" + index;
      return item;
    });
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
    const taskMode = new URLSearchParams(window.location.search).get("assignment") === "1";
    const taskContext = readTaskContext();
    let total = 10, queue = [], idx = 0, good = 0, bad = 0, streak = 0, answered = false;
    let answers = [];

    function readJson(key) {
      try {
        return JSON.parse(sessionStorage.getItem(key) || "null");
      } catch (error) {
        return null;
      }
    }

    function readTaskContext() {
      if (!taskMode) return null;
      const student = readJson("supertool_student");
      const assignment = readJson("supertool_assignment");
      if (!student || !assignment) return null;
      return { student, assignment };
    }

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
      if (taskContext && taskContext.assignment && Array.isArray(taskContext.assignment.goals)) {
        return taskContext.assignment.goals.slice();
      }
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
      const allowed = selectedGoals().filter((goal) => allItems.some((item) => item.goal === goal));
      const picked = [];
      if (!allowed.length) return picked;

      const goals = shuffle(allowed);
      const base = Math.floor(limit / goals.length);
      let extra = limit % goals.length;

      goals.forEach((goal) => {
        const quota = base + (extra > 0 ? 1 : 0);
        if (extra > 0) extra--;
        const source = allItems.filter((item) => item.goal === goal);
        let bag = shuffle(source);
        for (let i = 0; i < quota; i++) {
          if (!bag.length) bag = shuffle(source);
          if (bag.length) picked.push(bag.pop());
        }
      });

      return shuffle(picked).slice(0, limit);
    }

    function updateStats() {
      el.good.textContent = good;
      el.bad.textContent = bad;
      el.streak.textContent = streak;
      el.qnow.textContent = queue.length ? Math.min(idx + 1, total) : 0;
      el.qtot.textContent = total;
      el.progress.style.width = total ? Math.round((idx / total) * 100) + "%" : "0%";
    }

    function goalSummary() {
      const summary = {};
      answers.forEach((answer) => {
        if (!summary[answer.goal]) summary[answer.goal] = { good: 0, total: 0 };
        summary[answer.goal].total++;
        if (answer.correct) summary[answer.goal].good++;
      });
      return summary;
    }

    function assignmentId() {
      if (!taskContext || !taskContext.assignment) return null;
      return taskContext.assignment.assignment_id || taskContext.assignment.id || null;
    }

    function progressPayload(nextIndex) {
      return {
        version: 1,
        total,
        queueIds: queue.map((item) => item.resumeId),
        nextIndex,
        good,
        bad,
        streak,
        answers
      };
    }

    async function saveTaskProgress(nextIndex) {
      const id = assignmentId();
      if (!id || !window.createSupertoolClient) return false;
      try {
        const client = window.createSupertoolClient();
        const { error } = await client.rpc("save_student_assignment_progress", {
          p_student_id: taskContext.student.studentId,
          p_login_code: taskContext.student.loginCode,
          p_assignment_id: id,
          p_state: progressPayload(nextIndex)
        });
        return !error;
      } catch (error) {
        return false;
      }
    }

    async function restoreTaskProgress() {
      const id = assignmentId();
      if (!id || !window.createSupertoolClient) return false;
      try {
        const client = window.createSupertoolClient();
        const { data, error } = await client.rpc("student_assignment_progress", {
          p_student_id: taskContext.student.studentId,
          p_login_code: taskContext.student.loginCode,
          p_assignment_id: id
        });
        if (error || !data || data.version !== 1 || !Array.isArray(data.queueIds)) return false;

        const itemMap = new Map(allItems.map((item) => [item.resumeId, item]));
        const restoredQueue = data.queueIds.map((itemId) => itemMap.get(itemId));
        const restoredTotal = Number(data.total);
        const restoredIndex = Number(data.nextIndex);
        if (!restoredQueue.length || restoredQueue.some((item) => !item)) return false;
        if (!Number.isInteger(restoredTotal) || restoredTotal !== restoredQueue.length) return false;
        if (!Number.isInteger(restoredIndex) || restoredIndex < 0 || restoredIndex > restoredTotal) return false;

        total = restoredTotal;
        queue = restoredQueue;
        idx = restoredIndex;
        good = Math.max(0, Number(data.good) || 0);
        bad = Math.max(0, Number(data.bad) || 0);
        streak = Math.max(0, Number(data.streak) || 0);
        answers = Array.isArray(data.answers) ? data.answers.slice(0, restoredIndex) : [];
        return true;
      } catch (error) {
        return false;
      }
    }

    async function submitTaskResult() {
      if (!taskContext || !window.createSupertoolClient) return { saved: false, error: null };
      const currentAssignmentId = assignmentId();
      if (!currentAssignmentId) return { saved: false, error: "Taak-id ontbreekt." };
      try {
        const client = window.createSupertoolClient();
        const { error } = await client.rpc("submit_student_attempt", {
          p_student_id: taskContext.student.studentId,
          p_login_code: taskContext.student.loginCode,
          p_assignment_id: currentAssignmentId,
          p_score: good,
          p_total: total,
          p_goal_summary: goalSummary(),
          p_details: answers
        });
        if (error) return { saved: false, error: error.message };
        return { saved: true, error: null };
      } catch (error) {
        return { saved: false, error: error.message || String(error) };
      }
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

    async function answer(option, clicked) {
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
      answers.push({
        goal: queue[idx].goal,
        topic: queue[idx].topic || "",
        question: queue[idx].question || "",
        chosen: option.label,
        correctAnswer: correctOption ? correctOption.label : "",
        correct: !!option.correct
      });
      if (queue[idx].onAnswer) queue[idx].onAnswer(option.correct, el.story);
      if (taskContext) await saveTaskProgress(idx + 1);
      el.next.disabled = false;
      updateStats();
    }

    function show(screen) {
      el.menu.classList.toggle("hidden", screen !== "menu");
      el.game.classList.toggle("hidden", screen !== "game");
      el.end.classList.toggle("hidden", screen !== "end");
    }

    async function start() {
      syncWarning();
      if (!selectedGoals().length) return;
      if (taskContext && taskContext.assignment) {
        total = Number(taskContext.assignment.question_count) || total;
        const restored = await restoreTaskProgress();
        if (restored) {
          show("game");
          if (idx >= total) {
            await finish();
            return;
          }
          renderQuestion();
          setFeedback("", "Je gaat verder waar je gebleven was: vraag " + (idx + 1) + " van " + total + ".");
          return;
        }
      }
      queue = makeQueue(total);
      idx = 0;
      good = 0;
      bad = 0;
      streak = 0;
      answers = [];
      if (taskContext) await saveTaskProgress(0);
      show("game");
      renderQuestion();
    }

    async function finish() {
      el.progress.style.width = "100%";
      el.endScore.textContent = good;
      el.endTotal.textContent = total;
      const pct = Math.round((good / total) * 100);
      el.endMsg.textContent = pct >= 80 ? "Sterk gewerkt. Je schakelt goed tussen verschillende leesdoelen." : pct >= 60 ? "Goed geoefend. Kijk vooral naar de uitleg bij de lastige doelen." : "Prima oefenronde. Probeer straks minder snel te kiezen en eerst het doel te herkennen.";
      show("end");
      if (taskContext) {
        el.endMsg.textContent = "Resultaat wordt opgeslagen...";
        const result = await submitTaskResult();
        if (result.saved) {
          el.endMsg.textContent = "Je resultaat is opgeslagen. Goed gewerkt!";
          el.replay.textContent = "Terug naar taken";
        } else {
          el.endMsg.textContent = "Je oefening is klaar, maar opslaan lukte niet: " + (result.error || "onbekende fout");
          el.replay.textContent = "Terug naar taken";
        }
      }
    }

    function next() {
      if (idx + 1 >= total) {
        finish();
        return;
      }
      idx++;
      renderQuestion();
    }

    renderGoalChecks();
    syncWarning();
    if (taskContext && taskContext.assignment) {
      el.subtitle.textContent = taskContext.assignment.title || "Taak oefenen";
      if (taskContext.student && taskContext.student.displayName) {
        el.subtitle.textContent += " - " + taskContext.student.displayName;
      }
      el.reset.classList.add("hidden");
      el.menu.classList.add("hidden");
      start();
    } else if (taskMode) {
      el.warning.textContent = "Taakgegevens ontbreken. Ga terug naar de leerlingpagina en start de taak opnieuw.";
      el.start.disabled = true;
    }
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
    el.replay.addEventListener("click", () => {
      if (taskContext) {
        window.location.href = "../leerling/index.html";
        return;
      }
      show("menu");
    });
    el.next.addEventListener("click", next);
    el.story.addEventListener("scroll", () => {
      const item = queue[idx];
      if (answered && item && item.redraw) item.redraw(el.story);
    });
    window.addEventListener("resize", () => {
      const item = queue[idx];
      if (answered && item && item.redraw) item.redraw(el.story);
    });
  }

  window.initMIX = initMIX;
})();
