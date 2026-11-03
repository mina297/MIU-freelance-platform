import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";
import "../styles/premium-theme.css";
import "./theme.css";
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
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </LanguageProvider>
  );
}
