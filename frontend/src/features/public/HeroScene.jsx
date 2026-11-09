import { useId } from "react";
import { useTheme } from "../../theme/ThemeContext.js";
import lightScene from "../../assets/hero/miu-scene.webp";
import lightUnlitScene from "../../assets/hero/miu-scene-unlit.webp";
import darkScene from "../../assets/hero/miu-scene-dark.webp";
import darkUnlitScene from "../../assets/hero/miu-scene-dark-unlit.webp";
import coin from "../../assets/hero/miu-coin.webp";
import "./heroScene.css";

// Coordinates are in the supplied artwork's original pixel space.
const doorway =
  "M1204 826 V675 C1204 629 1247 558 1299 556 C1327 552 1337 572 1337 604 V749 Z";

const deliveries = [
  { kind: "design", color: "#a4214a", icon: "M10 34 24 10 38 34ZM20 29h8" },
  {
    kind: "web",
    color: "#502848",
    icon: "m17 16-8 8 8 8m14-16 8 8-8 8m-4-20-6 24",
  },
  { kind: "video", color: "#b73245", icon: "M17 11v26l20-13Z" },
];

export default function HeroScene() {
  const id = useId();
  const { theme } = useTheme();
  const scene = theme === "dark" ? darkScene : lightScene;
  const unlitScene = theme === "dark" ? darkUnlitScene : lightUnlitScene;
  const ref = (name) => `url(#${id}-${name})`;
  const photo = { width: 1678, height: 937 };

  return (
    <div className="landing-hero-media" aria-hidden="true">
      <svg
        className="landing-scene"
        viewBox="0 0 1678 937"
        preserveAspectRatio="xMidYMid slice"
        width="1678"
        height="937"
        focusable="false"
      >
        <defs>
          <radialGradient id={`${id}-sign-fade`}>
            <stop offset=".72" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask
            id={`${id}-sign`}
            maskUnits="userSpaceOnUse"
            x="750"
            y="0"
            width="700"
            height="460"
          >
            <ellipse
              cx="1100"
              cy="216"
              rx="350"
              ry="230"
              fill={ref("sign-fade")}
            />
          </mask>
          <clipPath id={`${id}-belt`}>
            <rect width="778" height="540" />
          </clipPath>
          <clipPath id={`${id}-door`}>
            <path d={doorway} />
          </clipPath>
          <clipPath id={`${id}-left`}>
            <rect x="1203" y="550" width="54" height="280" />
          </clipPath>
          <clipPath id={`${id}-right`}>
            <rect x="1257" y="550" width="81" height="280" />
          </clipPath>
          <linearGradient id={`${id}-interior`} x2=".85" y2="1">
            <stop stopColor="#220a18" />
            <stop offset=".68" stopColor="#5f132b" />
            <stop offset="1" stopColor="#db5852" />
          </linearGradient>
        </defs>

        <image href={scene} {...photo} />
        <image
          className="landing-scene-unlit"
          href={unlitScene}
          {...photo}
          mask={ref("sign")}
        />

        <g clipPath={ref("belt")}>
          {deliveries.map(({ kind, color, icon }) => (
            <g
              className={`landing-delivery landing-delivery-${kind}`}
              key={kind}
            >
              <ellipse
                cx="4"
                cy="20"
                rx="42"
                ry="12"
                fill="#642741"
                opacity=".23"
              />
              <g transform="rotate(31) translate(-38 -45)">
                <rect y="5" width="76" height="64" rx="10" fill={color} />
                <rect
                  width="76"
                  height="64"
                  rx="10"
                  fill="#fff0f3"
                  stroke={color}
                  strokeWidth="2"
                />
                <path
                  d={icon}
                  transform="translate(14 8)"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          ))}
        </g>

        <g className="landing-scene-doors" clipPath={ref("door")}>
          <path d={doorway} fill={ref("interior")} />
          <path
            d="M1204 826 1231 777 1337 727 V749Z"
            fill="#e76b5b"
            opacity=".42"
          />
          <g className="landing-scene-door-left">
            <g clipPath={ref("door")}>
              <image href={scene} {...photo} clipPath={ref("left")} />
            </g>
          </g>
          <g className="landing-scene-door-right">
            <g clipPath={ref("door")}>
              <image href={scene} {...photo} clipPath={ref("right")} />
            </g>
          </g>
        </g>
        <image
          className="landing-scene-coin"
          href={coin}
          x="1192"
          y="611"
          width="150"
          height="137"
        />
      </svg>
    </div>
  );
}
