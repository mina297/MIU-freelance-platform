import { useId } from "react";
import { CircleAlert } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import "../ui/states.css";

/** Presentation only: recovery, error handling and focus belong to the caller. */
export default function ErrorState({
  title = "Content could not be loaded",
  description = "Please try again.",
  onRetry,
  retryLabel = "Try again",
  retrying = false,
  announce = false,
  headingLevel = 2,
  className = "",
}) {
  const titleId = useId();
  const Heading = [2, 3, 4].includes(headingLevel) ? `h${headingLevel}` : "h2";

  return (
    <Card
      as="section"
      className={`miu-feedback-state miu-feedback-state--error ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <CircleAlert className="miu-feedback-state__icon" aria-hidden="true" />
      <div
        role={announce ? "alert" : undefined}
        aria-atomic={announce || undefined}
      >
        <Heading id={titleId}>{title}</Heading>
        {description && <p>{description}</p>}
      </div>
      {typeof onRetry === "function" && (
        <Button onClick={onRetry} loading={retrying}>
          {retryLabel}
        </Button>
      )}
    </Card>
  );
}
