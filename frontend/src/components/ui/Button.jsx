import "./foundation.css";

const VARIANTS = new Set([
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
]);

/** Native action button; navigation remains the consuming feature's concern. */
export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}) {
  const resolvedVariant = VARIANTS.has(variant) ? variant : "primary";
  const unavailable = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      className={`miu-button miu-button--${resolvedVariant} ${className}`.trim()}
      disabled={unavailable}
      aria-busy={loading || undefined}
      onClick={unavailable ? undefined : onClick}
    >
      {loading && <span className="miu-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
