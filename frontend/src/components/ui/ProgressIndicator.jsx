import { useId } from "react";
import "./states.css";

/** Omit value when progress is unknown; never manufacture a percentage. */
export default function ProgressIndicator({
  label = "Progress",
  value,
  max = 100,
  id,
  className = "",
}) {
  const generatedId = useId();
  const progressId = id || generatedId;
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value)
    ? Math.min(maximum, Math.max(0, value))
    : undefined;

  return (
    <div className={`miu-progress ${className}`.trim()}>
      <div className="miu-progress__label">
        <label htmlFor={progressId}>{label}</label>
        <span aria-hidden="true">
          {current === undefined
            ? "In progress"
            : `${Math.round((current / maximum) * 100)}%`}
        </span>
      </div>
      <progress
        id={progressId}
        className="miu-progress__bar"
        max={maximum}
        value={current}
      />
    </div>
  );
}
