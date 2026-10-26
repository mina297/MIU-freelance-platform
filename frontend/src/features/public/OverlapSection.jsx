import { useLanguage } from "../../i18n/LanguageContext.js";
import { useRef } from "react";
import { useScrollReveal } from "./useLandingMotion.js";
import "./overlapSection.css";

export default function OverlapSection({
  children,
  id,
  className = "",
  label,
  labelledBy,
  motionEnabled,
  sectionRef,
  backdrop = "tint",
}) {
  const { t } = useLanguage();

  const ownRef = useRef(null);
  const ref = sectionRef || ownRef;
  useScrollReveal(ref, motionEnabled);

  return (
    <div
      id={id}
      className={`landing-overlap-backdrop landing-overlap-backdrop-${backdrop}`}
    >
      <section
        ref={ref}
        className={`landing-section landing-overlap-panel ${className}`}
        aria-label={t(label)}
        aria-labelledby={labelledBy}
        data-reveal
      >
        {children}
      </section>
    </div>
  );
}
