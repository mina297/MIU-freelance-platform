import { useLanguage } from "../../../i18n/LanguageContext.js";
/**
 * Skill chip list used in the About section.
 * @param {{ skills: string[], className?: string }} props
 */
export default function SkillsDisplay({ skills = [], className = "" }) {
  const { t } = useLanguage();

  if (!skills.length) {
    return (
      <p className="text-[13px] text-ink-secondary">
        {t("No skills listed yet.")}
      </p>
    );
  }

  return (
    <ul
      className={`flex flex-wrap content-start gap-2 ${className}`.trim()}
      aria-label={t("Skills")}
    >
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-full bg-surface-muted px-3 py-[7px] text-[13px] leading-normal text-ink-secondary"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
