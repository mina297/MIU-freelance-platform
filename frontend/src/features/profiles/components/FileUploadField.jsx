import { useId, useRef, useState } from "react";
import { FileUp, ImagePlus, X } from "lucide-react";
import SafeImage from "./SafeImage.jsx";

/** Styled file picker for portfolio and support forms (simulated upload only). */
export default function FileUploadField({
  id,
  label,
  hint = "PNG, JPG, or WebP · max 2 MB",
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
  maxBytes = 2_000_000,
  imagesOnly = true,
  value = [],
  onChange,
  error,
  disabled = false,
}) {
  const inputId = useId();
  const resolvedId = id || inputId;
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  async function ingestFiles(fileList) {
    setLocalError("");
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    /** @type {typeof value} */
    const next = multiple ? [...value] : [];

    for (const file of incoming) {
      if (next.length >= maxFiles) {
        setLocalError(
          `You can attach up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`,
        );
        break;
      }
      const allowPdf = String(accept).includes("pdf");
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      if (imagesOnly && !isImage) {
        setLocalError("Choose an image file for the preview.");
        continue;
      }
      if (!imagesOnly && !isImage && !(allowPdf && isPdf)) {
        setLocalError("Attach images or PDF files only.");
        continue;
      }
      if (file.size > maxBytes) {
        setLocalError(
          `Each file must be under ${Math.round(maxBytes / 1_000_000)} MB.`,
        );
        continue;
      }

      const id = `file_${Date.now()}_${next.length}`;
      let previewUrl;
      if (file.type.startsWith("image/")) {
        try {
          previewUrl = await readAsDataUrl(file);
        } catch {
          setLocalError("Could not preview that image. Try another file.");
          continue;
        }
      }

      next.push({
        id,
        name: file.name,
        previewUrl,
        sizeLabel: formatSize(file.size),
        file,
      });
    }

    onChange(multiple ? next.slice(0, maxFiles) : next.slice(0, 1));
  }

  function onInputChange(event) {
    void ingestFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event) {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;
    void ingestFiles(event.dataTransfer.files);
  }

  const showError = error || localError;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={resolvedId}
          className="text-sm font-semibold text-miu-black"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-xs text-ink-secondary">{hint}</span>
        ) : null}
      </div>

      <div
        className={`rounded-panel border border-dashed px-4 py-6 transition ${
          dragOver
            ? "border-miu-red bg-miu-red-tint"
            : "border-border-control bg-surface-page"
        } ${disabled ? "opacity-60" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--theme-surface,#fff)] text-[var(--theme-accent,var(--color-miu-red))] shadow-sm ring-1 ring-[color:var(--theme-border,#e5e7eb)]">
            {imagesOnly ? (
              <ImagePlus className="size-6" aria-hidden="true" />
            ) : (
              <FileUp className="size-6" aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-sm font-medium text-miu-black">
              Drag and drop files here
            </p>
            <p className="mt-1 text-xs text-ink-secondary">or</p>
          </div>
          <button
            type="button"
            disabled={disabled}
            className="inline-flex h-10 items-center justify-center rounded-full border border-miu-red bg-[var(--theme-surface,#fff)] px-4 text-sm font-semibold text-[var(--theme-accent,var(--color-miu-red))] hover:bg-miu-red-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red disabled:opacity-50"
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </button>
          <input
            ref={inputRef}
            id={resolvedId}
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            disabled={disabled}
            onChange={onInputChange}
          />
        </div>
      </div>

      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {value.map((file) => (
            <li
              key={file.id}
              className="relative w-28 overflow-hidden rounded-lg border border-border-soft bg-[var(--theme-surface,#fff)]"
            >
              {file.previewUrl ? (
                <SafeImage
                  src={file.previewUrl}
                  alt=""
                  className="aspect-square w-full object-cover"
                  placeholderClassName="flex aspect-square items-center justify-center bg-surface-muted text-xs text-ink-secondary"
                  placeholderLabel="File"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-xs text-ink-secondary">
                  File
                </div>
              )}
              <p className="truncate px-2 py-1 text-[10px] text-ink-secondary">
                {file.name}
              </p>
              {file.sizeLabel ? (
                <p className="px-2 pb-1 text-[10px] text-[color:var(--theme-muted-text,#9ca3af)]">
                  {file.sizeLabel}
                </p>
              ) : null}
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="absolute right-1 top-1 rounded-full bg-[var(--theme-surface,#fff)]/95 p-1 text-miu-black shadow"
                onClick={() => onChange(value.filter((f) => f.id !== file.id))}
                disabled={disabled}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {showError ? (
        <p
          className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
          role="alert"
        >
          {showError}
        </p>
      ) : null}
    </div>
  );
}
