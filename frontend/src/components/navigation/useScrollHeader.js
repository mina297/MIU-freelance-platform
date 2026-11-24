import { useEffect, useRef } from "react";
import { watchHeaderScroll } from "./headerScroll.js";
import "./scrollHeader.css";

export default function useScrollHeader({
  enabled = true,
  routeKey,
  keepVisible = false,
  desktopSidebar = false,
} = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const header = ref.current;
    const scroller = document.scrollingElement;
    if (!enabled || !header || !scroller) return;
    const desktop = window.matchMedia("(min-width: 1280px)");
    let cleanup;
    function connect() {
      cleanup?.();
      header.removeAttribute("data-scroll-hidden");
      if (!keepVisible && !(desktopSidebar && desktop.matches)) {
        cleanup = watchHeaderScroll(header, scroller, window);
      } else cleanup = undefined;
    }
    connect();
    desktop.addEventListener("change", connect);
    return () => {
      cleanup?.();
      desktop.removeEventListener("change", connect);
    };
  }, [enabled, routeKey, keepVisible, desktopSidebar]);
  return ref;
}
