import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";
import "../styles/premium-theme.css";
import "./theme.css";
import "../styles/brand-palette.css";
import "../styles/interface-motion.css";
import LanguageProvider from "../i18n/LanguageProvider.jsx";

export default function ThemeProvider({ children, pageTitle }) {
  useEffect(() => {
    const root = document.documentElement;
    const pointer = () => { root.dataset.motionInput = "pointer"; };
    const keyboard = () => { root.dataset.motionInput = "keyboard"; };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", keyboard, true);
      delete root.dataset.motionInput;
    };
  }, []);
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      document.documentElement.dataset.theme = "light";
    };
  }, [theme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return (
    <LanguageProvider pageTitle={pageTitle}>
      <ThemeContext.Provider value={value}>
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter id="miu-logo-dark" colorInterpolationFilters="sRGB">
              {/* Mask crimson separately so only neutral black/white invert. */}
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  20 -20 0 0 0"
                result="redMask"
              />
              <feComponentTransfer in="SourceGraphic" result="inverted">
                <feFuncR type="linear" slope="-1" intercept="1" />
                <feFuncG type="linear" slope="-1" intercept="1" />
                <feFuncB type="linear" slope="-1" intercept="1" />
              </feComponentTransfer>
              <feComposite
                in="inverted"
                in2="redMask"
                operator="out"
                result="neutral"
              />
              <feComposite
                in="SourceGraphic"
                in2="redMask"
                operator="in"
                result="crimson"
              />
              <feMerge>
                <feMergeNode in="neutral" />
                <feMergeNode in="crimson" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {children}
      </ThemeContext.Provider>
    </LanguageProvider>
  );
}
