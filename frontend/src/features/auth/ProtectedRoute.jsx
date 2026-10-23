import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getRouteAccess } from "./session.js";

export default function ProtectedRoute({ route, children }) {
  const { session } = useAuth();
  const location = useLocation();
  const access = getRouteAccess(session, route);
  if (access === "allowed") return children;

  const destination =
    access === "login"
      ? "/login"
      : access === "expired"
        ? "/session-expired"
        : "/access-denied";
  return (
    <Navigate
      to={destination}
      replace
      state={{ from: location.pathname + location.search + location.hash }}
    />
  );
}
