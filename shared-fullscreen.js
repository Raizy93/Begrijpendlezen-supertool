(function () {
  "use strict";

  if (document.getElementById("fsBtn")) return;

  const container = document.querySelector("header .top-actions, header .actions");
  if (!container) return;

  const button = document.createElement("button");
  button.id = "fsBtn";
  button.type = "button";
  button.className = container.classList.contains("actions") ? "btn" : "home";
  button.title = "Volledig scherm";
  button.setAttribute("aria-label", "Volledig scherm");
  button.innerHTML = [
    '<svg class="ic-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
    '<path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></svg>',
    '<svg class="ic-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none">',
    '<path d="M9 4v4a1 1 0 0 1-1 1H4M15 4v4a1 1 0 0 0 1 1h4M9 20v-4a1 1 0 0 0-1-1H4M15 20v-4a1 1 0 0 1 1-1h4"/></svg>'
  ].join("");

  const logout = container.querySelector("#studentLogout, #logoutBtn");
  container.insertBefore(button, logout || null);

  const target = document.documentElement;
  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

  function enterFullscreen() {
    const request = target.requestFullscreen || target.webkitRequestFullscreen || target.webkitRequestFullScreen;
    if (!request) return;
    try {
      const result = request.call(target);
      if (result && result.catch) result.catch(function () {});
    } catch (error) {}
  }

  function exitFullscreen() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit) return;
    try {
      const result = exit.call(document);
      if (result && result.catch) result.catch(function () {});
    } catch (error) {}
  }

  function syncFullscreenButton() {
    const active = Boolean(fullscreenElement());
    button.querySelector(".ic-open").style.display = active ? "none" : "";
    button.querySelector(".ic-close").style.display = active ? "" : "none";
    button.title = active ? "Sluit volledig scherm (Esc)" : "Volledig scherm";
    button.setAttribute("aria-label", button.title);
  }

  button.addEventListener("click", function () {
    if (fullscreenElement()) exitFullscreen();
    else enterFullscreen();
  });
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
  document.addEventListener("keydown", function (event) {
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (event.target && event.target.isContentEditable)) return;
    if ((event.key === "f" || event.key === "F") && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (fullscreenElement()) exitFullscreen();
      else enterFullscreen();
    }
  });
})();
