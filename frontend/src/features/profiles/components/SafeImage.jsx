import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useState } from "react";

/** Image with a simple placeholder when the source is missing or fails. */
export default function SafeImage({
  src,
  alt = "",
  className = "",
  placeholderClassName = "",
  placeholderLabel = "No preview",
  width,
  height,
}) {
  const { t } = useLanguage();

  const [failed, setFailed] = useState(false);
  const usable = Boolean(src) && !failed;

  if (!usable) {
    return (
      <div
        className={
          placeholderClassName ||
          `flex items-center justify-center bg-surface-muted text-sm text-ink-secondary ${className}`
        }
        role="img"
        aria-label={
          alt?.startsWith("Placeholder for ")
            ? t("Placeholder for {name}", { name: alt.slice(16) })
            : alt || t(placeholderLabel)
        }
      >
        {placeholderLabel}
      </div>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
