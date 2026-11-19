import { useId } from "react";
import { useTheme } from "../../theme/ThemeContext.js";
import HeroJourneyOverlay from "./HeroJourneyOverlay.jsx";
import lightScene from "../../assets/hero/miu-crimson-light.webp";
import darkScene from "../../assets/hero/miu-crimson-dark-reference.webp";
import "./heroScene.css";
import "./heroJourney.css";

// Both images use this 1672 × 941 coordinate system for the doorway.
const doorway =
  "M1131 721 V548 C1131 491 1169 427 1209 417 C1255 405 1292 450 1292 505 V687 Z";
// Include the red curved lip baked into the plate, outside the moving leaves.
const openDoorway =
  "M1131 721 V548 C1131 489 1168 423 1209 413 C1260 400 1302 448 1302 505 V685 Z";
const floorReflection = "matrix(1 -0.42236025 0 -1 0 1919.68944)";

export default function HeroScene() {
  const id = useId();
  const { theme } = useTheme();
  const scene = theme === "dark" ? darkScene : lightScene;
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
            <path d={openDoorway} fill="black" />
            <path d={openDoorway} transform={floorReflection} fill="black" />
          </mask>
          <clipPath id={`${id}-door`}>
            <path d={doorway} />
          </clipPath>
          <clipPath id={`${id}-opening`}>
            <path d={openDoorway} />
          </clipPath>
          <clipPath id={`${id}-original-rim`}>
            <path d={`${openDoorway} ${doorway}`} clipRule="evenodd" />
          </clipPath>
          <clipPath id={`${id}-left`}>
            <rect x="1130" y="405" width="79" height="325" />
          </clipPath>
          <clipPath id={`${id}-right`}>
            <rect x="1209" y="405" width="85" height="325" />
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
              {/* One continuous cavity avoids antialiased seams at the old
                inner arch and a differently lit strip along its right edge. */}
              <path d={openDoorway} fill={url("interior")} />
              {/* Soft floor lighting preserves depth without a colored arch lip. */}
              <path
                d="M1131 721 L1302 685 V620 L1131 656 Z"
                fill={url("floor")}
              />
              <g
                className="miu-door-original-rim"
                clipPath={url("original-rim")}
              >
                <image href={scene} {...photo} />
              </g>
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
