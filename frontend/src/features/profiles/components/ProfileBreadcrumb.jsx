import { ArrowLeft } from "lucide-react";

/**
 * Compact breadcrumb for public profile pages (content area only).
 * @param {{ onBack?: () => void, backLabel?: string, currentLabel?: string }} props
 */
export default function ProfileBreadcrumb({
  onBack,
  backLabel = "Find Talent",
  currentLabel = "Public profile",
}) {
  const backContent = (
    <>
      <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
      <span>{backLabel}</span>
    </>
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-[13px] leading-normal"
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#4b5563] transition-colors hover:text-miu-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
        >
          {backContent}
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 text-[#4b5563]">
          {backContent}
        </span>
      )}
      <span className="text-[#8d929a]" aria-hidden="true">
        /
      </span>
      <span className="text-miu-black" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  );
}
