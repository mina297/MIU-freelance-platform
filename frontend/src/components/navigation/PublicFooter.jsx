import { useLanguage } from "../../i18n/LanguageContext.js";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import PublicLink from "./PublicLink.jsx";
import { FOOTER_GROUPS, LEGAL_LINKS } from "./publicShellContent.js";
import "./public-shell.css";

export default function PublicFooter({ destinations = {}, currentPath }) {
  const { t } = useLanguage();

  return (
    <footer className="miu-public-footer">
      <div className="miu-public-footer__inner">
        <div className="miu-public-footer__main">
          <div className="miu-public-footer__brand">
            <PublicLink
              className="miu-public-footer__logo"
              href={destinations.home ?? "/"}
              aria-label={t("MIU Freelance home")}
            >
              <img
                src={miuLogo}
                alt={t("Misr International University")}
                width="400"
                height="200"
              />
            </PublicLink>
            <div>
              <p className="miu-public-footer__product">{t("MIU Freelance")}</p>
              <p className="miu-public-footer__descriptor">
                {t("Real projects. Proven student talent.")}
              </p>
            </div>
          </div>
          <div className="miu-public-footer__groups">
            {FOOTER_GROUPS.map(({ title, links }) => (
              <nav key={title} aria-label={t(title)}>
                <h2>{title}</h2>
                <ul>
                  {links.map(({ key, label }) => (
                    <li key={key}>
                      <PublicLink
                        href={destinations[key]}
                        currentPath={currentPath}
                      >
                        {t(label)}
                      </PublicLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="miu-public-footer__meta">
          <p>
            {t("© 2026 Misr International University. All rights reserved.")}
          </p>
          <nav aria-label={t("Legal information")}>
            <ul className="miu-public-footer__legal">
              {LEGAL_LINKS.map(({ key, label }) => (
                <li key={key}>
                  <PublicLink
                    href={destinations[key]}
                    currentPath={currentPath}
                  >
                    {t(label)}
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
