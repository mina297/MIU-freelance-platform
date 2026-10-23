import { useId } from "react";
import { BadgeCheck, ShieldCheck, GraduationCap } from "lucide-react";
import Badge from "../../../components/ui/Badge.jsx";
import Card from "../../../components/ui/Card.jsx";
import SectionHeading from "./SectionHeading.jsx";

const BENEFITS = [
  {
    Icon: BadgeCheck,
    title: "Verified MIU community",
    description:
      "Student and client identities are connected to the university community.",
  },
  {
    Icon: ShieldCheck,
    title: "Reputation you can trust",
    description:
      "Mutual ratings and completed-work history make good collaboration visible.",
  },
  {
    Icon: GraduationCap,
    title: "Experience that compounds",
    description:
      "Every project helps students build a portfolio, references, and career momentum.",
  },
];

export default function TrustSection() {
  const headingId = useId();
  return (
    <section
      className="m4-landing__section m4-landing__trust"
      aria-labelledby={headingId}
    >
      <div className="m4-landing__container">
        <SectionHeading
          id={headingId}
          eyebrow="Planned platform benefits"
          title="Why MIU Freelance"
          description="A focused marketplace where shared identity creates better briefs, stronger accountability, and work that matters."
        />
        <p className="m4-landing__notice">
          Planned benefits. This Phase 1 preview does not verify identities,
          calculate ratings, or provide completed-work history.
        </p>
        <div className="m4-landing__grid">
          {BENEFITS.map(({ Icon, title, description }) => (
            <Card
              as="article"
              className="m4-landing__card m4-landing__benefit"
              key={title}
            >
              <Icon size={24} aria-hidden="true" />
              <Badge>Planned</Badge>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
