import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";
import "../styles/premium-theme.css";
import "./theme.css";
import LanguageProvider from "../i18n/LanguageProvider.jsx";

export default function ThemeProvider({ children, pageTitle }) {
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
