import { useId } from "react";
import { useTheme } from "../../theme/ThemeContext.js";
import HeroJourneyOverlay from "./HeroJourneyOverlay.jsx";
import lightScene from "../../assets/hero/miu-crimson-light.webp";
import darkScene from "../../assets/hero/miu-crimson-dark-ivory.webp";
import { getHeroDoorGeometry } from "./heroDoorGeometry.js";
import "./heroScene.css";
import "./heroJourney.css";

export default function HeroScene() {
  const id = useId();
  const { theme } = useTheme();
  const scene = theme === "dark" ? darkScene : lightScene;
  const door = getHeroDoorGeometry(theme);
  const doorway = door.outline;
  const floorReflection = door.reflection;
  const url = (name) => `url(#${id}-${name})`;
  const photo = { width: 1672, height: 941 };
  return (
    <div className="landing-hero-media" aria-hidden="true">
      <svg
        className="landing-scene"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMaxYMin meet"
        width="1672"
        height="941"
        focusable="false"
      >
        <defs>
          {/* Remove the baked closed door and reflection from the base plate.
              Only the live leaves should remain visible during their travel. */}
          <mask
            id={`${id}-scene-plate`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1672"
            height="941"
            style={{ maskType: "luminance" }}
          >
            <rect width="1672" height="941" fill="white" />
            <path d={doorway} fill="black" />
            <path d={doorway} transform={floorReflection} fill="black" />
          </mask>
          <clipPath id={`${id}-door`}>
            <path d={doorway} />
          </clipPath>
          <clipPath id={`${id}-opening`}>
            <path d={doorway} />
          </clipPath>
          <clipPath id={`${id}-left`}>
            <rect
              x={door.left}
              y="405"
              width={door.split - door.left}
              height="325"
            />
          </clipPath>
          <clipPath id={`${id}-right`}>
            <rect
              x={door.split}
              y="405"
              width={door.right - door.split}
              height="325"
            />
          </clipPath>
          <radialGradient
            id={`${id}-interior`}
            gradientUnits="userSpaceOnUse"
            cx="1171"
            cy="691"
            r="289"
          >
            <stop stopColor="#46070a" />
            <stop offset=".5" stopColor="#240204" />
            <stop offset="1" stopColor="#100001" />
          </radialGradient>
          <linearGradient id={`${id}-floor`} x1="0" y1="0" x2=".15" y2="1">
            <stop stopColor="#4a080b" stopOpacity="0" />
            <stop offset=".35" stopColor="#701016" stopOpacity=".12" />
            <stop offset=".72" stopColor="#a31a24" stopOpacity=".65" />
            <stop offset="1" stopColor="#cf2635" />
          </linearGradient>
          {/* Reflect across the sloped threshold, rather than a horizontal
              line. Opaque floor tint replaces the baked-in closed reflection. */}
          <filter id={`${id}-reflection-tint`} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR
                type="linear"
                slope={theme === "dark" ? ".2" : ".12"}
                intercept={theme === "dark" ? ".045" : ".8"}
              />
              <feFuncG
                type="linear"
                slope={theme === "dark" ? ".2" : ".12"}
                intercept={theme === "dark" ? ".015" : ".73"}
              />
              <feFuncB
                type="linear"
                slope={theme === "dark" ? ".2" : ".12"}
                intercept={theme === "dark" ? ".015" : ".73"}
              />
            </feComponentTransfer>
          </filter>
        </defs>
        <g>
          <image href={scene} {...photo} mask={url("scene-plate")} />
          <g className="miu-scene-live">
            <g
              id={`${id}-door-content`}
              className="landing-scene-doors"
              clipPath={url("opening")}
            >
              {/* Keep the cavity inside the fixed frame, including at the crown. */}
              <path d={doorway} fill={url("interior")} />
              {/* Soft floor lighting preserves depth without a colored arch lip. */}
              <path d={door.floor} fill={url("floor")} />
              {/* Clip the arch before moving each leaf so wall pixels cannot
                slide into the opening. The outer clip keeps the frame fixed. */}
              <g className="landing-scene-door-left">
                <g clipPath={url("door")}>
                  <image href={scene} {...photo} clipPath={url("left")} />
                </g>
              </g>
              <g className="landing-scene-door-right">
                <g clipPath={url("door")}>
                  <image href={scene} {...photo} clipPath={url("right")} />
                </g>
              </g>
            </g>
            <g className="miu-door-reflection">
              <g transform={floorReflection}>
                <use
                  href={`#${id}-door-content`}
                  filter={url("reflection-tint")}
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <HeroJourneyOverlay />
    </div>
  );
}
