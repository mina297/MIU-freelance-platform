import "./states.css";

/** Use decorative inside a parent that already announces loading. */
export default function LoadingSpinner({
  label = "Loading",
  decorative = false,
  className = "",
}) {
  return (
    <span
      className={`miu-spinner ${className}`.trim()}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative || undefined}
    >
      <span className="miu-spinner__artwork" aria-hidden="true" />
      {!decorative && <span className="miu-state-sr-only">{label}</span>}
    </span>
  );
}
