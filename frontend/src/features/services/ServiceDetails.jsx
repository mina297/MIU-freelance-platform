import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDown,
  Layers3,
  UserRound,
  Plus,
  Clock3,
} from "lucide-react";
import { useServiceData } from "./useServiceData.js";
import { formatEGP } from "../../utils/formatEGP.js";
import Card from "../../components/ui/Card.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import ServicePackageComparison from "./ServicePackageComparison.jsx";
import { publicServiceDetails } from "./serviceDetailsModel.js";
import "./services-catalogue.css";
import "./service-details.css";

export default function ServiceDetails({
  serviceId,
  data: suppliedData,
  state = "ready",
  onRetry,
}) {
  const { t, locale } = useLanguage();

  const data = useServiceData(suppliedData);
  const params = useParams();
  if (state === "loading")
    return (
      <div className="services-container service-details__recovery">
        <h1>{t("Service details")}</h1>
        <LoadingState message={t("Loading service details…")} />
      </div>
    );
  if (state !== "ready")
    return (
      <div className="services-container service-details__recovery">
        <h1>{t("Service details")}</h1>
        <ErrorState
          title={t("Service details could not be displayed")}
          onRetry={onRetry}
        />
        <Link to="/services">{t("Back to services")}</Link>
      </div>
    );
  const details = publicServiceDetails(serviceId ?? params.serviceId, data);
  if (!details)
    return (
      <div className="services-container service-details__recovery">
        <h1>{t("Service unavailable")}</h1>
        <p>
          {t(
            "This listing is unavailable or is not published. Browse the catalogue for currently available services.",
          )}
        </p>
        <Link to="/services">
          <ArrowLeft size={16} aria-hidden="true" /> {t("Back to services")}
        </Link>
      </div>
    );
  const { service, student, category, packages, extras } = details;
  const starting = packages[0];
  return (
    <div className="services-catalogue service-details">
      <section
        className="service-details__hero"
        aria-labelledby="service-detail-title"
      >
        <div className="services-container">
          <nav aria-label={t("Service breadcrumb")}>
            <Link to="/services">
              <ArrowLeft size={15} aria-hidden="true" /> {t("All services")}
            </Link>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </nav>
          <div className="service-details__hero-grid">
            <div>
              <p className="services-eyebrow">
                {t("A LITTLE CRAFT. A BIG DIFFERENCE.")}
              </p>
              <h1 id="service-detail-title">{service.title}</h1>
              <p className="service-details__intro">{service.description}</p>
              <ul
                className="service-details__skills"
                aria-label={t("Service skills")}
              >
                {service.skillIds.map((id) => (
                  <li key={id}>
                    {data.skills.find((skill) => skill.id === id)?.label ??
                      "Skill unavailable"}
                  </li>
                ))}
              </ul>
            </div>
            <aside
              className="service-details__summary"
              aria-label={t("Starting package overview")}
            >
              <Layers3 size={28} aria-hidden="true" />
              <p className="services-eyebrow">
                {t("START WITH A CLEAR SCOPE")}
              </p>
              <p className="service-details__amount">
                {starting
                  ? formatEGP(starting.priceEGP, locale)
                  : t("Price unavailable")}
              </p>
              <p>
                {starting
                  ? `${starting.deliveryDays}-day delivery estimate for ${starting.name}`
                  : t("No valid package available")}
              </p>
              {starting && (
                <a href="#service-packages">
                  {t("Compare packages")}{" "}
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              )}
              <small>
                {t("Configure a simulated order. No real payment or escrow.")}
              </small>
              {starting && (
                <Link to={`/services/${service.id}/order`}>
                  {t("Configure demo order")}
                </Link>
              )}
            </aside>
          </div>
        </div>
      </section>
      <div className="services-container service-details__body">
        <p className="services-disclosure">
          {t(
            "Fictional Phase 1 service. Prices are in EGP. No order, payment, message or notification is created on this page.",
          )}
        </p>
        <div className="service-details__overview">
          <Card
            as="section"
            className="service-details__panel"
            aria-labelledby="service-about"
          >
            <p className="services-eyebrow">{t("THE IDEA, DEFINED")}</p>
            <h2 id="service-about">{t("About this service")}</h2>
            <p>{service.description}</p>
            <p>
              {t(
                "Review the scope and deliverables of each package below. Delivery is an estimate, not a scheduled completion date.",
              )}
            </p>
            <div className="service-details__notice">
              <strong>{t("Portfolio examples")}</strong>
              <p>
                {t(
                  "Portfolio media is not connected in this preview. No sample work or credentials are claimed for this student.",
                )}
              </p>
            </div>
          </Card>
          <Card
            as="section"
            className="service-details__panel service-details__provider"
            aria-labelledby="service-provider"
          >
            <UserRound size={30} aria-hidden="true" />
            <p className="services-eyebrow">
              {t("THE PERSON BEHIND THE CRAFT")}
            </p>
            <h2 id="service-provider">
              {student?.displayName ?? "Student information unavailable"}
            </h2>
            <p>{t("Student service provider")}</p>
            {student && (
              <Link
                to={`/students/${student.id}`}
                className="text-[var(--theme-accent,var(--color-miu-red))] underline"
              >
                {t("View student profile")}
              </Link>
            )}
            <p>
              {t(
                "Open the profile for declared details and demo reviews. Service tags do not certify qualifications, verification or availability.",
              )}
            </p>
          </Card>
        </div>
        <section
          id="service-packages"
          className="service-details__packages"
          aria-labelledby="service-packages-title"
        >
          <div className="service-details__section-heading">
            <div>
              <p className="services-eyebrow">{t("CHOOSE YOUR SCOPE")}</p>
              <h2 id="service-packages-title">{t("Compare the packages")}</h2>
            </div>
            <p>{t("Clear deliverables. No hidden assumptions.")}</p>
          </div>
          <ServicePackageComparison packages={packages} />
          <p className="services-disclosure">
            {t(
              "Package names and amounts are fictional examples, not approved platform-wide package limits. Extras are not included in package prices.",
            )}
          </p>
        </section>
        <section aria-labelledby="service-extras-title">
          <div className="service-details__section-heading">
            <div>
              <p className="services-eyebrow">{t("ROOM FOR A LITTLE MORE")}</p>
              <h2 id="service-extras-title">{t("Optional extras")}</h2>
            </div>
            <p>{t("Select extras in the demo ordering form.")}</p>
          </div>
          {extras.length ? (
            <div className="service-details__extras">
              {extras.map((extra) => (
                <Card
                  as="article"
                  className="service-details__panel"
                  key={extra.id}
                >
                  <Plus size={20} aria-hidden="true" />
                  <h3>{extra.title}</h3>
                  <p>{extra.description}</p>
                  <dl>
                    <div>
                      <dt>{t("Additional price")}</dt>
                      <dd>{formatEGP(extra.additionalPriceEGP, locale)}</dd>
                    </div>
                    <div>
                      <dt>
                        <Clock3 size={13} aria-hidden="true" />{" "}
                        {t("Additional time")}
                      </dt>
                      <dd>
                        {extra.additionalDays} {t("days")}
                      </dd>
                    </div>
                  </dl>
                </Card>
              ))}
            </div>
          ) : (
            <div className="service-details__notice">
              {t("No optional extras are listed for this service.")}
            </div>
          )}
        </section>
        <Link className="service-details__back" to="/services">
          <ArrowLeft size={16} aria-hidden="true" />{" "}
          {t("Continue exploring services")}
        </Link>
      </div>
    </div>
  );
}
