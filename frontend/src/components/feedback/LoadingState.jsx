import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import Skeleton from "../ui/Skeleton.jsx";
import "../ui/states.css";

/** Keep the live message outside the consumer's aria-busy content container. */
export default function LoadingState({
  message = "Loading content…",
  showSkeleton = true,
  className = "",
}) {
  return (
    <div className={`miu-loading-state ${className}`.trim()}>
      <p
        className="miu-loading-state__message"
        role="status"
        aria-atomic="true"
      >
        <LoadingSpinner decorative />
        <span>{message}</span>
      </p>
      {showSkeleton && <Skeleton />}
    </div>
  );
}
