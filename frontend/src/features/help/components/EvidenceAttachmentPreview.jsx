import { X } from "lucide-react";

/** Evidence file chips. Pass onRemove only when the user can delete files. */
export default function EvidenceAttachmentPreview({ files = [], onRemove }) {
  if (!files.length) return null;

  const editable = typeof onRemove === "function";

  return (
    <ul className="flex flex-wrap gap-3">
      {files.map((file) => (
        <li
          key={file.id}
          className="relative w-28 overflow-hidden rounded-lg border border-border-soft bg-surface-page"
        >
          {file.previewUrl ? (
            <img
              src={file.previewUrl}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center px-1 text-center text-xs text-ink-secondary">
              File
            </div>
          )}
          <div className="truncate px-2 py-1 text-[10px] text-ink-secondary">
            {file.name}
          </div>
          {file.sizeLabel ? (
            <p className="px-2 pb-1 text-[10px] text-[color:var(--theme-muted-text,#9ca3af)]">
              {file.sizeLabel}
            </p>
          ) : null}
          {editable ? (
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              className="absolute right-1 top-1 rounded-full bg-[var(--theme-surface,#fff)]/95 p-1 text-miu-black shadow"
              onClick={() => onRemove(file.id)}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
