import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal.jsx";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Layers,
  Users,
  UserRound,
  Menu,
  SlidersHorizontal,
} from "lucide-react";
import Dropdown from "../ui/Dropdown.jsx";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import "./publicHeader.css";
import ThemeToggle from "../../theme/ThemeToggle.jsx";
import LanguageControl from "../../i18n/LanguageControl.jsx";

const navigation = [
  {
    label: "Hire Talent",
    eyebrow: "Make your next idea happen",
    links: [
      {
        to: "/#student-talent",
        title: "Explore student talent",
        description: "Meet skilled students from MIU.",
        icon: Users,
      },
      {
        to: "/services",
        title: "Browse services",
        description: "Discover services for your next project.",
        icon: Layers,
      },
      {
        to: "/register?role=client",
        title: "Post a job",
        description: "Get started with a client account.",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Find Work",
    eyebrow: "Build a career around your skills",
    links: [
      {
        to: "/projects",
        title: "Browse projects",
        description: "Find your next opportunity.",
        icon: BriefcaseBusiness,
      },
      {
        to: "/register?role=student",
        title: "Join as a student",
        description: "Turn your skills into experience.",
        icon: GraduationCap,
      },
      {
        to: "/#how-it-works",
        title: "How it works",
        description: "Your path from first brief to delivery.",
        icon: Layers,
      },
    ],
  },
];

export default function LandingHeader({ accountAction }) {
  const { t } = useLanguage();
  const location = useLocation();
  const header = useRef(null);
  const [drawerKey, setDrawerKey] = useState(null);
  const drawerOpen = drawerKey === location.key;
  if (drawerKey !== null && drawerKey !== location.key) setDrawerKey(null);
  useEffect(() => {
    const element = header.current;
    const scroller = document.scrollingElement;
    if (!element || !scroller) return;

    let previous = Math.max(0, scroller.scrollTop);
    function updateDirection() {
      const current = Math.max(
        0,
        Math.min(scroller.scrollTop, scroller.scrollHeight - scroller.clientHeight),
      );
      if (current === previous) return;

      const hide = current > element.offsetHeight && current > previous;
      element.toggleAttribute("data-scroll-hidden", hide);
      previous = current;
    }

    window.addEventListener("scroll", updateDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateDirection);
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1180px)");
    const close = () => {
      if (desktop.matches) setDrawerKey(null);
    };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);
  const closeDrawer = () => setDrawerKey(null);
  const authLinks = accountAction ?? (
    <>
      <Link to="/login" className="public-sign-in">
        {t("Sign In")}
      </Link>
      <Link to="/register" className="public-sign-up">
        {t("Sign Up")}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </>
  );
  function renderLinks(links, close) {
    return links.map(({ to, title, description, icon: ItemIcon }) => (
      <Link
        key={to}
        to={to}
        onClick={close}
        className="disclosure-item public-dropdown-link"
      >
        <span className="public-dropdown-icon">
          <ItemIcon size={20} aria-hidden="true" />
        </span>
        <span>
          <strong>{t(title)}</strong>
          <small>{t(description)}</small>
        </span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    ));
  }
  return (
    <header ref={header} className="public-header">
      <div className="public-header-inner">
        <Link
          to="/"
          aria-label={t("MIU Freelance home")}
          className="public-brand"
        >
          <img
            src={miuLogo}
            alt={t("Misr International University")}
            width="112"
            height="56"
          />
          <span>
            {t("Freelance")}
            <b aria-hidden="true">.</b>
          </span>
        </Link>
        <nav aria-label={t("Public navigation")} className="public-navigation">
          {navigation.map(({ label, eyebrow, links }) => (
            <Dropdown
              key={label}
              label={t(label)}
              className="public-nav-dropdown"
            >
              {(close) => (
                <>
                  <p className="public-dropdown-eyebrow">{t(eyebrow)}</p>
                  {renderLinks(links, close)}
                </>
              )}
            </Dropdown>
          ))}
          <Link to="/#how-it-works" className="public-nav-link">
            {t("How it works")}
          </Link>
        </nav>
        <div className="public-auth-links">
          <div className="public-header-tools">
            <LanguageControl />
            <Dropdown
              key={location.key}
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
                  <span>{t("Appearance")}</span>
                  <ThemeToggle />
                </div>
              )}
            </Dropdown>
          </div>
          <div className="public-desktop-account">
            {accountAction ? (
              <Dropdown
                className="public-account-menu"
                label={
                  <>
                    <UserRound size={19} aria-hidden="true" />
                    <span className="public-control-label">
                      {t("Account menu")}
                    </span>
                  </>
                }
              >
                {(close) => (
                  <div
                    className="public-account-menu__actions"
                    onClick={(event) => {
                      if (event.target.closest("a, button")) close();
                    }}
                  >
                    {accountAction}
                  </div>
                )}
              </Dropdown>
            ) : (
              authLinks
            )}
          </div>
          <button
            type="button"
            className="public-mobile-menu"
            aria-label={t("Open navigation")}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerKey(location.key)}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
      <Modal
        open={drawerOpen}
        onClose={closeDrawer}
        closeOnBackdrop
        title={t("Public navigation")}
        className="public-navigation-drawer"
      >
        <nav aria-label={t("Public navigation")}>
          {navigation.map(({ label, links }) => (
            <section key={label}>
              <h3>{t(label)}</h3>
              {renderLinks(links, closeDrawer)}
            </section>
          ))}
        </nav>
        <div
          className="public-drawer-account"
          onClick={(event) => {
            if (event.target.closest("a, button")) closeDrawer();
          }}
        >
          {authLinks}
        </div>
      </Modal>
    </header>
  );
}
