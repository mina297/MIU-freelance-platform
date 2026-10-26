import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3 } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import { formatEGP } from "../../utils/formatEGP.js";

export default function FreelancerCard({ person }) {
  const { t, locale } = useLanguage();

  const initials = person.displayName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return (
    <Card as="article" className="freelancer-card">
      <div className="freelancer-card__top">
        <div className="freelancer-card__avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <p className="services-eyebrow">{t("STUDENT SERVICE PROVIDER")}</p>
          <h3>{person.displayName}</h3>
          <Link
            to={`/students/${person.id}`}
            className="text-sm text-[var(--theme-accent,var(--color-miu-red))] underline"
          >
            {t("View student profile")}
          </Link>
          <p>
            {person.services.length} {t("matching published")}{" "}
            {person.services.length === 1 ? t("service") : t("services")}
          </p>
        </div>
      </div>
      <div className="freelancer-card__skills">
        <p>{t("Skills shown in these services")}</p>
        <ul
          aria-label={t("{value0}'s published service skills", {
            value0: person.displayName,
          })}
        >
          {person.skills.map(({ id, label }) => (
            <li key={id}>{t(label)}</li>
          ))}
        </ul>
        {!person.skills.length && <p>{t("Listed skills unavailable.")}</p>}
      </div>
      <dl className="freelancer-card__price">
        <div>
          <dt>{t("Published services starting at")}</dt>
          <dd>
            {person.startingPriceEGP === null
              ? t("Price unavailable")
              : formatEGP(person.startingPriceEGP, locale)}
          </dd>
        </div>
      </dl>
      <div className="freelancer-card__services">
        <h4>
          <Layers3 size={15} aria-hidden="true" />{" "}
          {t("Explore matching services")}
        </h4>
        <ul>
          {person.services.map(({ service, package: pack }) => (
            <li key={service.id}>
              <Link to={`/services/${service.id}`}>
                <span>{service.title}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <p>
                {pack
                  ? `${formatEGP(pack.priceEGP, locale)} · ${pack.deliveryDays} days estimated`
                  : t("Starting package unavailable")}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="freelancer-card__note">
        {t(
          "Review the linked profile for declared details. Service skills are not verified qualifications, and package starting prices are not hourly rates.",
        )}
      </p>
    </Card>
  );
}
