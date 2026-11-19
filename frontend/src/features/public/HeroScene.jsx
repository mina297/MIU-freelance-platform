import { useId } from "react";
import {
  BriefcaseBusiness,
  CodeXml,
  Check,
  ArrowUpRight,
  UserRound,
  Layers3,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { useTheme } from "../../theme/ThemeContext.js";
import { formatEGP } from "../../utils/formatEGP.js";
import lightScene from "../../assets/hero/miu-crimson-light.webp";
import darkScene from "../../assets/hero/miu-crimson-dark-reference.webp";
import "./heroScene.css";

// Both images use this 1672 × 941 coordinate system for the doorway.
const doorway =
  "M1131 721 V548 C1131 491 1169 427 1209 417 C1255 405 1292 450 1292 505 V687 Z";
// Include the red curved lip baked into the plate, outside the moving leaves.
const openDoorway =
  "M1131 721 V548 C1131 489 1168 423 1209 413 C1260 400 1302 448 1302 505 V685 Z";
const floorReflection = "matrix(1 -0.42236025 0 -1 0 1919.68944)";

function SceneCard({ kind, icon: Icon, eyebrow, title, children }) {
  const { t } = useLanguage();
  return (
    <div className={`miu-scene-card miu-scene-${kind}`}>
      <span className="miu-scene-card-icon">
        <Icon size={19} />
      </span>
      <div>
        <small>{t(eyebrow)}</small>
        <strong>{t(title)}</strong>
        {children}
      </div>
    </div>
  );
}

export default function HeroScene() {
  const id = useId();
  const { t, locale } = useLanguage();
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
      <div className="miu-scene-overlay">
        <svg
          className="miu-connections"
          viewBox="0 0 700 650"
          fill="none"
          focusable="false"
        >
          <path
            className="miu-orbit"
            d="M110 468C40 393 546 359 615 427S244 600 110 468Z"
          />
          <path
            className="miu-match-line"
            pathLength="1"
            d="M505 240C580 300 540 390 320 400"
          />
        </svg>
        <SceneCard
          kind="project"
          icon={BriefcaseBusiness}
          eyebrow="A new opportunity"
          title="Website design"
        >
          <span className="miu-card-detail">{t("Design & development")}</span>
          <span className="miu-card-tag">
            {t("Open for proposals")} <ArrowUpRight size={12} />
          </span>
        </SceneCard>
        <SceneCard
          kind="profile"
          icon={UserRound}
          eyebrow="Student freelancer"
          title="Nour Ahmed"
        >
          <span className="miu-card-detail">{t("UI / UX Designer")}</span>
          <span className="miu-card-skills">
            Figma <i /> React <i /> {t("Branding")}
          </span>
        </SceneCard>
        <SceneCard
          kind="service"
          icon={Layers3}
          eyebrow="Made by students"
          title="Ideas, beautifully built."
        >
          <span className="miu-service-swatches">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="miu-card-detail">
            {t("Portfolios & creative services")}
          </span>
        </SceneCard>
        <div className="miu-scene-match">
          <Check size={14} />
          {t("A great connection")}
        </div>
        <div className="miu-scene-laptop">
          <div className="miu-laptop-screen">
            <div className="miu-laptop-browser">
              <i />
              <i />
              <i />
              <span>nour.design</span>
            </div>
            <div className="miu-portfolio">
              <CodeXml size={20} />
              <small>{t("DESIGN. BUILD. INSPIRE.")}</small>
              <strong>
                {t("A little vision.")}
                <br />
                {t("A lasting impression.")}
              </strong>
              <div>
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="miu-laptop-base" />
          <span className="miu-completed">
            <Check size={12} />
            {t("Project completed")}
          </span>
        </div>
        <SceneCard
          kind="earnings"
          icon={ArrowUpRight}
          eyebrow="Illustrative earnings"
          title={formatEGP(3500, locale)}
        >
          <span className="miu-card-detail">
            {t("Your skills. Real possibilities.")}
          </span>
          <span className="miu-card-tag">
            {t("Fictional example · no payment")}
          </span>
        </SceneCard>
        <span className="miu-particle miu-particle-one" />
        <span className="miu-particle miu-particle-two" />
        <span className="miu-particle miu-particle-three" />
      </div>
    </div>
  );
}
