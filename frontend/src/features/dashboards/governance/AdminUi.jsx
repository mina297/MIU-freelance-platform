import { useLanguage } from "../../../i18n/LanguageContext.js";
import {
  DashboardDialog,
  Badge as DashboardBadge,
} from "../shared/DashboardUi.jsx";
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
  return <DashboardBadge variant="admin">{children}</DashboardBadge>;
}
export function AdminDialog(props) {
  return <DashboardDialog {...props} variant="admin" />;
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
