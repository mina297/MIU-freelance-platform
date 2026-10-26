import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { LanguageContext } from "./LanguageContext.js";
import { LANGUAGE_KEY, readLanguage, supportedLanguages } from "./locale.js";
import { translate } from "./translate.js";
import "./language.css";
export default function LanguageProvider({ children, pageTitle }) {
  const [language, updateLanguage] = useState(() => {
    try {
      return readLanguage(window.localStorage);
    } catch {
      return "en";
    }
  });
  const setLanguage = useCallback((next) => {
    if (!supportedLanguages.includes(next)) return;
    updateLanguage(next);
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next);
    } catch {
      /* Blocked storage is optional. */
    }
  }, []);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (pageTitle) document.title = translate(language, pageTitle);
  }, [language, pageTitle]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key, values) => translate(language, key, values),
    }),
    [language, setLanguage],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
