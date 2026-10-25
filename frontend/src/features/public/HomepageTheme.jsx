import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import LandingHeader from "../../components/navigation/LandingHeader.jsx";
import {
  HOMEPAGE_THEME_KEY,
  readThemePreference,
  resolveHomepageTheme,
  saveThemePreference,
} from "./homepageTheme.js";
import "./homepageTheme.css";

export default function HomepageTheme({ accountAction, children }) {
  const browser = typeof window === "undefined" ? undefined : window;
  const preference = useRef(readThemePreference(browser));
  const [theme, setTheme] = useState(() => resolveHomepageTheme(browser));

  useLayoutEffect(() => {
    document.documentElement.dataset.homeTheme = theme;
    return () => {
      delete document.documentElement.dataset.homeTheme;
    };
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (!preference.current) setTheme(media.matches ? "dark" : "light");
    };
    const syncStorage = (event) => {
      if (event.key !== HOMEPAGE_THEME_KEY && event.key !== null) return;
      preference.current = readThemePreference(window);
      setTheme(resolveHomepageTheme(window, preference.current));
    };
    media.addEventListener("change", followSystem);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", followSystem);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    preference.current = next;
    saveThemePreference(window, next);
    setTheme(next);
  }

  return (
    <div className="homepage-theme" data-theme={theme}>
      <a href="#main-content" className="homepage-skip-link">
        Skip to content
      </a>
      <LandingHeader
        accountAction={accountAction}
        themeControl={
          <button
            type="button"
            className="homepage-theme-toggle"
            aria-label="Dark mode"
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
          >
            <span className="homepage-theme-toggle-track" aria-hidden="true">
              <Sun size={16} />
              <Moon size={16} />
            </span>
          </button>
        }
      />
      <main id="main-content" className="miu-public-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
