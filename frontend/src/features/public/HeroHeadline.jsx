import { useLanguage } from "../../i18n/LanguageContext.js";

export default function HeroHeadline() {
  const { t } = useLanguage();
  return (
    <h1 id="landing-title" className="miu-hero-title">
      {t("Your Talent")}
      <br />
      <span>{t("Opens Doors.")}</span>
    </h1>
  );
}
