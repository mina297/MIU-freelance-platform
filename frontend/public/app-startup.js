// Runs independently of React so a failed application download remains recoverable.
(() => {
  const screen = document.getElementById("miu-app-startup");
  if (!screen) return;
  const root = document.getElementById("root");
  const recovery = document.getElementById("miu-startup-recovery");
  const retry = document.getElementById("miu-startup-retry");
  const status = document.getElementById("miu-startup-status");
  const failure = document.getElementById("miu-startup-failure");
  const slow = document.getElementById("miu-startup-slow");

  function reload() {
    window.location.reload();
  }
  function entryError(event) {
    if (event.target?.tagName === "SCRIPT" && event.target.type === "module")
      fail();
  }
  function fail() {
    clearTimeout(slowTimer);
    screen.classList.add("is-error");
    status.hidden = true;
    failure.hidden = false;
    slow.hidden = true;
    recovery.hidden = false;
    root.removeAttribute("aria-busy");
  }
  function ready() {
    clearTimeout(slowTimer);
    window.removeEventListener("miu:app-ready", ready);
    window.removeEventListener("miu:app-error", fail);
    window.removeEventListener("error", entryError, true);
    window.removeEventListener("vite:preloadError", fail);
    retry.removeEventListener("click", reload);
    const hadFocus = screen.contains(document.activeElement);
    screen.remove();
    root.removeAttribute("aria-busy");
    if (hadFocus) {
      const target = root.querySelector("h1, main");
      if (target) {
        const previous = target.getAttribute("tabindex");
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (previous === null) target.removeAttribute("tabindex");
        else target.setAttribute("tabindex", previous);
      }
    }
  }
  // This reveals recovery only; it never delays a ready application.
  const slowTimer = setTimeout(() => {
    recovery.hidden = false;
  }, 15000);
  retry.addEventListener("click", reload);
  // Vite rewrites the module entry in production, so do not depend on its ID.
  window.addEventListener("error", entryError, true);
  window.addEventListener("vite:preloadError", fail);
  window.addEventListener("miu:app-error", fail);
  window.addEventListener("miu:app-ready", ready);
})();
