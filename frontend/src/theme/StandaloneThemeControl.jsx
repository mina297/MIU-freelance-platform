import { useLanguage } from "../i18n/LanguageContext.js";
import { matchRoutes, useLocation } from "react-router-dom";
import { routeConfig } from "../app/routeConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageControl from "../i18n/LanguageControl.jsx";

export default function StandaloneThemeControl() {
  const { t } = useLanguage();

  const { pathname } = useLocation();
  const route = matchRoutes(routeConfig, pathname)?.at(-1)?.route;
  return route?.layout === "standalone" || pathname === "/admin" ? (
    <div className="theme-toolbar" aria-label={t("Appearance settings")}>
      <span>{t("Appearance")}</span>
      <LanguageControl />
      <ThemeToggle />
    </div>
  ) : null;
}
