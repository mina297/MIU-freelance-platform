import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./dropdown.css";

export default function Dropdown({ label, children, className = "" }) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!root.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div
      ref={root}
      className={`disclosure ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
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
        onClick={() => setOpen(!open)}
      >
        {t(label)}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div
        id={id}
        className="disclosure-panel"
        hidden={!open}
        onClick={(event) => {
          if (event.target.closest("a, button")) trigger.current.focus();
        }}
      >
        {children(() => setOpen(false))}
      </div>
    </div>
  );
}
