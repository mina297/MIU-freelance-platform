import { useLanguage } from "./LanguageContext.js";

/** Render interface copy without adding a DOM wrapper. Never use on user content. */
export default function LocalizedText({ children }) {
  const { t } = useLanguage();
  return t(children);
}
