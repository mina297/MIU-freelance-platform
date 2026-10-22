import { useId } from "react";
import Card from "../../../components/ui/Card.jsx";
import PublicLink from "../../../components/navigation/PublicLink.jsx";
import SectionHeading from "./SectionHeading.jsx";

/** Minimal shared participants only; full profile content remains Member 5's work. */
export default function FeaturedStudents({
  students,
  getStudentHref,
  browseHref,
}) {
  const headingId = useId();
  return (
    <section className="m4-landing__section" aria-labelledby={headingId}>
      <div className="m4-landing__container">
        <SectionHeading
          id={headingId}
          eyebrow="Student talent"
          title="Meet student talent"
          description="Fictional student examples. Profile details and reviews are unavailable in this preview."
        >
          <PublicLink href={browseHref} className="m4-landing__action">
            Explore talent
          </PublicLink>
        </SectionHeading>
        {students.length ? (
          <div className="m4-landing__grid">
            {students.slice(0, 3).map((student) => (
              <Card
                as="article"
                key={student.id}
                className="m4-landing__card m4-landing__student"
              >
                <span className="m4-landing__initials" aria-hidden="true">
                  {student.displayName
                    .split(/\s+/)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h3>{student.displayName}</h3>
                <PublicLink
                  href={getStudentHref?.(student.id)}
                  className="m4-landing__action"
                >
                  View profile
                </PublicLink>
              </Card>
            ))}
          </div>
        ) : (
          <p className="m4-landing__empty">
            Student profiles are not available in this preview.
          </p>
        )}
      </div>
    </section>
  );
}
