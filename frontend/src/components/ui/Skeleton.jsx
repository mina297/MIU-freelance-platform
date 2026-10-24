import "./states.css";

/** Decorative placeholder only; announce loading once in the containing state. */
export default function Skeleton({
  lines = 3,
  variant = "text",
  className = "",
}) {
  const count = Number.isFinite(lines)
    ? Math.min(10, Math.max(1, Math.floor(lines)))
    : 3;
  const shape = ["text", "circle", "rectangle"].includes(variant)
    ? variant
    : "text";

  return (
    <span
      className={`miu-skeleton miu-skeleton--${shape} ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: shape === "text" ? count : 1 }, (_, index) => (
        <span key={index} className="miu-skeleton__block" />
      ))}
    </span>
  );
}
