import { createContext, useContext } from "react";
import { translate } from "./translate.js";
import { localeFor } from "./locale.js";
import { formatCount } from "./formatCount.js";
export const LanguageContext = createContext({
  language: "en",
  setLanguage() {},
  t: (key, values) => translate("en", key, values),
});
export function useLanguage() {
  const context = useContext(LanguageContext);
  return {
    ...context,
    locale: localeFor(context.language),
    count: (unit, value) => formatCount(context.language, unit, value),
  };
}
