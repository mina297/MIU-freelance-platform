import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext.js";

export default function ThemeToggle({ floating = false }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={`theme-toggle${floating ? " theme-toggle--floating" : ""}`}
      aria-label="Dark mode"
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <Sun size={16} />
        <Moon size={16} />
      </span>
    </button>
  );
}
