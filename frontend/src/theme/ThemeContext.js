import { createContext, useContext } from "react";

// Safe light presentation for isolated component renderers; App supplies the provider.
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);
