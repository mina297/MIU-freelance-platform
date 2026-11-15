import { useEffect, useId, useRef } from "react";
import { useLanguage } from "../../../i18n/LanguageContext.js";

/** Preserve each dashboard's established status classes and label semantics. */
export function Badge({
  status,
  children,
  variant = "student",
  translate = true,
}) {
  const { t } = useLanguage();
  const label = status ?? children;
  const prefix = variant === "client" ? "cd" : "sd";
  return (
    <span
      className={
        variant === "admin"
          ? "ac-badge"
          : `sd-badge ${prefix}-${String(status).toLowerCase().replaceAll(" ", "-")}`
      }
    >
      {translate ? t(label) : label}
    </span>
  );
}

export function DashboardStat({
  label,
  value,
  caption,
  icon,
  variant = "student",
}) {
  const { t } = useLanguage();
  const admin = variant === "admin";
  const Tag = admin ? "article" : "section";
  return (
    <Tag className={admin ? "ac-panel ac-stat" : "sd-panel sd-stat"}>
      <div>
        {admin ? t(label) : <span>{t(label)}</span>}
        {icon}
      </div>
      <strong>{value}</strong>
      <small>{t(caption)}</small>
    </Tag>
  );
}

/** Native dialogs retain original styles, Escape, autofocus and focus return. */
export function DashboardDialog({
  title,
  children,
  close,
  className = "",
  variant = "client",
}) {
  const { t } = useLanguage();
  const id = useId();
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      opener?.focus();
    };
  }, []);
  const admin = variant === "admin";
  const student = variant === "student";
  return (
    <dialog
      ref={ref}
      className={`${admin ? "ac-dialog" : student ? "sd-dialog" : "sd-dialog cd-dialog"} ${className}`.trim()}
      aria-labelledby={id}
      onCancel={close}
      onClick={(event) => {
        if (!admin && event.target === event.currentTarget) close();
      }}
    >
      {student ? (
        <h2 id={id}>{title}</h2>
      ) : (
        <>
          {admin ? (
            <header>
              <h2 id={id}>{title}</h2>
              <button onClick={close} aria-label={t("Close dialog")}>
                ×
              </button>
            </header>
          ) : (
            <div className="cd-dialog-heading">
              <h2 id={id}>{title}</h2>
              <button onClick={close} aria-label={t("Close dialog")}>
                <img
                  src={
                    new URL(
                      "../../../assets/figma/dashboard/4bf4d.svg",
                      import.meta.url,
                    ).href
                  }
                  alt=""
                />
              </button>
            </div>
          )}
        </>
      )}
      {children}
    </dialog>
  );
}

export function DetailDialog({ detail, close }) {
  const { t } = useLanguage();
  return (
    <DashboardDialog title={detail.title} close={close} variant="student">
      <p>{detail.body}</p>
      <button autoFocus className="sd-button sd-primary" onClick={close}>
        {t("Close")}
      </button>
    </DashboardDialog>
  );
}
