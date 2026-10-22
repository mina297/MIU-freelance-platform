import { useId } from "react";
import PublicLink from "../../../components/navigation/PublicLink.jsx";
import Button from "../../../components/ui/Button.jsx";
import DiscoveryCard from "./DiscoveryCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function FeaturedOpportunities({
  id,
  kind,
  items,
  browseHref,
  getItemHref,
  savedIds = [],
  onToggleSaved,
  onClear,
}) {
  const headingId = useId();
  const isProject = kind === "project";
  return (
    <section
      id={id}
      className="m4-landing__section m4-landing__opportunities"
      aria-labelledby={headingId}
    >
      <div className="m4-landing__container">
        <SectionHeading
          id={headingId}
          eyebrow={
            isProject ? "Fresh opportunities" : "Service-based freelancing"
          }
          title={isProject ? "Featured jobs" : "Discover services"}
          description={
            isProject
              ? "Fictional project briefs for this Phase 1 preview."
              : "Explore student-published services and their available EGP packages."
          }
        >
          <PublicLink href={browseHref} className="m4-landing__action">
            {isProject ? "Browse all jobs" : "Browse services"}
          </PublicLink>
        </SectionHeading>
        {items.length ? (
          <div className="m4-landing__grid">
            {items.slice(0, 3).map((item) => (
              <DiscoveryCard
                key={item.id}
                item={item}
                kind={kind}
                href={getItemHref?.(item.id)}
                saved={savedIds.includes(item.id)}
                onToggleSaved={onToggleSaved}
              />
            ))}
          </div>
        ) : (
          <div className="m4-landing__empty">
            <h3>
              {isProject ? "No matching projects" : "No matching services"}
            </h3>
            <p>Try another keyword or category.</p>
            {onClear && (
              <Button variant="outline" onClick={onClear}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
