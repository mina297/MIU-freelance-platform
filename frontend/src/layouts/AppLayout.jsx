import { Outlet, useLocation } from "react-router-dom";
import PublicHeader from "../components/navigation/PublicHeader.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function AppLayout() {
  const { session, logout } = useAuth();
  const isLanding = useLocation().pathname === "/";
  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:inline-block focus:p-3 focus:underline"
      >
        Skip to content
      </a>
      <PublicHeader />
      {session.user && (
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-3 px-5 pt-4 text-sm">
          <span>{session.user.displayName}</span>
          <button
            type="button"
            className="rounded border px-3 py-2 focus-visible:outline-2 focus-visible:outline-miu-red"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      )}
      <main
        id="main-content"
        tabIndex={-1}
        className={isLanding ? "" : "mx-auto max-w-7xl px-5 py-10 sm:px-8"}
      >
        <Outlet />
      </main>
    </div>
  );
}
