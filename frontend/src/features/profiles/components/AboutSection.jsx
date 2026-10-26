import { useLanguage } from "../../../i18n/LanguageContext.js";
import SkillsDisplay from "./SkillsDisplay.jsx";

/**
 * About introduction card with skills (Figma Introduction card).
 *
 * @param {{
 *   firstName: string,
 *   paragraphs: string[],
 *   skills: string[],
 * }} props
 */
export default function AboutSection({
  firstName,
  paragraphs = [],
  skills = [],
}) {
  const { t } = useLanguage();

  return (
    <section
      className="flex w-full flex-col gap-5 overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-6 shadow-[var(--shadow-panel)] sm:p-8"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-2xl font-bold leading-normal text-miu-black"
      >
        {t("About")} {firstName}
      </h2>

      {paragraphs.map((paragraph, index) => (
        <p
          key={`about-paragraph-${index}`}
          className="text-[15px] leading-[1.7] text-ink-secondary"
        >
          {paragraph}
        </p>
      ))}

      <div className="h-px w-full bg-border-soft" role="separator" />

      <h3 className="text-lg font-semibold leading-normal text-miu-black">
        {t("Skills")}
      </h3>
      <SkillsDisplay skills={skills} />
    </section>
  );
}
