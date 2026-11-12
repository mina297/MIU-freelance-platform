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
import { formatEGP } from "../../utils/formatEGP.js";
import scene from "../../assets/hero/miu-reference-rose.webp";
import "./heroScene.css";

// Coordinates of the doorway in the 1672 × 941 background plate.
const doorway =
  "M1131 723 V537 C1131 485 1168 416 1207 409 C1251 407 1292 461 1292 517 V687 Z";

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
  const url = (name) => `url(#${id}-${name})`;
  const photo = { width: 1672, height: 941 };
  return (
    <div className="landing-hero-media" aria-hidden="true">
      <svg
        className="landing-scene"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMin meet"
        width="1672"
        height="941"
        focusable="false"
      >
        <defs>
          <clipPath id={`${id}-door`}>
            <path d={doorway} />
          </clipPath>
          <clipPath id={`${id}-left`}>
            <rect x="1130" y="405" width="79" height="325" />
          </clipPath>
          <clipPath id={`${id}-right`}>
            <rect x="1209" y="405" width="85" height="325" />
          </clipPath>
          <linearGradient id={`${id}-interior`} x2=".8" y2="1">
            <stop stopColor="#310713" />
            <stop offset=".7" stopColor="#9b102b" />
            <stop offset="1" stopColor="#ffaf9b" />
          </linearGradient>
        </defs>
        <g>
          <image href={scene} {...photo} />
          <g className="landing-scene-doors" clipPath={url("door")}>
            <path d={doorway} fill={url("interior")} />
            <path
              className="miu-door-light"
              d={doorway}
              fill="#ff8e8d"
              opacity=".32"
            />
            <g className="landing-scene-door-left">
              <image href={scene} {...photo} clipPath={url("left")} />
            </g>
            <g className="landing-scene-door-right">
              <image href={scene} {...photo} clipPath={url("right")} />
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
