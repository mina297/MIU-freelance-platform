import {
  BriefcaseBusiness,
  CodeXml,
  Globe2,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.js";

function BrowserBar() {
  return (
    <div className="miu-window-bar">
      <i />
      <i />
      <i />
      <span />
    </div>
  );
}

function Avatar() {
  return (
    <svg className="miu-profile-avatar" viewBox="0 0 64 72" focusable="false">
      <path d="M6 72V57Q9 46 25 45H39Q55 46 58 57V72" fill="#b51425" />
      <path d="M25 38V49Q32 56 39 49V37" fill="#d99b7c" />
      <ellipse cx="32" cy="27" rx="15" ry="20" fill="#edb18e" />
      <path
        d="M17 31Q10 3 31 3Q53 1 48 30L42 17Q32 23 23 14L20 32"
        fill="#25191b"
      />
      <path
        d="M24 48L32 56L23 63L18 51M40 48L32 56L41 63L46 51"
        fill="#8b0a19"
      />
    </svg>
  );
}

export default function HeroJourneyOverlay() {
  const { t } = useLanguage();
  return (
    <div className="miu-scene-overlay">
      <div className="miu-journey-stage">
        <svg
          className="miu-connections"
          viewBox="0 0 700 650"
          fill="none"
          focusable="false"
        >
          <g className="miu-light-trails">
            <path
              data-trail="project"
              pathLength="1"
              d="M273 410C368 402 552 340 506 276S373 290 420 235"
            />
            <path
              data-trail="profile"
              pathLength="1"
              d="M420 235C467 180 222 215 181 294S76 353 117 380"
            />
            <path
              data-trail="users"
              pathLength="1"
              d="M117 380C158 407 35 455 4 416S-16 390-3 370"
            />
            <path
              data-trail="briefcase"
              pathLength="1"
              d="M-3 370C10 350 169 289 294 230S449 129 525 80"
            />
            <path
              data-trail="service"
              pathLength="1"
              d="M525 80C601 31 715 215 650 358S271 597 336 540"
            />
            <path
              data-trail="laptop"
              pathLength="1"
              d="M336 540C401 483 628 563 673 502S672 386 595 435"
            />
            <path
              data-trail="earnings"
              pathLength="1"
              d="M595 435C518 484 737 342 685 271S570 232 609 205"
            />
          </g>
        </svg>

        <div className="miu-scene-card miu-scene-project miu-journey-item">
          <BrowserBar />
          <div className="miu-window-content">
            <span className="miu-scene-card-icon">
              <CodeXml />
            </span>
            <div>
              <strong>{t("Website Project")}</strong>
              <span className="miu-skeleton-line" />
              <span className="miu-skeleton-line short" />
            </div>
          </div>
          <span className="miu-project-progress">
            <i />
          </span>
        </div>

        <div className="miu-scene-card miu-scene-profile miu-journey-item">
          <div className="miu-profile-preview">
            <Avatar />
            <div>
              <span className="miu-skeleton-line" />
              <span className="miu-skeleton-line" />
              <span className="miu-skeleton-line short" />
            </div>
          </div>
          <div className="miu-profile-stars">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} fill="currentColor" />
            ))}
          </div>
          <span className="miu-profile-caption">{t("Student freelancer")}</span>
        </div>

        <div className="miu-scene-card miu-scene-service miu-journey-item">
          <span className="miu-scene-card-icon">
            <CodeXml />
          </span>
          <div>
            <strong>{t("New Project")}</strong>
            <span className="miu-card-detail">{t("Website Development")}</span>
            <span className="miu-project-progress">
              <i />
            </span>
          </div>
        </div>

        <div className="miu-scene-card miu-scene-earnings miu-journey-item">
          <strong>EGP</strong>
          <div className="miu-earnings-chart">
            <i />
            <i />
            <i />
            <i />
            <TrendingUp />
          </div>
        </div>

        <div className="miu-scene-laptop miu-journey-item">
          <div className="miu-laptop-screen">
            <Globe2 />
          </div>
          <div className="miu-laptop-keyboard">
            <i />
          </div>
          <div className="miu-laptop-base" />
        </div>

        <span className="miu-floating-icon miu-floating-briefcase miu-journey-item">
          <BriefcaseBusiness />
        </span>
        <span className="miu-floating-icon miu-floating-users miu-journey-item">
          <UsersRound fill="currentColor" />
        </span>
        <span className="miu-journey-disclosure">
          {t("Fictional example · no payment")}
        </span>
      </div>
    </div>
  );
}
