import { useEffect } from "react";
import { useTheme } from "../../theme/ThemeContext.js";
import { getHeroDoorGeometry } from "./heroDoorGeometry.js";

/** The first scroll starts playback. Returning to the top resets the scene. */
export function useHeroStory(ref, enabled) {
  const { theme } = useTheme();
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
          const door = getHeroDoorGeometry(theme);
          const doorDuration = 0.5;
          const doorOpenAt = doorStart + doorDuration;
          timeline
            .to(
              select(".landing-scene-door-left"),
              // Follow this theme's threshold and clear the stationary frame.
              {
                x: -door.leftTravel,
                y: -door.leftTravel * door.slope,
                duration: doorDuration,
              },
              doorStart,
            )
            .to(
              select(".landing-scene-door-right"),
              {
                x: door.rightTravel,
                y: door.rightTravel * door.slope,
                duration: doorDuration,
              },
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
          // Keep the broad reference orbits; draw each complete curve smoothly.
          const reveals = [
            ".miu-scene-project",
            ".miu-scene-profile",
            ".miu-floating-users",
            ".miu-floating-briefcase",
            ".miu-scene-service",
            ".miu-scene-laptop",
            ".miu-scene-earnings",
          ];
          for (const [index, selector] of reveals.entries()) {
            const at = doorOpenAt + 0.1 + index * emerge.duration;
            timeline.from(select(selector), { ...emerge }, at);
          }
          let ribbonStart = doorOpenAt + 0.1;
          // SVG units per second: different lengths retain the same drawing
          // speed. Each ribbon starts as soon as the preceding one finishes.
          const ribbonSpeed = 700;
          for (const ribbon of ["rising", "upper-orbit", "lower-orbit"]) {
            const path = select(`[data-ribbon="${ribbon}"]`)[0];
            const tip = select(`[data-ribbon-tip="${ribbon}"]`)[0];
            if (!path || !tip) continue;
            const length = path.getTotalLength();
            const duration = length / ribbonSpeed;
            const start = path.getPointAtLength(0);
            const setTipX = gsap.quickSetter(tip, "x", "px");
            const setTipY = gsap.quickSetter(tip, "y", "px");
            timeline.set(tip, { x: start.x, y: start.y, opacity: 0 }, 0);
            timeline.set(tip, { opacity: 1 }, ribbonStart);
            timeline.fromTo(
              path,
              // Use actual SVG units: CSS px offsets and normalized pathLength
              // can otherwise disagree about how much of a path is hidden.
              { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration,
                ease: "none",
                onUpdate: function () {
                  // The pen and the revealed stroke share one tween's progress,
                  // including reset/reverse: the bright head cannot run ahead.
                  const point = path.getPointAtLength(length * this.progress());
                  setTipX(point.x);
                  setTipY(point.y);
                },
              },
              ribbonStart,
            );
            ribbonStart += duration;
            timeline.set(tip, { opacity: 0 }, ribbonStart);
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
  }, [ref, enabled, theme]);
}
