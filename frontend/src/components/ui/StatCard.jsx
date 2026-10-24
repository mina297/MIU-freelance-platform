import { useId } from "react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";
import Skeleton from "./Skeleton.jsx";
import LoadingState from "../feedback/LoadingState.jsx";
import "./data-display.css";

/** A metric's value, formatting, meaning and icon are supplied by its owner. */
export default function StatCard({
  label = "Statistic",
  value,
  description,
  icon,
  state = "ready",
  loadingLabel = "Loading statistic…",
  missingLabel = "Unavailable",
  errorMessage = "This statistic is unavailable.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}) {
  const labelId = useId();
  if (!["ready", "loading", "error"].includes(state)) {
    throw new TypeError("StatCard state must be ready, loading, or error.");
  }
  const available =
    state === "ready" &&
    (Number.isFinite(value) ||
      (typeof value === "string" && value.trim() !== ""));

  return (
    <Card
      as="section"
      className={`miu-stat-card ${className}`.trim()}
      aria-labelledby={labelId}
    >
      <dl>
        <dt id={labelId} className="miu-stat-card__heading">
          <span>{label}</span>
          {Boolean(icon) && (
            <span className="miu-stat-card__icon" aria-hidden="true">
              {icon}
            </span>
          )}
        </dt>
        <dd
          className={`miu-stat-card__value${available ? "" : " miu-stat-card__value--unavailable"}`}
          aria-busy={state === "loading"}
        >
          {state === "loading" ? (
            <Skeleton lines={1} />
          ) : available ? (
            value
          ) : (
            missingLabel
          )}
        </dd>
      </dl>
      {state === "loading" && (
        <LoadingState message={loadingLabel} showSkeleton={false} />
      )}
      {state === "error" && (
        <div className="miu-stat-card__error">
          <p>{errorMessage}</p>
          {typeof onRetry === "function" && (
            <Button variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </div>
      )}
      {description && (
        <p className="miu-stat-card__description">{description}</p>
      )}
    </Card>
  );
}
