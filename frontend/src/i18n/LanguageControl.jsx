import { Check } from "lucide-react";
import Dropdown from "../components/ui/Dropdown.jsx";
import { useLanguage } from "./LanguageContext.js";

const options = [
  { value: "en", code: "EN", name: "English", dir: "ltr" },
  { value: "ar", code: "AR", name: "العربية", dir: "rtl" },
];

export default function LanguageControl() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-control">
      <Dropdown
        label={
          <>
            <span className="sr-only">{t("Language")}</span>
            <span lang="en">{language.toUpperCase()}</span>
          </>
        }
      >
        {(close) => (
          <>
            <p className="language-menu-heading">{t("Language")}</p>
            {options.map(({ value, code, name, dir }) => (
              <button
                className="disclosure-item language-menu-option"
                type="button"
                key={value}
                aria-pressed={language === value}
                onClick={() => {
                  setLanguage(value);
                  close();
                }}
              >
                <span className="language-menu-code" lang="en" aria-hidden="true">
                  {code}
                </span>
                <span lang={value} dir={dir}>{name}</span>
                {language === value && <Check size={16} aria-hidden="true" />}
              </button>
            ))}
          </>
        )}
      </Dropdown>
    </div>
  );
}
