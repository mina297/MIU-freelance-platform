import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext.js";
import Modal from "../../../components/ui/Modal.jsx";
import Button from "../../../components/ui/Button.jsx";
import PortfolioGallery from "./PortfolioGallery.jsx";
import PortfolioItemForm from "./PortfolioItemForm.jsx";
import PortfolioItemModal from "./PortfolioItemModal.jsx";
import {
  deletePortfolioItem,
  getResolvedPortfolioItems,
  upsertPortfolioItem,
} from "../utils/portfolioStorage.js";
import { ownsProfile } from "../utils/profileOwnership.js";

export default function PortfolioSection({
  studentId,
  isOwner = false,
  onPortfolioChange,
}) {
  const { t } = useLanguage();

  const auth = useContext(AuthContext);
  const session = auth?.session;
  const allowed = isOwner && ownsProfile(session, studentId, "student");
  const [items, setItems] = useState(() =>
    getResolvedPortfolioItems(studentId),
  );
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [message, setMessage] = useState("");
  const refresh = () => {
    setItems(getResolvedPortfolioItems(studentId));
    onPortfolioChange?.();
  };
  function save(item) {
    try {
      upsertPortfolioItem(studentId, item, session);
      refresh();
      setEditor(null);
      setMessage("Portfolio item saved in this browser session only.");
    } catch {
      setMessage(
        "Could not save this portfolio item. Storage may be full or unavailable. Try a smaller image or retry.",
      );
    }
  }
  function remove() {
    try {
      deletePortfolioItem(studentId, pendingDelete.id, session);
      refresh();
      setPendingDelete(null);
      setMessage("Portfolio item removed in this browser session only.");
    } catch {
      setMessage(
        "Could not remove this item. Storage is unavailable; retry when available.",
      );
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("Portfolio")}</h2>
        {allowed && (
          <Button
            onClick={() => {
              setEditor({ mode: "add", item: null });
              setMessage("");
            }}
          >
            {t("Add portfolio item")}
          </Button>
        )}
      </div>
      {message && <p role="status">{message}</p>}
      <PortfolioGallery
        items={items}
        isOwner={allowed}
        onSelectItem={setSelected}
        onEditItem={
          allowed
            ? (item) => {
                setEditor({ mode: "edit", item });
                setMessage("");
              }
            : undefined
        }
        onDeleteItem={allowed ? setPendingDelete : undefined}
      />
      <PortfolioItemModal
        open={Boolean(selected)}
        item={selected}
        onClose={() => setSelected(null)}
      />
      <Modal
        open={Boolean(allowed && editor)}
        onClose={() => setEditor(null)}
        title={t(
          editor?.mode === "edit"
            ? t("Edit portfolio item")
            : t("Add portfolio item"),
        )}
        closeOnBackdrop
      >
        {allowed && editor && (
          <>
            <PortfolioItemForm
              key={editor.item?.id ?? "new"}
              mode={editor.mode}
              initialItem={editor.item}
              studentId={studentId}
              onCancel={() => setEditor(null)}
              onSave={save}
            />
            {message && <p role="status">{message}</p>}
          </>
        )}
      </Modal>
      <Modal
        open={Boolean(allowed && pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={t("Delete portfolio item?")}
        description={t(
          "Remove “{value0}” from this profile? This is a simulated browser-session change.",
          { value0: pendingDelete?.title ?? "" },
        )}
        actions={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              {t("Cancel")}
            </Button>
            <Button onClick={remove}>{t("Delete")}</Button>
          </>
        }
      >
        {message && <p role="status">{message}</p>}
      </Modal>
    </div>
  );
}
