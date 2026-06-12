(function () {
  "use strict";

  const scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) return;
  const rootUrl = new URL("./", scriptUrl);
  const goalsUrl = new URL("index.html", rootUrl).href;
  const studentUrl = new URL("leerling/index.html", rootUrl).href;
  const dashboardUrl = new URL("dashboard/index.html", rootUrl).href;

  function readStudentSession() {
    try {
      const value = JSON.parse(sessionStorage.getItem("supertool_student") || "null");
      return value && value.studentId && value.loginCode ? value : null;
    } catch (error) {
      return null;
    }
  }

  function hasTeacherSession() {
    try {
      return Object.keys(localStorage).some((key) => {
        if (!/^sb-.*-auth-token$/.test(key)) return false;
        const value = JSON.parse(localStorage.getItem(key) || "null");
        return Boolean(value && (value.access_token || (value.currentSession && value.currentSession.access_token)));
      });
    } catch (error) {
      return false;
    }
  }

  function navigationContainer() {
    return document.querySelector("header .top-actions, header .nav, .board .scores");
  }

  function linkClass(container) {
    if (container.classList.contains("nav")) return "navbtn";
    if (container.classList.contains("scores")) return "fsbtn context-navbtn";
    return "homebtn";
  }

  function makeLink(container, label, href) {
    const link = document.createElement("a");
    link.className = linkClass(container);
    link.href = href;
    link.textContent = label;
    link.title = label;
    link.setAttribute("data-context-navigation", "");
    if (link.classList.contains("context-navbtn")) {
      link.style.display = "grid";
      link.style.placeItems = "center";
      link.style.textDecoration = "none";
      link.style.fontWeight = "900";
      link.style.whiteSpace = "nowrap";
    }
    return link;
  }

  const container = navigationContainer();
  if (!container || container.querySelector("[data-context-navigation]")) return;
  const studentSession = readStudentSession();
  const fullscreenButton = container.querySelector("#fsBtn, .fsbtn");
  const insert = (link) => container.insertBefore(link, fullscreenButton || null);
  const hasGoalsLink = Array.from(container.querySelectorAll("a")).some((link) => {
    try {
      return new URL(link.href).pathname === new URL(goalsUrl).pathname;
    } catch (error) {
      return false;
    }
  });
  if (!hasGoalsLink) insert(makeLink(container, "Doelen", goalsUrl));
  insert(makeLink(container, studentSession ? "Mijn leren" : "Leerling", studentUrl));
  if (!studentSession && hasTeacherSession()) insert(makeLink(container, "Dashboard", dashboardUrl));
})();
