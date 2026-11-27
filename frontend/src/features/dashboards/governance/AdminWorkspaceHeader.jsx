import { useEffect, useId, useRef, useState } from "react";
import { Bell, Search, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.js";
import LanguageControl from "../../../i18n/LanguageControl.jsx";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";

export default function AdminWorkspaceHeader({
  alerts,
  onAlertSelect,
  onSearchChange,
  onSearchSelect,
  onShowOverview,
  searchResults,
  searchValue,
}) {
  const { t } = useLanguage();
  const [openPanel, setOpenPanel] = useState(null);
  const [readAlerts, setReadAlerts] = useState([]);
  const searchId = useId();
  const toolsRef = useRef(null);
  const unreadCount = alerts.filter(
    (alert) => !readAlerts.includes(alert.id),
  ).length;

  useEffect(() => {
    function closeOutside(event) {
      if (!toolsRef.current?.contains(event.target)) setOpenPanel(null);
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") setOpenPanel(null);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function chooseAlert(alert) {
    setReadAlerts((current) =>
      current.includes(alert.id) ? current : [...current, alert.id],
    );
    setOpenPanel(null);
    onAlertSelect(alert);
  }

  return (
    <div className="ac-header-tools" ref={toolsRef}>
      <div className="ac-global-search">
        <label className="sr-only" htmlFor={searchId}>
          {t("Search users, jobs, and audit logs")}
        </label>
        <Search size={17} aria-hidden="true" />
        <input
          id={searchId}
          type="search"
          value={searchValue}
          placeholder={t("Search users, jobs, and audit logs")}
          autoComplete="off"
          aria-controls={`${searchId}-results`}
          aria-expanded={openPanel === "search" && searchResults.length > 0}
          onFocus={() => setOpenPanel("search")}
          onChange={(event) => {
            onSearchChange(event.target.value);
            setOpenPanel("search");
          }}
        />
        {openPanel === "search" && searchResults.length > 0 && (
          <div
            id={`${searchId}-results`}
            className="ac-search-results"
            role="region"
            aria-label={t("Search results")}
          >
            {searchResults.map((result) => (
              <button
                type="button"
                key={`${result.kind}:${result.id}`}
                onClick={() => {
                  setOpenPanel(null);
                  onSearchSelect(result);
                }}
              >
                <span>{result.title}</span>
                <small>
                  {t(
                    result.kind === "user"
                      ? "User"
                      : result.kind === "audit"
                        ? "Audit log"
                        : "Job or service",
                  )}
                  {" · "}
                  {result.detail}
                </small>
              </button>
            ))}
          </div>
        )}
      </div>

      <LanguageControl />
      <ThemeToggle />

      <div className="ac-header-menu">
        <button
          type="button"
          className="ac-header-icon"
          aria-label={t("Notifications ({value0} unread)", {
            value0: unreadCount,
          })}
          aria-expanded={openPanel === "notifications"}
          aria-controls={`${searchId}-notifications`}
          onClick={() =>
            setOpenPanel((current) =>
              current === "notifications" ? null : "notifications",
            )
          }
        >
          <Bell size={19} aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="ac-unread-count" aria-hidden="true">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        {openPanel === "notifications" && (
          <section
            id={`${searchId}-notifications`}
            className="ac-header-popover ac-notifications-popover"
            aria-label={t("Recent admin alerts")}
          >
            <div className="ac-popover-heading">
              <div>
                <h2>{t("Recent admin alerts")}</h2>
                <p>{t("{value0} unread", { value0: unreadCount })}</p>
              </div>
              <button
                type="button"
                className="ac-text-button"
                disabled={!unreadCount}
                onClick={() => {
                  setReadAlerts(alerts.map((alert) => alert.id));
                }}
              >
                {t("Mark all read")}
              </button>
            </div>
            {alerts.length ? (
              <ul>
                {alerts.map((alert) => {
                  const unread = !readAlerts.includes(alert.id);
                  return (
                    <li key={alert.id}>
                      <button
                        type="button"
                        className={unread ? "is-unread" : ""}
                        onClick={() => chooseAlert(alert)}
                      >
                        <span className="ac-alert-title">
                          {unread && <i aria-hidden="true" />}
                          {alert.title}
                        </span>
                        <small>{alert.detail}</small>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="ac-popover-empty">{t("No recent admin alerts.")}</p>
            )}
          </section>
        )}
      </div>

      <div className="ac-header-menu">
        <button
          type="button"
          className="ac-profile-button"
          aria-label={t("Super Admin account menu")}
          aria-expanded={openPanel === "profile"}
          aria-controls={`${searchId}-profile`}
          onClick={() =>
            setOpenPanel((current) =>
              current === "profile" ? null : "profile",
            )
          }
        >
          <span className="ac-profile-avatar" aria-hidden="true">
            SA
          </span>
          <span className="ac-profile-copy">
            <strong>{t("Super Admin")}</strong>
            <small>{t("Platform administrator")}</small>
          </span>
        </button>
        {openPanel === "profile" && (
          <section
            id={`${searchId}-profile`}
            className="ac-header-popover ac-profile-popover"
            aria-label={t("Super Admin account menu")}
          >
            <div className="ac-profile-detail">
              <span className="ac-profile-avatar" aria-hidden="true">
                SA
              </span>
              <div>
                <strong>{t("Super Admin")}</strong>
                <small>
                  <ShieldCheck size={13} aria-hidden="true" />
                  {t("Platform-wide oversight")}
                </small>
              </div>
              <UserRound size={17} aria-hidden="true" />
            </div>
            <button
              type="button"
              className="ac-profile-overview"
              onClick={() => {
                setOpenPanel(null);
                onShowOverview();
              }}
            >
              {t("Open overview")}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
