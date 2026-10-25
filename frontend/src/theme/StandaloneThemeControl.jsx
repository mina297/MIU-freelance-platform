import { matchRoutes, useLocation } from "react-router-dom";
import { routeConfig } from "../app/routeConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function StandaloneThemeControl() {
  const { pathname } = useLocation();
  const route = matchRoutes(routeConfig, pathname)?.at(-1)?.route;
  return route?.layout === "standalone" || pathname === "/admin" ? (
    <div className="theme-toolbar" aria-label="Appearance settings">
      <span>Appearance</span>
      <ThemeToggle />
    </div>
  ) : null;
}
