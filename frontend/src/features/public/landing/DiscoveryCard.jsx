import { useId } from "react";
import { Bookmark } from "lucide-react";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Card from "../../../components/ui/Card.jsx";
import PublicLink from "../../../components/navigation/PublicLink.jsx";
import { formatEGP } from "../../../utils/formatEGP.js";
import { formatDate } from "../../../utils/formatDate.js";

export default function DiscoveryCard({
  item,
  kind,
  href,
  saved = false,
  onToggleSaved,
}) {
  const headingId = useId();
  const isProject = kind === "project";
  return (
    <Card as="article" className="m4-landing__card" aria-labelledby={headingId}>
      <div className="m4-landing__card-top">
        <Badge variant="success">{isProject ? "Open" : "Published"}</Badge>
        {isProject && onToggleSaved && (
          <Button
            variant="ghost"
            className="m4-landing__save"
            aria-pressed={saved}
            aria-label={`${saved ? "Unsave" : "Save"} ${item.title}`}
            title="Saved only during this preview"
            onClick={() => onToggleSaved(item.id)}
          >
            <Bookmark
              size={20}
              fill={saved ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
      <div>
        <h3 id={headingId}>{item.title}</h3>
        {item.participantName && (
          <p className="m4-landing__participant">{item.participantName}</p>
        )}
      </div>
      <p className="m4-landing__description">{item.description}</p>
      <ul className="m4-landing__skills" aria-label="Skills">
        {item.skillLabels.map((label) => (
          <li key={label}>
            <Badge>{label}</Badge>
          </li>
        ))}
      </ul>
      <dl className="m4-landing__metadata">
        <div>
          <dt>{isProject ? "Fixed budget" : "Starting price"}</dt>
          <dd>
            {item.priceEGP === null
              ? "Price unavailable"
              : `${isProject ? "" : "From "}${formatEGP(item.priceEGP)}`}
          </dd>
        </div>
        {isProject && (
          <div>
            <dt>Deadline</dt>
            <dd>{formatDate(item.deadline)}</dd>
          </div>
        )}
        <div>
          <dt>Category</dt>
          <dd>{item.categoryLabel}</dd>
        </div>
      </dl>
      <div className="m4-landing__card-bottom">
        <p>Posted {formatDate(item.createdAt)}</p>
        <PublicLink
          href={href}
          className="m4-landing__action m4-landing__action--primary"
        >
          {isProject ? "View job" : "View service"}
        </PublicLink>
      </div>
    </Card>
  );
}
