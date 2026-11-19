import { useEffect } from "react";

/** The first scroll starts playback. Returning to the top resets the scene. */
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
              start: "top -1px",
              end: () =>
                window.matchMedia("(max-width: 760px), (max-height: 700px)")
                  .matches
                  ? "bottom 65%"
                  : "bottom bottom",
              toggleActions: "play none none reset",
              invalidateOnRefresh: true,
            },
          });
          const doorStart = 0;
          const doorDuration = 0.5;
          const doorOpenAt = doorStart + doorDuration;
          timeline
            .to(
              select(".landing-scene-door-left"),
              // Follow the artwork's sloping threshold (34 / 161).
              { x: -79, y: (79 * 34) / 161, duration: doorDuration },
              doorStart,
            )
            .to(
              select(".landing-scene-door-right"),
              // Clear the widened opening at x=1302, plus 2px for its edge.
              // The right leaf starts at x=1209: 1302 - 1209 + 2 = 95.
              { x: 95, y: (-95 * 34) / 161, duration: doorDuration },
              doorStart,
            )
            .fromTo(
              select(".miu-door-original-rim"),
              { opacity: 1 },
              { opacity: 0, duration: doorDuration },
              doorStart,
            );
          // Every item starts at the door in the shared artwork coordinate
          // system, including after a responsive resize/ScrollTrigger refresh.
          const stage = root.querySelector(".miu-journey-stage");
          timeline.set(stage, { visibility: "visible" }, doorOpenAt);
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
          const reveals = [
            [".miu-scene-project", "project"],
            [".miu-scene-profile", "profile"],
            [".miu-floating-users", "users"],
            [".miu-floating-briefcase", "briefcase"],
            [".miu-scene-service", "service"],
            [".miu-scene-laptop", "laptop"],
            [".miu-scene-earnings", "earnings"],
          ];
          for (const [index, [selector, trail]] of reveals.entries()) {
            const at = doorOpenAt + 0.1 + index * emerge.duration;
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
    };
  }, [ref, enabled]);
}
