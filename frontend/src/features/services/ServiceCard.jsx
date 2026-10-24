import { Code2, Palette, PenLine, Clock3, ArrowDownRight } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import Card from "../../components/ui/Card.jsx";

const categoryIcons = {
  web_development: Code2,
  graphic_design: Palette,
  writing: PenLine,
};

export default function ServiceCard({ service, starting, data }) {
  const category =
    data.categories.find(({ id }) => id === service.categoryId)?.label ??
    "Other services";
  const student = data.participants.students.find(
    ({ id }) => id === service.studentId,
  );
  const Icon = categoryIcons[service.categoryId] ?? Code2;
  return (
    <Card as="article" className="service-card">
      <div
        className={`service-card__art service-card__art--${service.categoryId}`}
        aria-hidden="true"
      >
        <span className="service-card__art-label">{category}</span>
        <div className="service-card__art-window">
          <span />
          <span />
          <span />
          <Icon size={48} strokeWidth={1.25} />
        </div>
        <span className="service-card__art-note">STUDENT CRAFT / MIU</span>
        <ArrowDownRight className="service-card__art-arrow" size={32} />
      </div>
      <div className="service-card__body">
        <p className="service-card__category">{category}</p>
        <h3>{service.title}</h3>
        <p className="service-card__description">{service.description}</p>
        <ul className="service-card__skills" aria-label="Service skills">
          {service.skillIds.map((id) => (
            <li key={id}>
              {data.skills.find((skill) => skill.id === id)?.label ??
                "Skill unavailable"}
            </li>
          ))}
        </ul>
        <p className="service-card__student">
          <span aria-hidden="true">
            {student?.displayName
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("") ?? "?"}
          </span>
          {student?.displayName ?? "Student information unavailable"}
        </p>
        <dl className="service-card__terms">
          <div>
            <dt>Starting at</dt>
            <dd>
              {starting ? formatEGP(starting.priceEGP) : "Price unavailable"}
            </dd>
          </div>
          <div>
            <dt>
              <Clock3 size={13} aria-hidden="true" /> Delivery estimate
            </dt>
            <dd>
              {starting ? `${starting.deliveryDays} days` : "Unavailable"}
            </dd>
          </div>
        </dl>
        <details className="service-card__package">
          <summary>Preview starting package</summary>
          {starting ? (
            <div>
              <h4>{starting.name}</h4>
              <p>{starting.description}</p>
              <ul>
                {starting.includedFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p>Estimate for this package only; extras are not included.</p>
            </div>
          ) : (
            <p>No valid package is available for this listing.</p>
          )}
        </details>
      </div>
    </Card>
  );
}
