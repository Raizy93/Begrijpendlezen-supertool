(function () {
  "use strict";

  const KEYS = ["A", "B", "C", "D"];
  const style = document.createElement("style");
  style.textContent = `
    .choice[data-answer-key]{position:relative!important; min-width:0;}
    .choice .answer-key{
      flex:0 0 44px; width:44px; height:44px; display:grid; place-items:center;
      border:3px solid rgba(255,255,255,.78); border-radius:13px;
      background:rgba(255,255,255,.2); color:#fff;
      font:900 22px/1 var(--font-body, Nunito, system-ui, sans-serif);
    }
    .choice .answer-key::after{content:".";}
    .choice .keyboard-decor-hidden{display:none!important;}

    @media (min-width:901px){
      #app{gap:10px!important; padding-top:14px!important; padding-bottom:14px!important;}
      #db{gap:10px!important; padding-top:14px!important; padding-bottom:14px!important;}
      .stage{gap:10px!important;}
      .read{padding:18px 26px 20px!important; min-height:300px!important;}
      .read .prompt{margin:5px 0 8px!important;}
      .story{font-size:18px!important; line-height:1.48!important;}
      .story h2{font-size:25px!important;}
      .story h3{font-size:17px!important; margin:10px 0 4px!important;}
      .story p{margin-bottom:9px!important;}
      .feedback{min-height:46px!important; padding-top:9px!important; padding-bottom:9px!important; font-size:15px!important;}
      .choices{gap:10px!important;}
      .choice{
        min-height:66px!important; padding:9px 14px!important; gap:12px!important;
        border-radius:17px!important; box-shadow:0 5px 0 var(--ink-900)!important;
      }
      .choice .big{font-family:var(--font-body, Nunito, system-ui, sans-serif)!important; font-size:18px!important; line-height:1.15!important; letter-spacing:0!important;}
      .choice .hint{font-size:11px!important; line-height:1.2!important;}
      .choice .answer-key{flex-basis:40px; width:40px; height:40px; font-size:20px;}
      .foot{gap:10px!important;}
    }

    @media (min-width:901px) and (max-height:850px){
      .board .logo,.top .logo{width:48px!important; height:48px!important;}
      .board h1,.top h1{font-size:31px!important;}
      .goal-strip{padding:7px 12px!important;}
      .goal-strip strong{font-size:24px!important;}
      .score{padding:5px 12px!important;}
      .score .n{font-size:25px!important;}
      .streakbox{padding:5px 11px!important;}
      .read{min-height:320px!important;}
    }

    @media (max-width:900px){
      .choice .answer-key{flex-basis:40px; width:40px; height:40px; font-size:19px;}
      .choice{padding-left:13px!important;}
    }
  `;
  document.head.appendChild(style);

  function visible(button) {
    return !button.disabled && button.getClientRects().length > 0;
  }

  function decorateChoices() {
    document.querySelectorAll(".choices").forEach(function (group) {
      const buttons = Array.from(group.querySelectorAll(":scope > .choice")).slice(0, KEYS.length);
      buttons.forEach(function (button, index) {
        const key = KEYS[index];
        button.dataset.answerKey = key;
        button.title = "Antwoord " + key;
        button.setAttribute("aria-keyshortcuts", key);
        let badge = button.querySelector(":scope > .answer-key");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "answer-key";
          badge.setAttribute("aria-hidden", "true");
          button.insertBefore(badge, button.firstChild);
        }
        if (badge.textContent !== key) badge.textContent = key;
        const decoration = button.querySelector(":scope > .ic, :scope > .icon");
        if (decoration) decoration.classList.add("keyboard-decor-hidden");
        const oldKeyboardHint = button.querySelector(":scope > .kbd");
        if (oldKeyboardHint) oldKeyboardHint.classList.add("keyboard-decor-hidden");
      });
    });
  }

  const observer = new MutationObserver(function (mutations) {
    const hasNewChoices = mutations.some(function (mutation) {
      return Array.from(mutation.addedNodes).some(function (node) {
        if (node.nodeType !== 1) return false;
        return node.matches(".choices, .choice") || Boolean(node.querySelector(".choices, .choice"));
      });
    });
    if (hasNewChoices) decorateChoices();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  decorateChoices();

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    const target = event.target;
    const tag = target && target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (target && target.isContentEditable)) return;
    const key = String(event.key || "").toUpperCase();
    if (!KEYS.includes(key)) return;
    const button = Array.from(document.querySelectorAll('.choice[data-answer-key="' + key + '"]')).find(visible);
    if (!button) return;
    event.preventDefault();
    button.click();
  });
})();
