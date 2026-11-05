import { useContext } from "react";
import { Outlet } from "react-router-dom";
import LandingHeader from "../components/navigation/LandingHeader.jsx";
import { ApplicationShellContext } from "../components/navigation/NavigationContext.js";
export default function StandaloneLayout() {
  const hasShell = useContext(ApplicationShellContext);
  return <ApplicationShellContext.Provider value={true}>
    {!hasShell && <LandingHeader />}
    <Outlet />
  </ApplicationShellContext.Provider>;
}
