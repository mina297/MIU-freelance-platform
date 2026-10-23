import { Link, Outlet } from "react-router-dom";
import { routeConfig } from "../app/routeConfig.js";
import SessionControls from "../app/SessionControls.jsx";
import { getRouteAccess } from "../features/auth/session.js";
import { useAuth } from "../hooks/useAuth.js";

export default function AppLayout({ title = "Application" }) {
  const { session } = useAuth();
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <a href="#main-content" className="underline">
        Skip to content
      </a>
      <header className="my-4 space-y-3">
        <Link to="/" className="font-display text-2xl text-miu-black">
          MIU Freelance
        </Link>
        <p>{title} · Phase 1 routing demonstration</p>
        <nav aria-label="Demo navigation" className="flex flex-wrap gap-3">
          {routeConfig
            .filter(
              (route) =>
                !route.message && getRouteAccess(session, route) === "allowed",
            )
            .map((route) => (
              <Link className="underline" key={route.path} to={route.path}>
                {route.title}
              </Link>
            ))}
        </nav>
      </header>
      <SessionControls />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
