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
  const [failed, setFailed] = useState(false);
  const usable = Boolean(src) && !failed;

  if (!usable) {
    return (
      <div
        className={
          placeholderClassName ||
          `flex items-center justify-center bg-[#f1f1f3] text-sm text-[#4b5563] ${className}`
        }
        role="img"
        aria-label={alt || placeholderLabel}
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
