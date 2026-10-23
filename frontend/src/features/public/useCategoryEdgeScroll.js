import { useEffect } from "react";

export default function useCategoryEdgeScroll(ref, enabled) {
  useEffect(() => {
    const track = ref.current;
    if (!track || !enabled) return;
    let frame = 0;
    let speed = 0;
    let previousTime = 0;

    function stop() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      speed = 0;
      previousTime = 0;
      delete track.dataset.hoverScrolling;
    }

    function tick(time) {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16;
      previousTime = time;
      track.scrollLeft += (speed * elapsed) / 1000;
      const maximum = track.scrollWidth - track.clientWidth;
      if (
        (speed < 0 && track.scrollLeft <= 0) ||
        (speed > 0 && track.scrollLeft >= maximum - 1)
      ) {
        stop();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function move(event) {
      if (event.pointerType !== "mouse" || event.buttons) {
        stop();
        return;
      }
      const bounds = track.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const edge = Math.min(120, bounds.width * 0.2);
      if (
        x < 0 ||
        x > bounds.width ||
        (x >= edge && x <= bounds.width - edge)
      ) {
        stop();
        return;
      }
      const direction = x < edge ? -1 : 1;
      const strength =
        direction < 0 ? (edge - x) / edge : (x - bounds.width + edge) / edge;
      const maximum = track.scrollWidth - track.clientWidth;
      if (
        maximum <= 0 ||
        (direction < 0 && track.scrollLeft <= 0) ||
        (direction > 0 && track.scrollLeft >= maximum - 1)
      ) {
        stop();
        return;
      }
      speed = direction * Math.max(60, strength * 320);
      track.dataset.hoverScrolling = "true";
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    function visibility() {
      if (document.hidden) stop();
    }

    track.addEventListener("pointermove", move);
    const stopEvents = [
      "pointerleave",
      "pointerdown",
      "pointercancel",
      "wheel",
      "keydown",
      "focusin",
    ];
    stopEvents.forEach((type) =>
      track.addEventListener(type, stop, { passive: true }),
    );
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      stop();
      track.removeEventListener("pointermove", move);
      stopEvents.forEach((type) => track.removeEventListener(type, stop));
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [ref, enabled]);
}
