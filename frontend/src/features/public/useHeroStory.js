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
              // Follow the artwork's sloping threshold (34 / 161).
              { x: -79, y: (79 * 34) / 161, duration: 0.7 },
              1,
            )
            .to(
              select(".landing-scene-door-right"),
              // Clear the widened opening at x=1302, plus 2px for its edge.
              // The right leaf starts at x=1209: 1302 - 1209 + 2 = 95.
              { x: 95, y: (-95 * 34) / 161, duration: 0.7 },
              1,
            )
            .fromTo(
              select(".miu-door-original-rim"),
              { opacity: 1 },
              { opacity: 0, duration: 0.7 },
              1,
            );
          // Every item starts at the door in the shared artwork coordinate
          // system, including after a responsive resize/ScrollTrigger refresh.
          const stage = root.querySelector(".miu-journey-stage");
          const emerge = {
            opacity: 0,
            x: (_, element) =>
              stage.clientWidth * 0.39 -
              element.offsetLeft -
              element.offsetWidth / 2,
            y: (_, element) =>
              stage.clientHeight * 0.63 -
              element.offsetTop -
              element.offsetHeight / 2,
            scale: 0.94,
            duration: 0.45,
            ease: "power3.out",
          };
          // Each light segment begins behind the preceding object and only
          // starts after its segment finishes, forming one continuous chain.
          for (const [selector, trail, at] of [
            [".miu-scene-project", "project", 1.4],
            [".miu-scene-profile", "profile", 1.85],
            [".miu-floating-users", "users", 2.3],
            [".miu-floating-briefcase", "briefcase", 2.75],
            [".miu-scene-service", "service", 3.2],
            [".miu-scene-laptop", "laptop", 3.65],
            [".miu-scene-earnings", "earnings", 4.1],
          ]) {
            timeline.from(select(selector), { ...emerge }, at);
            timeline.fromTo(
              select(`[data-trail="${trail}"]`),
              { opacity: 0, strokeDashoffset: 1 },
              {
                opacity: 0.9,
                strokeDashoffset: 0,
                duration: emerge.duration,
                ease: "none",
              },
              at,
            );
          }
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
