import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./dropdown.css";

export default function Dropdown({ label, children, className = "" }) {
  const { t } = useLanguage();

  const [openedBy, setOpenedBy] = useState(null);
  const open = openedBy !== null;
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);

  const close = () => setOpenedBy(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!root.current.contains(event.target)) setOpenedBy(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div
      ref={root}
      className={`disclosure ${className}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        setOpenedBy((current) => current ?? "hover");
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (panel.current?.contains(document.activeElement)) {
          trigger.current.focus({ preventScroll: true });
        }
        close();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
          trigger.current.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="disclosure-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={(event) => {
          if (openedBy === "click" || (open && event.detail === 0)) close();
          else setOpenedBy("click");
        }}
      >
        {t(label)}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div
        ref={panel}
        id={id}
        className="disclosure-panel"
        hidden={!open}
        onClick={(event) => {
          if (event.target.closest("a, button")) trigger.current.focus();
        }}
      >
        {children(close)}
      </div>
    </div>
  );
}
