import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3 } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import { formatEGP } from "../../utils/formatEGP.js";

export default function FreelancerCard({ person }) {
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
          <p className="services-eyebrow">STUDENT SERVICE PROVIDER</p>
          <h3>{person.displayName}</h3>
          <Link
            to={`/students/${person.id}`}
            className="text-sm text-miu-red underline"
          >
            View student profile
          </Link>
          <p>
            {person.services.length} matching published{" "}
            {person.services.length === 1 ? "service" : "services"}
          </p>
        </div>
      </div>
      <div className="freelancer-card__skills">
        <p>Skills shown in these services</p>
        <ul aria-label={`${person.displayName}'s published service skills`}>
          {person.skills.map(({ id, label }) => (
            <li key={id}>{label}</li>
          ))}
        </ul>
        {!person.skills.length && <p>Listed skills unavailable.</p>}
      </div>
      <dl className="freelancer-card__price">
        <div>
          <dt>Published services starting at</dt>
          <dd>
            {person.startingPriceEGP === null
              ? "Price unavailable"
              : formatEGP(person.startingPriceEGP)}
          </dd>
        </div>
      </dl>
      <div className="freelancer-card__services">
        <h4>
          <Layers3 size={15} aria-hidden="true" /> Explore matching services
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
                  ? `${formatEGP(pack.priceEGP)} · ${pack.deliveryDays} days estimated`
                  : "Starting package unavailable"}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="freelancer-card__note">
        Review the linked profile for declared details. Service skills are not
        verified qualifications, and package starting prices are not hourly
        rates.
      </p>
    </Card>
  );
}
