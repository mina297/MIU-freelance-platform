import { useLanguage } from "../i18n/LanguageContext.js";
import { Link, Outlet, useLocation } from "react-router-dom";
import LandingHeader from "../components/navigation/LandingHeader.jsx";
import Dropdown from "../components/ui/Dropdown.jsx";
import logo from "../assets/figma/miu-anniversary-logo.png";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "../features/auth/session.js";
import "../features/auth/authForm.css";

export default function AuthLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const path = location.pathname.toLowerCase().replace(/\/+$/, "");
  const signingIn = path === "/login";
  const showAccountHeader =
    signingIn || ["/register", "/register/role"].includes(path);
  const role = new URLSearchParams(location.search).get("role");
  const showAccountType =
    signingIn ||
    (path === "/register" && PUBLIC_REGISTRATION_ROLES.includes(role));

  return (
    <div className="premium-auth-layout min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">
        {t("Skip to content")}
      </a>
      {showAccountHeader ? (
        <header className="auth-account-header">
          <Link
            className="auth-home-link"
            to="/"
            aria-label={t("MIU Freelance home")}
          >
            <img src={logo} alt="" />
          </Link>
          {showAccountType && (
            <Dropdown
              key={location.key}
              className="auth-role-menu"
              label="Change account type"
            >
              {(close) =>
                PUBLIC_REGISTRATION_ROLES.map((option) => (
                  <Link
                    key={option}
                    className="disclosure-item"
                    aria-current={option === role ? "page" : undefined}
                    to={`${signingIn ? "/login" : "/register"}?role=${option}`}
                    onClick={close}
                  >
                    {t(option === ROLES.STUDENT ? "Student" : "Client")}
                  </Link>
                ))
              }
            </Dropdown>
          )}
        </header>
      ) : (
        <LandingHeader />
      )}
      <main
        id="main-content"
        tabIndex={-1}
        className={`mx-auto max-w-7xl px-4 sm:px-8 ${showAccountHeader ? "pb-6" : "py-10"}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
