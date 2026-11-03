import { useEffect, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

// Reveal once per mount; returning to content must not hide it again.
export function useScrollReveal(ref, enabled) {
  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    root.dataset.revealReady = "true";
    if (root.matches("[data-reveal]")) observer.observe(root);
    root
      .querySelectorAll("[data-reveal]")
      .forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      delete root.dataset.revealReady;
    };
  }, [ref, enabled]);
}
