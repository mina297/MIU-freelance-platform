import { useEffect } from "react";
import { X } from "lucide-react";
import SafeImage from "./SafeImage.jsx";

/**
 * @param {{
 *   item: {
 *     id: string,
 *     title: string,
 *     category: string,
 *     monthLabel: string,
 *     summary: string,
 *     description?: string,
 *     tools?: string[],
 *     imageSrc?: string | null,
 *     imageAlt?: string,
 *   } | null,
 *   open: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function PortfolioItemModal({ item, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`portfolio-modal-${item.id}`}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[12px] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full bg-[#f1f1f3]">
          <SafeImage
            src={item.imageSrc}
            alt={item.imageAlt || item.title}
            className="size-full object-cover"
            placeholderClassName="flex size-full items-center justify-center text-sm text-[#4b5563]"
            placeholderLabel="No preview image"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-white/95 text-miu-black shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            aria-label="Close portfolio item"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
            {item.category} · {item.monthLabel}
          </p>
          <h2
            id={`portfolio-modal-${item.id}`}
            className="text-2xl font-semibold text-miu-black"
          >
            {item.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-[#4b5563]">
            {item.description || item.summary}
          </p>
          {item.tools?.length ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {item.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full bg-[#f1f1f3] px-3 py-1 text-xs font-medium text-miu-black"
                >
                  {tool}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
