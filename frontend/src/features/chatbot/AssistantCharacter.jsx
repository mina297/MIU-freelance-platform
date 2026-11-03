import { useEffect, useId, useRef, useState } from "react";
import character from "./assets/miu-assistant-cutout.png";

/** Raster layers retain the supplied character's materials; SVG only clips them. */
export default function AssistantCharacter({ enabled = true }) {
  const id = useId();
  const [ready, setReady] = useState(false);
  const floating = useRef(null);
  const armLayer = useRef(null);
  const gaze = useRef(null);
  const floatAnimation = useRef(null);
  const waveAnimation = useRef(null);
  const arm = "M205 400H390L412 604L404 651L373 675L333 653L271 568Z";

  useEffect(() => {
    // Preload explicitly: SVG image load delivery varies between browsers/cache hits.
    const image = new Image();
    image.onload = () => setReady(true);
    image.src = character;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function resetMotion() {
      floatAnimation.current?.cancel();
      waveAnimation.current?.cancel();
      if (gaze.current) gaze.current.style.transform = "";
    }
    reduced.addEventListener("change", resetMotion);
    return () => {
      image.onload = null;
      resetMotion();
      reduced.removeEventListener("change", resetMotion);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      floatAnimation.current?.cancel();
      waveAnimation.current?.cancel();
      if (gaze.current) gaze.current.style.transform = "";
    }
  }, [enabled]);

  function canAnimate() {
    return (
      enabled &&
      ready &&
      window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    );
  }

  function float(from, frames, options) {
    const node = floating.current;
    const current = getComputedStyle(node).transform;
    const start = current === "none" ? from : current;
    if (options.iterations === Infinity)
      frames[frames.length - 1].transform = start;
    floatAnimation.current?.cancel();
    floatAnimation.current = node.animate(
      [{ transform: start }, ...frames],
      options,
    );
  }

  function greet() {
    if (!canAnimate()) return;
    // WAAPI preserves the current position when a hover interrupts the return.
    float(
      "translateY(0)",
      [
        { transform: "translateY(-5px)", offset: 0.25 },
        { transform: "translateY(-7px)", offset: 0.5 },
        { transform: "translateY(-5px)", offset: 0.75 },
        { transform: "translateY(0)", offset: 1 },
      ],
      { duration: 3600, iterations: Infinity, easing: "ease-in-out" },
    );
    const armNode = armLayer.current;
    const current = getComputedStyle(armNode).transform;
    waveAnimation.current?.cancel();
    waveAnimation.current = armNode.animate(
      [
        { transform: current },
        { transform: "rotate(23deg)", offset: 0.2 },
        { transform: "rotate(-18deg)", offset: 0.4 },
        { transform: "rotate(23deg)", offset: 0.6 },
        { transform: "rotate(-12deg)", offset: 0.8 },
        { transform: "rotate(0deg)" },
      ],
      { duration: 2600, easing: "ease-in-out" },
    );
  }

  function look(event) {
    if (!canAnimate()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    gaze.current.style.transform = `translate(${x * 36}px, ${y * 20}px)`;
  }

  function settle() {
    if (gaze.current) gaze.current.style.transform = "translate(0px, 0px)";
    if (!canAnimate()) return;
    float("translateY(0)", [{ transform: "translateY(0)" }], {
      duration: 800,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      fill: "forwards",
    });
  }

  return (
    <span
      className="chatbot-launcher-float"
      ref={floating}
      aria-hidden="true"
      onPointerEnter={greet}
      onPointerMove={look}
      onPointerLeave={settle}
      onPointerCancel={settle}
    >
      <svg
        className={`chatbot-character${ready ? " chatbot-character--ready" : ""}`}
        viewBox="160 0 1190 1024"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={`${id}-arm`}>
            <path d={arm} />
          </clipPath>
          <mask
            id={`${id}-body`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1536"
            height="1024"
          >
            <rect width="1536" height="1024" fill="white" />
            <path d={arm} fill="black" />
          </mask>
          <clipPath id={`${id}-eyes`}>
            <rect x="615" y="446" width="88" height="82" rx="12" />
            <rect x="807" y="446" width="88" height="82" rx="12" />
          </clipPath>
          <radialGradient id={`${id}-visor`}>
            <stop stopColor="#180702" />
            <stop offset="1" stopColor="#291007" />
          </radialGradient>
        </defs>
        <image
          href={character}
          width="1536"
          height="1024"
          mask={`url(#${id}-body)`}
        />
        <g className="chatbot-character-arm" ref={armLayer}>
          <image
            href={character}
            width="1536"
            height="1024"
            clipPath={`url(#${id}-arm)`}
          />
        </g>
        <g
          className="chatbot-character-eye-backdrop"
          fill={`url(#${id}-visor)`}
        >
          <rect x="614" y="445" width="90" height="84" rx="15" />
          <rect x="806" y="445" width="90" height="84" rx="15" />
        </g>
        <g
          className="chatbot-character-hover-backdrop"
          fill={`url(#${id}-visor)`}
        >
          <rect x="614" y="445" width="90" height="84" rx="15" />
          <rect x="806" y="445" width="90" height="84" rx="15" />
        </g>
        <g className="chatbot-character-gaze" ref={gaze}>
          <g className="chatbot-character-eyes">
            <image
              href={character}
              width="1536"
              height="1024"
              clipPath={`url(#${id}-eyes)`}
            />
          </g>
        </g>
      </svg>
    </span>
  );
}
