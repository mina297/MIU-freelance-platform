import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import LandingHeader from "../../components/navigation/LandingHeader.jsx";
import "./homepageTheme.css";

export default function HomepageTheme({ accountAction, children }) {
  const [theme, setTheme] = useState("light");

  useLayoutEffect(() => {
    document.documentElement.dataset.homeTheme = theme;
    return () => {
      delete document.documentElement.dataset.homeTheme;
    };
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
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
