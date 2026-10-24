import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import PublicLink from "../components/navigation/PublicLink.jsx";
import SessionControls from "./SessionControls.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getLoginDestination } from "../features/auth/navigation.js";
import { isActiveUser } from "../features/auth/session.js";
import { routeConfig } from "./routeConfig.js";
import { publicDestinations } from "./publicDestinations.js";

export default function PublicWebsite() {
  const { pathname } = useLocation();
  const { session } = useAuth();
  const signedIn =
    session.status === "authenticated" && isActiveUser(session.user);

  useEffect(() => {
    const title =
      routeConfig.find((route) => route.path === pathname)?.title ??
      "Page not found";
    document.title = `${title} | MIU Freelance`;
    document.querySelector(".miu-public-main")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PublicLayout
      destinations={publicDestinations}
      currentPath={pathname}
      accountAction={
        signedIn ? (
          <PublicLink
            className="miu-public-signup"
            href={getLoginDestination(session.user, null, routeConfig)}
          >
            My workspace
          </PublicLink>
        ) : undefined
      }
    >
      <Outlet />
      <details className="mx-auto my-8 max-w-5xl rounded-xl border border-[#c9bac1] p-4">
        <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-miu-red">
          Phase 1 demo session controls
        </summary>
        <SessionControls />
      </details>
    </PublicLayout>
  );
}
