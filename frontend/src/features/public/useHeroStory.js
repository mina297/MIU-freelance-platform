import { useEffect } from "react";

/** Reversible explanatory motion. CSS sticky preserves native scrolling. */
export function useHeroStory(ref, enabled) {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let context;
    const root = ref.current;
    if (!root) return;
    async function start() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {
          const select = gsap.utils.selector(root);
          root.dataset.storyReady = "true";
          root.dataset.scene = "0";
          gsap.from(select(".landing-hero-copy > *"), {
            opacity: 0,
            y: 12,
            duration: 0.65,
            stagger: 0.045,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
          const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () =>
                window.matchMedia("(max-width: 760px), (max-height: 700px)")
                  .matches
                  ? "bottom 65%"
                  : "bottom bottom",
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                root.dataset.scene = String(
                  Math.min(4, Math.floor(progress * 5)),
                );
              },
            },
          });
          // Five equal beats include a quiet opening fifth before the doors move.
          timeline
            .to({}, { duration: 5 }, 0)
            .fromTo(
              select(".miu-story-progress-fill"),
              { scaleX: 0 },
              { scaleX: 1, duration: 5, ease: "none" },
              0,
            )
            .to(
              select(".landing-scene-door-left"),
              { x: -79, y: 16, duration: 0.7 },
              1,
            )
            .to(
              select(".landing-scene-door-right"),
              { x: 85, y: -16, duration: 0.7 },
              1,
            )
            .fromTo(
              select(".miu-door-light"),
              { opacity: 0 },
              { opacity: 0.5, duration: 0.7 },
              1,
            )
            .from(
              select(".miu-scene-project"),
              {
                opacity: 0,
                x: -70,
                y: 110,
                scale: 0.94,
                rotationY: -8,
                duration: 0.65,
              },
              1.25,
            )
            .from(
              select(".miu-scene-profile"),
              { opacity: 0, x: 60, y: 60, scale: 0.94, duration: 0.6 },
              2,
            )
            .from(
              select(".miu-scene-service"),
              { opacity: 0, x: -35, y: 80, scale: 0.96, duration: 0.6 },
              2.35,
            )
            .to(
              select(".miu-scene-project"),
              { x: -15, y: 20, duration: 0.65 },
              3,
            )
            .fromTo(
              select(".miu-match-line"),
              { opacity: 0, strokeDashoffset: 1 },
              { opacity: 1, strokeDashoffset: 0, duration: 0.6 },
              3.15,
            )
            .from(
              select(".miu-scene-match"),
              { opacity: 0, y: 8, duration: 0.35 },
              3.65,
            )
            .to(
              select(".miu-scene-service"),
              { opacity: 0, y: -12, duration: 0.3 },
              4,
            )
            .from(
              select(".miu-scene-laptop"),
              { opacity: 0, y: 55, scale: 0.94, duration: 0.6 },
              4,
            )
            .from(
              select(".miu-scene-earnings"),
              { opacity: 0, x: -20, y: 35, scale: 0.96, duration: 0.5 },
              4.45,
            );
        }, root);
        ScrollTrigger.refresh();
      } catch {
        context?.revert();
        delete root.dataset.storyReady;
      }
    }
    start();
    return () => {
      cancelled = true;
      context?.revert();
      delete root.dataset.storyReady;
      delete root.dataset.scene;
    };
  }, [ref, enabled]);
}
