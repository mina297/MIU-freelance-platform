import { useLanguage } from "../i18n/LanguageContext.js";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import HomepageTheme from "../features/public/HomepageTheme.jsx";
import PublicLink from "../components/navigation/PublicLink.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getLoginDestination } from "../features/auth/navigation.js";
import { isActiveUser } from "../features/auth/session.js";
import { routeConfig } from "./routeConfig.js";
import { publicDestinations } from "./publicDestinations.js";

export default function PublicWebsite() {
  const { t } = useLanguage();

  const { pathname, hash, key } = useLocation();
  const { session, logout } = useAuth();
  const signedIn =
    session.status === "authenticated" && isActiveUser(session.user);

  useEffect(() => {
    document.querySelector(".miu-public-main")?.focus({ preventScroll: true });
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  const accountAction = signedIn ? (
    <>
      <PublicLink
        className="miu-public-signup"
        href={getLoginDestination(session.user, null, routeConfig)}
      >
        {t("My workspace")}
      </PublicLink>
      <button type="button" onClick={logout} className="miu-public-link">
        {t("Sign out")}
      </button>
    </>
  ) : undefined;
  const content = <Outlet />;

  // The replacement homepage owns its footer; other public pages retain the
  // shared shell. Do not render a second header/footer around the homepage.
  if (pathname === "/") {
    return (
      <HomepageTheme accountAction={accountAction}>{content}</HomepageTheme>
    );
  }

  return (
    <PublicLayout
      destinations={publicDestinations}
      currentPath={pathname}
      accountAction={accountAction}
    >
      {content}
    </PublicLayout>
  );
}
