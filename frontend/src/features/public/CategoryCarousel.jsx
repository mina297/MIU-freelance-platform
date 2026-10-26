import { useLanguage } from "../../i18n/LanguageContext.js";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CodeXml,
  GraduationCap,
  Languages,
  Megaphone,
  Palette,
  PenLine,
  Video,
} from "lucide-react";
import { landingCategories, landingCategoryLabels } from "./landingData.js";
import { useScrollReveal } from "./useLandingMotion.js";
import useCategoryEdgeScroll from "./useCategoryEdgeScroll.js";
import "./categoryCarousel.css";

const categoryIcons = {
  Design: Palette,
  Development: CodeXml,
  Writing: PenLine,
  Translation: Languages,
  Marketing: Megaphone,
  Video,
  Tutoring: GraduationCap,
};

export default function CategoryCarousel({
  category,
  onSelect,
  motionEnabled,
}) {
  const { t, language } = useLanguage();

  const root = useRef(null);
  const track = useRef(null);
  useScrollReveal(root, motionEnabled);
  useCategoryEdgeScroll(track, motionEnabled);
  function scroll(direction) {
    track.current.scrollBy({
      left:
        direction *
        (language === "ar" ? -1 : 1) *
        track.current.clientWidth *
        0.75,
      behavior: motionEnabled ? "smooth" : "instant",
    });
  }

  return (
    <section
      ref={root}
      className="landing-section landing-category-section"
      aria-labelledby="categories-title"
      data-reveal
    >
      <div className="landing-container">
        <div
          className="landing-heading landing-category-section-heading"
          data-reveal
        >
          <div>
            <p className="landing-eyebrow">{t("A world of possibilities")}</p>
            <h2 id="categories-title">{t("Explore your next direction.")}</h2>
          </div>
          <div
            className="landing-carousel-controls"
            aria-label={t("Category scrolling")}
          >
            <button
              type="button"
              aria-label={t("Scroll categories left")}
              aria-controls="landing-category-track"
              onClick={() => scroll(-1)}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("Scroll categories right")}
              aria-controls="landing-category-track"
              onClick={() => scroll(1)}
            >
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          ref={track}
          id="landing-category-track"
          className="landing-categories"
          role="group"
          aria-label={t("Featured job categories")}
          tabIndex={0}
        >
          {landingCategories.map((value, index) => {
            const CategoryIcon = categoryIcons[value];
            return (
              <button
                key={value}
                type="button"
                className="landing-category-card"
                data-reveal
                style={{ "--reveal-delay": `${Math.min(index, 4) * 85}ms` }}
                aria-pressed={category === value}
                onClick={() => onSelect(value)}
              >
                <span className="landing-category-name">
                  {t(landingCategoryLabels[value] || value)}
                </span>
                <span className="landing-category-art">
                  <CategoryIcon
                    size={44}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
                <ArrowRight
                  className="landing-category-arrow"
                  size={18}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
