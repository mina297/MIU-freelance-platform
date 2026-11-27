import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  Wallet,
  ShieldCheck,
  Bell,
  Menu,
  Check,
  LogOut,
  SlidersHorizontal,
  UserRound,
  HelpCircle,
  Store,
  Users,
  Clock,
  CircleCheck,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useLanguage } from "../../i18n/LanguageContext.js";
import ThemeToggle from "../../theme/ThemeToggle.jsx";
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
import "./publicHeader.css";
import "./application-navigation.css";
import "./publicHeaderAppearance.css";
import "./applicationHeaderAppearance.css";
import useScrollHeader from "./useScrollHeader.js";

function iconFor(path) {
  if (path === "/help") return HelpCircle;
  if (path.includes("section=applications")) return FileText;
  if (path.includes("section=jobs")) return BriefcaseBusiness;
  if (path.includes("section=applicants")) return Users;
  if (path.includes("section=active")) return Clock;
  if (path.includes("section=completed")) return CircleCheck;
  if (path.includes("section=profile")) return UserRound;
  if (path.includes("section=settings")) return Settings;
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
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { layout, setLayout } = useNavigationLayout();
  const [drawer, setDrawer] = useState(null);
  const adminWorkspace = ["/admin", "/superadmin"].includes(
    location.pathname.toLowerCase(),
  );
  const active =
    !adminWorkspace && usesApplicationNavigation(session, location.pathname);
  const landingHeader = layout === "top";
  const drawerOpen = active && drawer === location.key;
  const header = useScrollHeader({
    enabled: active,
    routeKey: location.key,
    keepVisible: drawerOpen,
    desktopSidebar: layout === "side",
  });
  if (drawer !== null && drawer !== location.key) setDrawer(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const close = () => {
      if (media.matches) setDrawer(null);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const links = navigationItems(session);
  const sectionLinks = links.filter((item) => item.section);
  const helpLink = { to: "/help", label: "Help Center" };
  const moreLinks = [...sectionLinks, helpLink];
  const routeLinks = links.filter(
    (item) => !item.section && item.to !== "/help",
  );
  function renderLinks(close = () => {}, items = links) {
    return items.map(({ to, label, section }) => {
      const Icon = iconFor(to);
      const targetPath = to.split("?")[0];
      const requestedSection = new URLSearchParams(location.search).get(
        "section",
      );
      const currentSection = sectionLinks.some(
        (item) => item.section === requestedSection,
      )
        ? requestedSection
        : "overview";
      const isActive =
        location.pathname === targetPath &&
        (!sectionLinks.some((item) => item.to.split("?")[0] === targetPath) ||
          currentSection === (section ?? "overview"));
      return (
        <Link
          key={to}
          to={to}
          aria-current={isActive ? "page" : undefined}
          title={t(label)}
          onClick={close}
          className={
            `${landingHeader ? "public-nav-link" : ""}${isActive ? " active" : ""}`.trim() ||
            undefined
          }
        >
          <Icon size={21} aria-hidden="true" />
          <span>{t(label)}</span>
        </Link>
      );
    });
  }
  return (
    <ApplicationShellContext.Provider value={active}>
      <div
        className={active ? "application-shell" : undefined}
        data-navigation-layout={active ? layout : undefined}
        data-student-workspace={
          active && session.user.role === "student" ? "" : undefined
        }
        data-student-dashboard={
          active &&
          session.user.role === "student" &&
          location.pathname === "/student/dashboard"
            ? ""
            : undefined
        }
      >
        {active && (
          <header
            ref={header}
            className={`application-navigation scroll-header${landingHeader ? " public-header application-navigation--landing" : ""}`}
          >
            <a
              className="application-navigation__skip"
              href="#application-route-content"
            >
              {t("Skip to content")}
            </a>
            <Link
              className={`application-navigation__brand${landingHeader ? " public-brand" : ""}`}
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
              className={`application-navigation__links${landingHeader ? " public-navigation" : ""}`}
              aria-label={t("Main navigation")}
            >
              {renderLinks(undefined, routeLinks.slice(0, 5))}
              {moreLinks.length > 0 && (
                <Dropdown
                  key={location.key}
                  label={
                    <span className="application-navigation__more-label">
                      {t("More navigation")}
                    </span>
                  }
                  triggerProps={{ title: t("More navigation") }}
                  className="application-navigation__sections"
                >
                  {(close) => (
                    <nav aria-label={t("More navigation")}>
                      {renderLinks(close, moreLinks)}
                    </nav>
                  )}
                </Dropdown>
              )}
            </nav>
            <div
              className={`application-navigation__utilities${landingHeader ? " public-header-tools" : ""}`}
            >
              <div className="application-navigation__tools">
                <Dropdown
                  key={`appearance-${location.key}`}
                  className="public-preferences"
                  label={
                    <>
                      <SlidersHorizontal size={19} aria-hidden="true" />
                      <span className="public-control-label">
                        {t("Appearance settings")}
                      </span>
                    </>
                  }
                >
                  {() => (
                    <div className="public-preferences-content">
                      <div className="application-preferences__row">
                        <span>{t("Appearance")}</span>
                        <ThemeToggle />
                      </div>
                      <div className="application-preferences__row">
                        <span>{t("Language")}</span>
                        <button
                          type="button"
                          className="theme-toggle application-language-toggle"
                          aria-label={`${t("Language")}: العربية`}
                          aria-pressed={language === "ar"}
                          title={language === "ar" ? "English" : "العربية"}
                          onClick={() =>
                            setLanguage(language === "ar" ? "en" : "ar")
                          }
                        >
                          <span
                            className="theme-toggle-track"
                            dir="ltr"
                            aria-hidden="true"
                          >
                            <span lang="en">EN</span>
                            <span lang="en">AR</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </Dropdown>
              </div>
              {["student", "client"].includes(session.user.role) && (
                <Link
                  to="/profile"
                  className="application-profile-link"
                  aria-label={t("My profile")}
                  title={t("My profile")}
                >
                  <span className="application-avatar" aria-hidden="true">
                    {session.user.displayName.trim().slice(0, 1)}
                  </span>
                </Link>
              )}
              <Dropdown
                key={location.key}
                className={`application-account${landingHeader ? " public-account-menu" : ""}`}
                label={
                  <>
                    {["student", "client"].includes(session.user.role) ? (
                      <UserRound size={20} aria-hidden="true" />
                    ) : (
                      <span className="application-avatar" aria-hidden="true">
                        {session.user.displayName.trim().slice(0, 1)}
                      </span>
                    )}
                    <span className="application-account__label">
                      {t("Account menu")}
                    </span>
                  </>
                }
              >
                {(close) => (
                  <div className="application-account__content">
                    <div className="application-account__identity">
                      <span className="application-avatar" aria-hidden="true">
                        {session.user.displayName.trim().slice(0, 1)}
                      </span>
                      <div>
                        <small>{t("My workspace")}</small>
                        <strong>{session.user.displayName}</strong>
                      </div>
                    </div>
                    <fieldset>
                      <legend>{t("Navigation layout")}</legend>
                      {[
                        ["top", "Top navigation"],
                        ["side", "Side navigation"],
                      ].map(([value, label]) => (
                        <label key={value} className="navigation-choice">
                          <input
                            type="radio"
                            name="navigation-layout"
                            value={value}
                            checked={layout === value}
                            onChange={(event) => {
                              const trigger = event.currentTarget
                                .closest(".application-account")
                                ?.querySelector(".disclosure-trigger");
                              trigger?.focus({ preventScroll: true });
                              close();
                              setLayout(value);
                            }}
                          />
                          <span className="navigation-choice__card">
                            <span
                              className={`navigation-miniature navigation-miniature--${value}`}
                              aria-hidden="true"
                            >
                              <i />
                              <b />
                              <em />
                            </span>
                            <span className="navigation-choice__caption">
                              {t(label)}
                              <Check size={14} aria-hidden="true" />
                            </span>
                          </span>
                        </label>
                      ))}
                    </fieldset>
                    <nav aria-label={t("More navigation")}>
                      {renderLinks(close, routeLinks.slice(5))}
                    </nav>
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        logout();
                        navigate("/", { replace: true });
                      }}
                    >
                      <LogOut size={17} aria-hidden="true" />
                      {t("Sign out")}
                    </button>
                  </div>
                )}
              </Dropdown>
              <button
                className={`application-navigation__mobile-toggle${landingHeader ? " public-mobile-menu" : ""}`}
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
        <div
          id={active ? "application-route-content" : undefined}
          tabIndex={active ? -1 : undefined}
          className={active ? "application-shell__content" : undefined}
        >
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
              {renderLinks(
                () => setDrawer(null),
                [...links.filter((item) => item.to !== "/help"), helpLink],
              )}
            </nav>
          </Modal>
        )}
      </div>
    </ApplicationShellContext.Provider>
  );
}
