import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LandingHeader from "../components/navigation/LandingHeader.jsx";
import { ApplicationShellContext } from "../components/navigation/NavigationContext.js";
export default function StandaloneLayout() {
  const hasShell = useContext(ApplicationShellContext);
  const { pathname } = useLocation();
  const adminRoute = ["/superadmin", "/admin"].includes(pathname.toLowerCase());
  return (
    <ApplicationShellContext.Provider value={true}>
      {!hasShell && !adminRoute && <LandingHeader />}
      <Outlet />
    </ApplicationShellContext.Provider>
  );
}
