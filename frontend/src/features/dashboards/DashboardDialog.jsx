import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef } from "react";

export default function DashboardDialog({
  title,
  children,
  close,
  className = "",
}) {
  const { t } = useLanguage();

  const ref = useRef(null);
  const opener = useRef(document.activeElement);
  useEffect(() => {
    const dialog = ref.current;
    const previous = opener.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`sd-dialog cd-dialog ${className}`}
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="client-dialog-title"
    >
      <div className="cd-dialog-heading">
        <h2 id="client-dialog-title">{title}</h2>
        <button onClick={close} aria-label={t("Close dialog")}>
          <img
            src={
              new URL("../../assets/figma/dashboard/4bf4d.svg", import.meta.url)
                .href
            }
            alt=""
          />
        </button>
      </div>
      {children}
    </dialog>
  );
}
