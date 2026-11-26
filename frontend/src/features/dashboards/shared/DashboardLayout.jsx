import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useDashboardSection } from "./useDashboardSection.js";
import "./DashboardLayout.css";

/** Contextual dashboard shell, rendered inside the existing application layout. */
export default function DashboardLayout({
  title,
  subtitle,
  navItems,
  defaultSection = "overview",
  children,
  variant = "student",
  mainId = "dashboard-main",
  navLabel = "Dashboard sections",
  caption,
  brand,
  mobileAccount,
  sidebarFooter,
  headerAccount,
  breadcrumbIcon,
  navigationLinks = [],
  onSectionChange,
  overlays,
  contentOnly = false,
}) {
  const { t } = useLanguage();
  const { activeSection, navigate } = useDashboardSection(
    navItems,
    defaultSection,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = variant === "admin";
  const prefix = admin ? "ac" : "sd";
  const label = navItems.find(({ id }) => id === activeSection)?.label ?? title;
  const navigationId = `${mainId}-navigation`;
  function go(id) {
    navigate(id);
    setMenuOpen(false);
    onSectionChange?.(id);
  }
  const nav = (
    <nav aria-label={t(navLabel)}>
      {navItems.map(({ id, label: itemLabel, icon, badge }) => (
        <button
          key={id}
          onClick={() => go(id)}
          aria-current={activeSection === id ? "page" : undefined}
        >
          {icon}
          {variant === "client" ? <span>{t(itemLabel)}</span> : t(itemLabel)}
          {badge !== undefined && badge !== null && (
            <b className="cd-nav-count">{badge}</b>
          )}
        </button>
      ))}
      {navigationLinks.map(({ to, label: linkLabel, icon }) => (
        <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>
          {icon}
          {variant === "client" ? <span>{t(linkLabel)}</span> : t(linkLabel)}
        </NavLink>
      ))}
    </nav>
  );
  return (
    <div
      className={
        admin
          ? "admin-center"
          : `student-dashboard${variant === "client" ? " client-dashboard" : ""}`
      }
    >
      <a className={`${prefix}-skip`} href={`#${mainId}`}>
        {t(admin ? "Skip to control center" : "Skip to dashboard content")}
      </a>
      {!contentOnly && (
        <aside className={`${prefix}-sidebar`}>
          {brand}
          {admin ? (
            <>
              <p className="ac-eyebrow">{t(caption)}</p>
              {nav}
              {sidebarFooter}
            </>
          ) : (
            <>
              <button
                className="sd-menu"
                aria-label={t(
                  variant === "client"
                    ? "Toggle client navigation"
                    : "Toggle student navigation",
                )}
                aria-controls={navigationId}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
              {mobileAccount}
              <div
                id={navigationId}
                className={`sd-navigation ${menuOpen ? "sd-open" : ""}`}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setMenuOpen(false);
                }}
              >
                <p className="sd-caption">{t(caption)}</p>
                {nav}
                {sidebarFooter}
              </div>
            </>
          )}
        </aside>
      )}
      <div className={`${prefix}-workspace`}>
        {!contentOnly && (
          <header className={`${prefix}-topbar`}>
            {admin ? (
              <span>
                {t(title)} <span aria-hidden="true">/</span> <b>{t(label)}</b>
              </span>
            ) : (
              <div className="sd-breadcrumb">
                {t(title)} {breadcrumbIcon}
                <strong>{t(label)}</strong>
              </div>
            )}
            {headerAccount}
          </header>
        )}
        <main id={mainId} className={`${prefix}-main`}>
          {subtitle && <p>{t(subtitle)}</p>}
          {typeof children === "function"
            ? children({ activeSection, navigate: go })
            : children}
        </main>
      </div>
      {overlays}
    </div>
  );
}
