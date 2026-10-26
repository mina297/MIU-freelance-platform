import { useLanguage } from "../../i18n/LanguageContext.js";
import LocalizedText from "../../i18n/LocalizedText.jsx";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import closeIcon from "../../assets/figma/modal-close.svg";
import "./toast.css";

const VARIANTS = {
  info: { badge: "info", label: "Information" },
  success: { badge: "success", label: "Success" },
  warning: { badge: "warning", label: "Warning" },
  error: { badge: "danger", label: "Error" },
  loading: { badge: "neutral", label: "Loading" },
};

/** Feedback presentation only; lifetime, delivery and recovery stay caller-owned. */
export default function Toast({
  message,
  description,
  variant = "info",
  statusLabel,
  announcement = "polite",
  onDismiss,
  dismissLabel = "Dismiss notification",
  className = "",
}) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Toast requires a nonempty message string.");
  }
  if (description != null && typeof description !== "string") {
    throw new Error("Toast description must be a string when supplied.");
  }
  if (
    statusLabel != null &&
    (typeof statusLabel !== "string" || !statusLabel.trim())
  ) {
    throw new Error(
      "Toast statusLabel must be a nonempty string when supplied.",
    );
  }
  const dismissible = typeof onDismiss === "function";
  if (
    dismissible &&
    (typeof dismissLabel !== "string" || !dismissLabel.trim())
  ) {
    throw new Error("Toast dismissal requires a nonempty dismissLabel string.");
  }
  const resolvedVariant = Object.hasOwn(VARIANTS, variant) ? variant : "info";
  const presentation = VARIANTS[resolvedVariant];
  const live = ["polite", "assertive", "off"].includes(announcement)
    ? announcement
    : "polite";

  return (
    <Card
      className={`miu-toast miu-toast--${resolvedVariant} ${className}`.trim()}
    >
      <div
        className="miu-toast__content"
        role={
          live === "off" ? undefined : live === "assertive" ? "alert" : "status"
        }
        aria-live={live === "off" ? undefined : live}
        aria-atomic={live === "off" ? undefined : true}
      >
        <div className="miu-toast__status">
          {resolvedVariant === "loading" && <LoadingSpinner decorative />}
          <Badge variant={presentation.badge}>
            <LocalizedText>{statusLabel ?? presentation.label}</LocalizedText>
          </Badge>
        </div>
        <p className="miu-toast__message">
          <LocalizedText>{message}</LocalizedText>
        </p>
        {description?.trim() && (
          <p className="miu-toast__description">
            <LocalizedText>{description}</LocalizedText>
          </p>
        )}
      </div>
      {dismissible && (
        <DismissButton
          variant="ghost"
          className="miu-toast__dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <img src={closeIcon} alt="" aria-hidden="true" />
        </DismissButton>
      )}
    </Card>
  );
}

function DismissButton({ "aria-label": label, ...props }) {
  const { t } = useLanguage();
  return <Button {...props} aria-label={t(label)} />;
}
