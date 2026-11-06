import LanguageSwitcher from "../components/navigation/LanguageSwitcher.jsx";
import { useLanguage } from "./LanguageContext.js";
const options = [
  { value: "en", label: "EN", lang: "en", dir: "ltr" },
  { value: "ar", label: "AR", lang: "ar", dir: "rtl" },
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

    </div>
  );
}
