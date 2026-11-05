import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  Wallet,
  ShieldCheck,
  Bell,
  Menu,
  UserRound,
  HelpCircle,
  Store,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useLanguage } from "../../i18n/LanguageContext.js";
import ThemeToggle from "../../theme/ThemeToggle.jsx";
import LanguageControl from "../../i18n/LanguageControl.jsx";
import Dropdown from "../ui/Dropdown.jsx";
import Modal from "../ui/Modal.jsx";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import {
  useNavigationLayout,
  ApplicationShellContext,
} from "./NavigationContext.js";
import {
  navigationItems,
  usesApplicationNavigation,
} from "./navigationModel.js";
import "./application-navigation.css";

function iconFor(path) {
  if (path.includes("dashboard")) return LayoutDashboard;
  if (path.includes("payment")) return Wallet;
  if (
    path.includes("admin") ||
    path.includes("committee") ||
    path.includes("verify")
  )
    return ShieldCheck;
  if (path.includes("service")) return Store;
  if (path.includes("freelancer")) return Users;
  if (path.includes("notification")) return Bell;
  if (path.includes("profile")) return UserRound;
  if (path.includes("proposal")) return FileText;
  return BriefcaseBusiness;
}
export default function ApplicationNavigation({ children }) {
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const { layout, setLayout } = useNavigationLayout();
  const [drawer, setDrawer] = useState(null);
  const active = usesApplicationNavigation(session, location.pathname);
  const drawerOpen = active && drawer === location.key;
  if (drawer !== null && drawer !== location.key) setDrawer(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px)");
    const close = () => {
      if (media.matches) setDrawer(null);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const links = navigationItems(session);
  function renderLinks(close = () => {}, items = links) {
    return items.map(({ to, label }) => {
      const Icon = iconFor(to);
      return (
        <NavLink key={to} to={to} end title={t(label)} onClick={close}>
          <Icon size={21} aria-hidden="true" />
          <span>{t(label)}</span>
        </NavLink>
      );
    });
  }
  return (
    <ApplicationShellContext.Provider value={active}>
      <div
        className={active ? "application-shell" : undefined}
        data-navigation-layout={active ? layout : undefined}
      >
        {active && (
          <header className="application-navigation">
            <a className="application-navigation__skip" href="#application-route-content">{t("Skip to content")}</a>
            <Link
              className="application-navigation__brand"
              to="/"
              aria-label={t("MIU Freelance home")}
            >
              <img
                src={logo}
                alt={t("Misr International University")}
                width="120"
                height="60"
              />
            </Link>
            <nav
              className="application-navigation__links"
              aria-label={t("Main navigation")}
            >
              {renderLinks(undefined, links.slice(0, 5))}
            </nav>
            <div className="application-navigation__utilities">
              <Link
                className="application-navigation__help"
                to="/help"
                aria-label={t("Help Center")}
              >
                <HelpCircle size={22} />
              </Link>
              <Dropdown
                key={location.key}
                className="application-account"
                label={
                  <>
                    <span className="application-avatar" aria-hidden="true">
                      {session.user.displayName.trim().slice(0, 1)}
                    </span>
                    <span className="application-account__label">
                      {t("Account menu")}
                    </span>
                  </>
                }
              >
                {(close) => (
                  <div className="application-account__content">
                    <strong>{session.user.displayName}</strong>
                    <fieldset>
                      <legend>{t("Navigation layout")}</legend>
                      {[
                        ["top", "Top navigation"],
                        ["side", "Side navigation"],
                      ].map(([value, label]) => (
                        <label key={value}>
                          <input
                            type="radio"
                            name="navigation-layout"
                            value={value}
                            checked={layout === value}
                            onChange={() => setLayout(value)}
                          />
                          {t(label)}
                        </label>
                      ))}
                    </fieldset>
                    <nav aria-label={t("More navigation")}>
                      {renderLinks(close, links.slice(5))}
                    </nav>
                    <LanguageControl />
                    <ThemeToggle />
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        logout();
                      }}
                    >
                      {t("Sign out")}
                    </button>
                  </div>
                )}
              </Dropdown>
              <button
                className="application-navigation__mobile-toggle"
                type="button"
                aria-label={t("Open navigation")}
                aria-haspopup="dialog"
                aria-expanded={drawerOpen}
                onClick={() => setDrawer(location.key)}
              >
                <Menu size={24} />
              </button>
            </div>
          </header>
        )}
        <div id={active ? "application-route-content" : undefined} tabIndex={active ? -1 : undefined} className={active ? "application-shell__content" : undefined}>
          {children}
        </div>
        {active && (
          <Modal
            open={drawerOpen}
            onClose={() => setDrawer(null)}
            title={t("Main navigation")}
            closeOnBackdrop
            className="application-drawer"
          >
            <nav aria-label={t("Main navigation")}>
              {renderLinks(() => setDrawer(null))}
            </nav>
          </Modal>
        )}
      </div>
    </ApplicationShellContext.Provider>
  );
}
