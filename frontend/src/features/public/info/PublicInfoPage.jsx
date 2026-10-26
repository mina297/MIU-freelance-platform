import { useLanguage } from "../../../i18n/LanguageContext.js";
import Badge from "../../../components/ui/Badge.jsx";
import PublicLink from "../../../components/navigation/PublicLink.jsx";
import "./public-info.css";

/** Content only: Member 1 supplies PublicLayout, destinations and route registration. */
export default function PublicInfoPage({
  title,
  introduction,
  children,
  overview = null,
  links,
}) {
  const { t } = useLanguage();

  return (
    <div className="m4-public-info">
      <div className="m4-public-info__header">
        <div className="m4-public-info__container m4-public-info__intro">
          <Badge>{t("Phase 1 preview")}</Badge>
          <h1>{title}</h1>
          <p>{introduction}</p>
          <p className="m4-public-info__notice">
            {t(
              "This project is in Phase 1. These pages explain planned workflows. Any authentication, verification, AI, payment or escrow demonstration is simulated; no real payments are processed.",
            )}
          </p>
        </div>
      </div>
      {overview}
      <div className="m4-public-info__container m4-public-info__body">
        <div className="m4-public-info__grid">{children}</div>
        <nav
          aria-label={t("Explore MIU Freelance")}
          className="m4-public-info__links"
        >
          {links.map(({ key, label, href }) => (
            <PublicLink key={key} href={href}>
              {t(label)}
            </PublicLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
