import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import Button from "../ui/Button.jsx";
import PublicLink from "./PublicLink.jsx";
import {
  DESKTOP_LINKS,
  MENU_LINKS,
  PRIMARY_LINKS,
} from "./publicShellContent.js";
import "./public-shell.css";

/** Visitor presentation only; routing and session policy belong to Member 1. */
export default function PublicHeader({ destinations = {}, currentPath }) {
  const [menu, setMenu] = useState({ open: false, path: currentPath });
  const menuOpen = menu.open && menu.path === currentPath;
  const panelId = useId();
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const homeRef = useRef(null);
  const closeMenu = () => setMenu({ open: false, path: currentPath });

  // Discard old disclosure state on navigation, including a later back visit.
  if (menu.path !== currentPath) {
    setMenu({ open: false, path: currentPath });
  }

  useEffect(() => {
    if (!menuOpen) return;
    const header = headerRef.current;
    const desktop = window.matchMedia("(min-width: 960px)");
    function onOutsidePointer(event) {
      if (!header.contains(event.target)) {
        setMenu({ open: false, path: currentPath });
      }
    }
    function onResize(event) {
      if (!event.matches) return;
      if (header.contains(document.activeElement)) homeRef.current?.focus();
      setMenu({ open: false, path: currentPath });
    }
    document.addEventListener("pointerdown", onOutsidePointer);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointer);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen, currentPath]);

  const renderLink = ({ key, label }, className = "") => (
    <PublicLink
      key={key}
      href={destinations[key]}
      currentPath={currentPath}
      className={className}
      onClick={closeMenu}
    >
      {label}
    </PublicLink>
  );

  return (
    <header
      className="miu-public-header"
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          event.preventDefault();
          closeMenu();
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="miu-public-header__inner">
        <a
          className="miu-public-brand"
          href={destinations.home ?? "/"}
          ref={homeRef}
          aria-label="MIU Freelance home"
        >
          <img
            src={miuLogo}
            alt="Misr International University"
            width="400"
            height="200"
          />
        </a>
        <nav
          className="miu-public-header__desktop-nav"
          aria-label="Public navigation"
        >
          {DESKTOP_LINKS.map((link) => renderLink(link))}
        </nav>
        <div className="miu-public-header__actions">
          {renderLink(
            { key: "login", label: "Log in" },
            "miu-public-header__desktop-login",
          )}
          {renderLink({ key: "signup", label: "Sign up" }, "miu-public-signup")}
          <Button
            variant="ghost"
            className="miu-public-header__toggle"
            ref={toggleRef}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenu({ open: !menuOpen, path: currentPath })}
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </Button>
        </div>
        <nav
          className="miu-public-header__quick-links"
          aria-label="Public navigation shortcuts"
        >
          {PRIMARY_LINKS.map((link) => renderLink(link))}
          {renderLink({ key: "login", label: "Log in" })}
        </nav>
        <nav
          id={panelId}
          className="miu-public-header__menu"
          aria-label="More public navigation"
          hidden={!menuOpen}
        >
          {MENU_LINKS.map((link) => renderLink(link))}
        </nav>
      </div>
    </header>
  );
}
