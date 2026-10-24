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
  const data = useServiceData(suppliedData);
  const params = useParams();
  if (state === "loading")
    return (
      <div className="services-container service-details__recovery">
        <h1>Service details</h1>
        <LoadingState message="Loading service details…" />
      </div>
    );
  if (state !== "ready")
    return (
      <div className="services-container service-details__recovery">
        <h1>Service details</h1>
        <ErrorState
          title="Service details could not be displayed"
          onRetry={onRetry}
        />
        <Link to="/services">Back to services</Link>
      </div>
    );
  const details = publicServiceDetails(serviceId ?? params.serviceId, data);
  if (!details)
    return (
      <div className="services-container service-details__recovery">
        <h1>Service unavailable</h1>
        <p>
          This listing is unavailable or is not published. Browse the catalogue
          for currently available services.
        </p>
        <Link to="/services">
          <ArrowLeft size={16} aria-hidden="true" /> Back to services
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
          <nav aria-label="Service breadcrumb">
            <Link to="/services">
              <ArrowLeft size={15} aria-hidden="true" /> All services
            </Link>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </nav>
          <div className="service-details__hero-grid">
            <div>
              <p className="services-eyebrow">
                A LITTLE CRAFT. A BIG DIFFERENCE.
              </p>
              <h1 id="service-detail-title">{service.title}</h1>
              <p className="service-details__intro">{service.description}</p>
              <ul
                className="service-details__skills"
                aria-label="Service skills"
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
              aria-label="Starting package overview"
            >
              <Layers3 size={28} aria-hidden="true" />
              <p className="services-eyebrow">START WITH A CLEAR SCOPE</p>
              <p className="service-details__amount">
                {starting ? formatEGP(starting.priceEGP) : "Price unavailable"}
              </p>
              <p>
                {starting
                  ? `${starting.deliveryDays}-day delivery estimate for ${starting.name}`
                  : "No valid package available"}
              </p>
              {starting && (
                <a href="#service-packages">
                  Compare packages <ArrowDown size={16} aria-hidden="true" />
                </a>
              )}
              <small>
                Configure a simulated order. No real payment or escrow.
              </small>
              {starting && (
                <Link to={`/services/${service.id}/order`}>
                  Configure demo order
                </Link>
              )}
            </aside>
          </div>
        </div>
      </section>
      <div className="services-container service-details__body">
        <p className="services-disclosure">
          Fictional Phase 1 service. Prices are in EGP. No order, payment,
          message or notification is created on this page.
        </p>
        <div className="service-details__overview">
          <Card
            as="section"
            className="service-details__panel"
            aria-labelledby="service-about"
          >
            <p className="services-eyebrow">THE IDEA, DEFINED</p>
            <h2 id="service-about">About this service</h2>
            <p>{service.description}</p>
            <p>
              Review the scope and deliverables of each package below. Delivery
              is an estimate, not a scheduled completion date.
            </p>
            <div className="service-details__notice">
              <strong>Portfolio examples</strong>
              <p>
                Portfolio media is not connected in this preview. No sample work
                or credentials are claimed for this student.
              </p>
            </div>
          </Card>
          <Card
            as="section"
            className="service-details__panel service-details__provider"
            aria-labelledby="service-provider"
          >
            <UserRound size={30} aria-hidden="true" />
            <p className="services-eyebrow">THE PERSON BEHIND THE CRAFT</p>
            <h2 id="service-provider">
              {student?.displayName ?? "Student information unavailable"}
            </h2>
            <p>Student service provider</p>
            <p>
              Full profile, reviews, availability and verification information
              are not connected here. No ratings or verification claims are
              inferred.
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
              <p className="services-eyebrow">CHOOSE YOUR SCOPE</p>
              <h2 id="service-packages-title">Compare the packages</h2>
            </div>
            <p>Clear deliverables. No hidden assumptions.</p>
          </div>
          <ServicePackageComparison packages={packages} />
          <p className="services-disclosure">
            Package names and amounts are fictional examples, not approved
            platform-wide package limits. Extras are not included in package
            prices.
          </p>
        </section>
        <section aria-labelledby="service-extras-title">
          <div className="service-details__section-heading">
            <div>
              <p className="services-eyebrow">ROOM FOR A LITTLE MORE</p>
              <h2 id="service-extras-title">Optional extras</h2>
            </div>
            <p>Select extras in the demo ordering form.</p>
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
                      <dt>Additional price</dt>
                      <dd>{formatEGP(extra.additionalPriceEGP)}</dd>
                    </div>
                    <div>
                      <dt>
                        <Clock3 size={13} aria-hidden="true" /> Additional time
                      </dt>
                      <dd>{extra.additionalDays} days</dd>
                    </div>
                  </dl>
                </Card>
              ))}
            </div>
          ) : (
            <div className="service-details__notice">
              No optional extras are listed for this service.
            </div>
          )}
        </section>
        <Link className="service-details__back" to="/services">
          <ArrowLeft size={16} aria-hidden="true" /> Continue exploring services
        </Link>
      </div>
    </div>
  );
}
