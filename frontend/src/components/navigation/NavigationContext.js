import { createContext, useContext } from "react";
export const NavigationContext = createContext({
  layout: "top",
  setLayout() {},
});
export const useNavigationLayout = () => useContext(NavigationContext);

export const ApplicationShellContext = createContext(false);
