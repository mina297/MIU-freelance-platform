// Only language persists. Theme always starts light.
try {
  const language = localStorage.getItem("miu.language") === "ar" ? "ar" : "en";
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
} catch {
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
}
