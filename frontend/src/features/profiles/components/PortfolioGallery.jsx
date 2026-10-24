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
            className="group flex w-full flex-col overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white text-left shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] transition hover:border-miu-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#f1f1f3]">
              <SafeImage
                key={item.imageSrc || item.id}
                src={item.imageSrc}
                alt={item.imageAlt || item.title}
                className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
                placeholderClassName="flex size-full flex-col items-center justify-center gap-1 px-4 text-center text-sm text-[#4b5563]"
                placeholderLabel={`${item.category || "Portfolio"} · No preview image`}
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-miu-red">
                {item.monthLabel}
              </p>
              <h3 className="text-base font-semibold text-miu-black">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-sm text-[#4b5563]">
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
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#e5e7eb] text-xs font-semibold text-miu-black hover:bg-[#f8f8f9]"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
              ) : null}
              {typeof onDeleteItem === "function" ? (
                <button
                  type="button"
                  onClick={() => onDeleteItem(item)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-danger/30 text-xs font-semibold text-danger hover:bg-red-50"
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
