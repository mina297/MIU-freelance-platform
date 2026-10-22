import "./foundation.css";

const VARIANTS = new Set([
  "neutral",
  "success",
  "info",
  "completed",
  "warning",
  "danger",
]);

/** A visible label with an explicit presentation variant, not a workflow rule. */
export default function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}) {
  const resolvedVariant = VARIANTS.has(variant) ? variant : "neutral";

  return (
    <span
      {...props}
      className={`miu-badge miu-badge--${resolvedVariant} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
