import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef } from "react";
export function Panel({ title, subtitle, children }) {
  const { t } = useLanguage();
  return (
    <section className="ac-panel">
      <div className="ac-panel-heading">
        <h2>{t(title)}</h2>
        {subtitle && <p>{t(subtitle)}</p>}
      </div>
      {children}
    </section>
  );
}
export function Badge({ children }) {
  const { t } = useLanguage();
  return <span className="ac-badge">{t(children)}</span>;
}
export function AdminDialog({ title, close, children }) {
  const { t } = useLanguage();

  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="ac-dialog"
      aria-labelledby="admin-dialog-title"
      onCancel={close}
    >
      <header>
        <h2 id="admin-dialog-title">{title}</h2>
        <button onClick={close} aria-label={t("Close dialog")}>
          ×
        </button>
      </header>
      {children}
    </dialog>
  );
}
export function DataTable({ columns, rows, empty = "No matching records." }) {
  const { t } = useLanguage();

  if (!rows.length) return <p className="ac-empty">{t(empty)}</p>;
  return (
    <div
      className="ac-table-wrap"
      tabIndex={0}
      role="region"
      aria-label={t("Scrollable records")}
    >
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th scope="col" key={c.key}>
                {t(c.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
