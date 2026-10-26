import { useLanguage } from "../i18n/LanguageContext.js";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext.js";

export default function ThemeToggle({ floating = false }) {
  const { t } = useLanguage();

  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={`theme-toggle${floating ? " theme-toggle--floating" : ""}`}
      aria-label={t("Dark mode")}
      aria-pressed={theme === "dark"}
      title={t(
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      )}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <Sun size={16} />
        <Moon size={16} />
      </span>
    </button>
  );
}
