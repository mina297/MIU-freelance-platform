import LanguageSwitcher from "../components/navigation/LanguageSwitcher.jsx";
import { useLanguage } from "./LanguageContext.js";
const options = [
  { value: "en", label: "English", lang: "en", dir: "ltr" },
  { value: "ar", label: "العربية", lang: "ar", dir: "rtl" },
];
export default function LanguageControl() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-control">
      <LanguageSwitcher
        options={options}
        value={language}
        onValueChange={setLanguage}
        label={t("Language")}
        placeholder={t("Select language")}
      />
      {language === "ar" && (
        <span
          className="language-draft"
          role="status"
          title={t(
            "Arabic interface translation — draft pending team approval",
          )}
        >
          {t("Draft Arabic")}
        </span>
      )}
    </div>
  );
}
