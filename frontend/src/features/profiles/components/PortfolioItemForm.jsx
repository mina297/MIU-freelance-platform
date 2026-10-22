import { useState } from "react";
import { validatePortfolioItem } from "../utils/validatePortfolioItem.js";
import FileUploadField from "./FileUploadField.jsx";

const CATEGORY_OPTIONS = [
  "Branding",
  "Digital Design",
  "Illustration",
  "Packaging",
  "Web Development",
  "UI Design",
  "Other",
];

function emptyForm() {
  return {
    title: "",
    category: "Web Development",
    monthLabel: "",
    summary: "",
    description: "",
    toolsText: "",
    imageSrc: "",
    imageAlt: "",
  };
}

function itemToForm(item) {
  return {
    title: item.title ?? "",
    category: item.category ?? "Other",
    monthLabel: item.monthLabel ?? "",
    summary: item.summary ?? "",
    description: item.description ?? "",
    toolsText: Array.isArray(item.tools) ? item.tools.join(", ") : "",
    imageSrc: item.imageSrc ?? "",
    imageAlt: item.imageAlt ?? "",
  };
}

/**
 * Add / edit portfolio item form (owner-only simulated workflow).
 * Remount with a React `key` when switching add/edit targets.
 *
 * @param {{
 *   mode: 'add' | 'edit',
 *   initialItem?: object | null,
 *   studentId: string,
 *   onCancel: () => void,
 *   onSave: (item: object) => void,
 * }} props
 */
export default function PortfolioItemForm({
  mode,
  initialItem = null,
  studentId,
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState(() =>
    mode === "edit" && initialItem ? itemToForm(initialItem) : emptyForm(),
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const uploadValue = form.imageSrc
    ? [
        {
          id: "current-preview",
          name: form.imageAlt || "Current portfolio image",
          previewUrl: form.imageSrc,
        },
      ]
    : [];

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validatePortfolioItem(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("saving");
    window.setTimeout(() => {
      const tools = form.toolsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const now = new Date();
      const fallbackMonth = now
        .toLocaleString("en-US", { month: "short", year: "numeric" })
        .toUpperCase();

      const item = {
        id:
          mode === "edit" && initialItem?.id
            ? initialItem.id
            : `portfolio_sim_${studentId}_${Date.now()}`,
        studentId,
        title: form.title.trim(),
        category: form.category.trim(),
        completedAt:
          mode === "edit" && initialItem?.completedAt
            ? initialItem.completedAt
            : now.toISOString().slice(0, 10),
        monthLabel: form.monthLabel.trim() || fallbackMonth,
        summary: form.summary.trim(),
        description: form.description.trim() || form.summary.trim(),
        tools,
        imageSrc: form.imageSrc || null,
        imageCleared: !form.imageSrc,
        imageAlt:
          form.imageAlt.trim() || `Preview for ${form.title.trim()}`,
        simulated: true,
      };
      onSave(item);
      setStatus("idle");
    }, 250);
  }

  return (
    <form
      className="space-y-4 rounded-[10px] border border-[#e5e7eb] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)]"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
          Simulated Phase 1 workflow
        </p>
        <h3 className="mt-1 text-lg font-semibold text-miu-black">
          {mode === "edit" ? "Edit portfolio item" : "Add portfolio item"}
        </h3>
        <p className="mt-1 text-sm text-[#4b5563]">
          Changes save to this browser session for{" "}
          <span className="font-medium text-miu-black">{studentId}</span> only.
        </p>
      </div>

      <Field
        id="pf-title"
        label="Title"
        value={form.title}
        error={errors.title}
        onChange={(v) => update("title", v)}
      />

      <div className="space-y-2">
        <label htmlFor="pf-category" className="text-sm font-semibold text-miu-black">
          Category
        </label>
        <select
          id="pf-category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="h-11 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.category ? (
          <p className="text-sm text-danger" role="alert">
            {errors.category}
          </p>
        ) : null}
      </div>

      <Field
        id="pf-month"
        label="Month label (optional)"
        value={form.monthLabel}
        error={errors.monthLabel}
        onChange={(v) => update("monthLabel", v)}
        placeholder="e.g. OCT 2026"
      />

      <TextArea
        id="pf-summary"
        label="Summary"
        value={form.summary}
        error={errors.summary}
        onChange={(v) => update("summary", v)}
        rows={3}
      />

      <TextArea
        id="pf-description"
        label="Longer description (optional)"
        value={form.description}
        onChange={(v) => update("description", v)}
        rows={4}
      />

      <Field
        id="pf-tools"
        label="Tools (comma-separated, optional)"
        value={form.toolsText}
        onChange={(v) => update("toolsText", v)}
      />

      <FileUploadField
        label="Portfolio image (optional)"
        hint="PNG, JPG, WebP, or SVG · max 2 MB · simulated preview only"
        accept="image/*"
        maxFiles={1}
        maxBytes={2_000_000}
        imagesOnly
        value={uploadValue}
        error={errors.imageSrc}
        onChange={(files) => {
          const next = files[0];
          if (!next) {
            update("imageSrc", "");
            return;
          }
          update("imageSrc", next.previewUrl || "");
          if (!form.imageAlt.trim()) {
            update("imageAlt", form.title.trim() || next.name || "Portfolio preview");
          }
          setErrors((prev) => {
            const copy = { ...prev };
            delete copy.imageSrc;
            return copy;
          });
        }}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-full border border-[#e5e7eb] px-5 text-sm font-semibold"
          disabled={status === "saving"}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-11 rounded-full bg-miu-red px-5 text-sm font-semibold text-white hover:bg-miu-red-dark disabled:opacity-60"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Save item"}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, value, onChange, error, placeholder }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-miu-black">
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm"
      />
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({ id, label, value, onChange, error, rows = 3 }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-miu-black">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
      />
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
