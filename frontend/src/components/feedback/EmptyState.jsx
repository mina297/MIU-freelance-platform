import { useId } from "react";
import { SearchX } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import "../ui/states.css";

export default function EmptyState({
  title = "No items to display",
  description = "There is no content to show here yet.",
  actionLabel = "Clear filters",
  onAction,
  headingLevel = 2,
  className = "",
}) {
  const titleId = useId();
  const Heading = [2, 3, 4].includes(headingLevel) ? `h${headingLevel}` : "h2";

  return (
    <Card
      as="section"
      className={`miu-feedback-state ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <SearchX className="miu-feedback-state__icon" aria-hidden="true" />
      <Heading id={titleId}>{title}</Heading>
      {description && <p>{description}</p>}
      {typeof onAction === "function" && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
