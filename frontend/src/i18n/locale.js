export const LANGUAGE_KEY = "miu.language";
export const supportedLanguages = ["en", "ar"];
export function readLanguage(storage) {
  try {
    return storage?.getItem(LANGUAGE_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}
export function localeFor(language) {
  return language === "ar" ? "ar-EG" : "en-EG";
}
