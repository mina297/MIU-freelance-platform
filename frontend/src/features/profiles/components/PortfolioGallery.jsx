import { Pencil, Trash2 } from "lucide-react";
import { ProfileEmptyState } from "./ProfileStates.jsx";
import SafeImage from "./SafeImage.jsx";

/**
 * Public Figma-style portfolio gallery.
 * Owner-only edit/delete controls appear only when callbacks are provided.
 *
 * @param {{
 *   items: Array<object>,
 *   onSelectItem: (item: object) => void,
 *   isOwner?: boolean,
 *   onEditItem?: (item: object) => void,
 *   onDeleteItem?: (item: object) => void,
 * }} props
 */
export default function PortfolioGallery({
  items,
  onSelectItem,
  isOwner = false,
  onEditItem,
  onDeleteItem,
}) {
  const showOwnerControls =
    isOwner &&
    (typeof onEditItem === "function" || typeof onDeleteItem === "function");

  if (!items.length) {
    return (
      <ProfileEmptyState
        message={
          isOwner
            ? "You have not added portfolio pieces yet. Use Add portfolio item to create one."
            : "This student has not published portfolio work yet."
        }
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col">
          <button
            type="button"
            onClick={() => onSelectItem(item)}
            className="group flex w-full flex-col overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] text-left shadow-[var(--shadow-panel)] transition hover:border-miu-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
              <SafeImage
                key={item.imageSrc || item.id}
                src={item.imageSrc}
                alt={item.imageAlt || item.title}
                className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
                placeholderClassName="flex size-full flex-col items-center justify-center gap-1 px-4 text-center text-sm text-ink-secondary"
                placeholderLabel={`${item.category || "Portfolio"} · No preview image`}
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-accent,var(--color-miu-red))]">
                {item.monthLabel}
              </p>
              <h3 className="text-base font-semibold text-miu-black">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-sm text-ink-secondary">
                {item.summary}
              </p>
            </div>
          </button>

          {showOwnerControls ? (
            <div className="mt-2 flex gap-2">
              {typeof onEditItem === "function" ? (
                <button
                  type="button"
                  onClick={() => onEditItem(item)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-border-soft text-xs font-semibold text-miu-black hover:bg-surface-page"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
              ) : null}
              {typeof onDeleteItem === "function" ? (
                <button
                  type="button"
                  onClick={() => onDeleteItem(item)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-danger/30 text-xs font-semibold text-[var(--theme-danger-text,var(--color-danger))] hover:bg-[var(--theme-danger-surface,#fef2f2)]"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Delete
                </button>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
