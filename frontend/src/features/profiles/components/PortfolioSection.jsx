import { useEffect, useRef, useState } from "react";
import PortfolioGallery from "./PortfolioGallery.jsx";
import PortfolioItemForm from "./PortfolioItemForm.jsx";
import PortfolioItemModal from "./PortfolioItemModal.jsx";
import {
  deletePortfolioItem,
  getResolvedPortfolioItems,
  upsertPortfolioItem,
} from "../utils/portfolioStorage.js";

/**
 * Portfolio tab: public gallery for visitors; owner management controls for owners.
 * Add/Edit opens an accessible modal so the form is always visible.
 *
 * @param {{
 *   studentId: string,
 *   items?: object[],
 *   isOwner?: boolean,
 *   onPortfolioChange?: () => void,
 * }} props
 */
export default function PortfolioSection({
  studentId,
  isOwner = false,
  onPortfolioChange,
}) {
  const [items, setItems] = useState(() => getResolvedPortfolioItems(studentId));
  const [selected, setSelected] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const formDialogRef = useRef(null);

  useEffect(() => {
    if (!formMode) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      formDialogRef.current?.querySelector("input,textarea,select,button")?.focus();
    }, 50);
    const onKey = (event) => {
      if (event.key === "Escape") {
        setFormMode(null);
        setEditingItem(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [formMode, editingItem]);

  function refreshFromStorage() {
    const next = getResolvedPortfolioItems(studentId);
    setItems(next);
    onPortfolioChange?.();
  }

  function openAdd() {
    setFormMode("add");
    setEditingItem(null);
    setStatusMessage("");
  }

  function openEdit(item) {
    setFormMode("edit");
    setEditingItem(item);
    setStatusMessage("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingItem(null);
  }

  function handleSaveItem(item) {
    upsertPortfolioItem(studentId, item);
    refreshFromStorage();
    closeForm();
    setStatusMessage(
      `Saved “${item.title}” for ${studentId} (session only — Phase 1 simulation).`,
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deletePortfolioItem(studentId, pendingDelete.id);
    refreshFromStorage();
    setStatusMessage(`Deleted “${pendingDelete.title}” from ${studentId}.`);
    setPendingDelete(null);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-miu-black">Portfolio</h2>
          <p className="mt-1 text-sm text-[#4b5563]">
            Selected work from campus and alumni collaborations.
          </p>
        </div>
        {isOwner ? (
          <button
            type="button"
            onClick={openAdd}
            className="h-10 rounded-full bg-miu-red px-4 text-sm font-semibold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            Add portfolio item
          </button>
        ) : null}
      </div>

      {isOwner ? (
        <p className="rounded-lg bg-miu-red-tint px-4 py-2 text-sm text-miu-black">
          Owner view — add, edit, or delete portfolio items. Visitors only see
          the public gallery. Saves are simulated in sessionStorage for{" "}
          <span className="font-medium">{studentId}</span>.
        </p>
      ) : null}

      {statusMessage ? (
        <p className="text-sm text-success" role="status">
          {statusMessage}
        </p>
      ) : null}

      <PortfolioGallery
        items={items}
        isOwner={isOwner}
        onSelectItem={setSelected}
        onEditItem={isOwner ? openEdit : undefined}
        onDeleteItem={
          isOwner
            ? (item) => {
                setPendingDelete(item);
              }
            : undefined
        }
      />

      <PortfolioItemModal
        open={Boolean(selected)}
        item={selected}
        onClose={() => setSelected(null)}
      />

      {isOwner && formMode ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="presentation"
          onClick={closeForm}
        >
          <div
            ref={formDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-form-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[12px] bg-[#f8f8f9] p-1 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="portfolio-form-title" className="sr-only">
              {formMode === "edit" ? "Edit portfolio item" : "Add portfolio item"}
            </h2>
            <PortfolioItemForm
              key={
                formMode === "edit" && editingItem
                  ? `edit-${editingItem.id}`
                  : `add-${studentId}`
              }
              mode={formMode}
              initialItem={editingItem}
              studentId={studentId}
              onCancel={closeForm}
              onSave={handleSaveItem}
            />
          </div>
        </div>
      ) : null}

      {isOwner && pendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => setPendingDelete(null)}
        >
          <div
            role="alertdialog"
            aria-labelledby="delete-portfolio-title"
            aria-describedby="delete-portfolio-desc"
            className="w-full max-w-md rounded-[12px] bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-portfolio-title"
              className="text-lg font-semibold text-miu-black"
            >
              Delete portfolio item?
            </h3>
            <p id="delete-portfolio-desc" className="mt-2 text-sm text-[#4b5563]">
              Remove “{pendingDelete.title}” from this profile? This simulated
              delete only affects {studentId} in this browser session.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="h-10 rounded-full border border-[#e5e7eb] px-4 text-sm font-semibold"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-10 rounded-full bg-danger px-4 text-sm font-semibold text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
