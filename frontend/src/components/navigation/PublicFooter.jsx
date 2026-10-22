import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import PublicLink from "./PublicLink.jsx";
import { FOOTER_GROUPS, LEGAL_LINKS } from "./publicShellContent.js";
import "./public-shell.css";

export default function PublicFooter({ destinations = {}, currentPath }) {
  return (
    <footer className="miu-public-footer">
      <div className="miu-public-footer__inner">
        <div className="miu-public-footer__main">
          <div className="miu-public-footer__brand">
            <a
              className="miu-public-footer__logo"
              href={destinations.home ?? "/"}
              aria-label="MIU Freelance home"
            >
              <img
                src={miuLogo}
                alt="Misr International University"
                width="400"
                height="200"
              />
            </a>
            <div>
              <p className="miu-public-footer__product">MIU Freelance</p>
              <p className="miu-public-footer__descriptor">
                Real projects. Proven student talent.
              </p>
            </div>
          </div>
          <div className="miu-public-footer__groups">
            {FOOTER_GROUPS.map(({ title, links }) => (
              <nav key={title} aria-label={title}>
                <h2>{title}</h2>
                <ul>
                  {links.map(({ key, label }) => (
                    <li key={key}>
                      <PublicLink
                        href={destinations[key]}
                        currentPath={currentPath}
                      >
                        {label}
                      </PublicLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="miu-public-footer__meta">
          <p>© 2026 Misr International University. All rights reserved.</p>
          <nav aria-label="Legal information">
            <ul className="miu-public-footer__legal">
              {LEGAL_LINKS.map(({ key, label }) => (
                <li key={key}>
                  <PublicLink
                    href={destinations[key]}
                    currentPath={currentPath}
                  >
                    {label}
                  </PublicLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
