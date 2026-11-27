import DashboardLayout from "../shared/DashboardLayout.jsx";
import { useDashboardSection } from "../shared/useDashboardSection.js";
import { DashboardStat } from "../shared/DashboardUi.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.js";
import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
} from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Globe,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.js";
import { getRouteAccess, ROLES } from "../../auth/session.js";
import { formatEGP } from "../../../utils/formatEGP.js";
import { useCheckoutSnapshot } from "../../checkout/useCheckoutSnapshot.js";
import {
  committees,
  adminReducer,
  createAdminState,
  getCommitteeQueueCount,
  getFinanceOverview,
  searchAdminRecords,
  validatePlatformSettings,
  userRoleOptions,
  userStatusOptions,
} from "./governanceModel.js";
import { AdminDialog, Badge, DataTable, Panel } from "./AdminUi.jsx";
import AdminWorkspaceHeader from "./AdminWorkspaceHeader.jsx";
import { projectStore } from "../../projects/projectStore.js";
import { serviceStore } from "../../services/serviceStore.js";
import { PROJECT_STATUS, SERVICE_STATUS } from "../../marketplace/constants.js";
import logo from "../../../assets/figma/miu-anniversary-logo.png";
import "./admin.css";

const sections = [
  ["overview", "Overview", LayoutDashboard],
  ["users", "Users", Users],
  ["committees", "Committees", Building2],
  ["permissions", "Roles & permissions", ShieldCheck],
  ["reviews", "Reviews & approvals", ClipboardCheck],
  ["finance", "Financial overview", Wallet],
  ["jobs", "Jobs & Services", BriefcaseBusiness],
  ["settings", "Platform Settings", Settings],
  ["registration", "Registration settings", Globe],
  ["reports", "Reports & audit", Activity],
];
function formatAuditValue(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (typeof value === "object")
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${item ?? "Not set"}`)
      .join(" · ");
  return String(value);
}
export default function SuperAdminDashboard() {
  const { t, locale } = useLanguage();
  const checkoutSnapshot = useCheckoutSnapshot();
  const {
    session,
    listAccounts,
    accountAudit = [],
    updateAccountStatus,
    registrationSettings = { countries: [], audit: [] },
    addRegistrationCountry,
  } = useAuth();
  const canManageRegistration =
    getRouteAccess(session, {
      access: "roles",
      roles: [ROLES.SUPER_ADMIN],
    }) === "allowed";
  const availableSections = sections.filter(
    ([id]) => id !== "registration" || canManageRegistration,
  );

  const { activeSection: section, navigate: navigateSection } =
    useDashboardSection(
      availableSections.map(([id, label]) => ({ id, label })),
      "overview",
    );
  const title = sections.find(([id]) => id === section)[1];
  const [state, dispatch] = useReducer(
    adminReducer,
    undefined,
    createAdminState,
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dialog, setDialog] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [directoryValues, setDirectoryValues] = useState({});
  const [directoryAudit, setDirectoryAudit] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [marketplaceType, setMarketplaceType] = useState("All");
  const [marketplaceStatus, setMarketplaceStatus] = useState("All");
  const [auditSearch, setAuditSearch] = useState("");
  const [inspectingCommittee, setInspectingCommittee] = useState(null);
  const [settingsError, setSettingsError] = useState("");
  const projectRecords = useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getWorkspaceSnapshot,
    projectStore.getWorkspaceSnapshot,
  );
  const serviceSnapshot = useSyncExternalStore(
    serviceStore.subscribe,
    serviceStore.getSnapshot,
    serviceStore.getSnapshot,
  );
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const empty = scenario === "empty";
  const financeOverview = getFinanceOverview(
    empty ? { transactions: [] } : checkoutSnapshot,
  );
  const users = empty
    ? []
    : canManageRegistration && listAccounts
      ? listAccounts()
      : state.users;
  const directoryUsers = users.map((user) => ({
    ...user,
    role: directoryValues[user.id]?.role ?? user.role,
    directoryStatus:
      directoryValues[user.id]?.status ?? user.status ?? "Active",
  }));
  const [settingsDraft, setSettingsDraft] = useState(() => ({
    commissionPercent: state.settings.commissionPercent ?? "",
    minProjectBudgetEGP: state.settings.minProjectBudgetEGP ?? "",
    maxProjectBudgetEGP: state.settings.maxProjectBudgetEGP ?? "",
    maintenanceMode: state.settings.maintenanceMode,
  }));
  const marketplaceRecords = useMemo(() => {
    if (empty) return [];
    const userNames = new Map(
      directoryUsers.map((user) => [user.id, user.displayName]),
    );
    return [
      ...projectRecords
        .filter((record) => record.status !== PROJECT_STATUS.DRAFT)
        .map((record) => ({
          id: record.id,
          key: `job:${record.id}`,
          kind: "job",
          title: record.title,
          owner: userNames.get(record.clientId) ?? record.clientId,
          originalStatus: record.status,
          description: record.description,
        })),
      ...serviceSnapshot.services
        .filter((record) => record.status !== SERVICE_STATUS.DRAFT)
        .map((record) => ({
          id: record.id,
          key: `service:${record.id}`,
          kind: "service",
          title: record.title,
          owner: userNames.get(record.studentId) ?? record.studentId,
          originalStatus: record.status,
          description: record.description,
        })),
    ].map((record) => ({
      ...record,
      moderationStatus: state.moderation[record.key] ?? record.originalStatus,
    }));
  }, [
    directoryUsers,
    projectRecords,
    serviceSnapshot.services,
    empty,
    state.moderation,
  ]);
  const activeJobCount = marketplaceRecords.filter(
    (record) =>
      record.kind === "job" &&
      [PROJECT_STATUS.OPEN, "approved"].includes(record.moderationStatus),
  ).length;
  const auditHistory = empty
    ? []
    : [
        ...state.audit,
        ...directoryAudit,
        ...accountAudit,
        ...(canManageRegistration ? registrationSettings.audit : []),
      ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const cases = empty ? [] : state.cases;
  const pending = cases.filter((c) =>
    ["Pending", "Escalated"].includes(c.status),
  );
  const filteredPending = pending.filter((record) =>
    `${record.title} ${record.category} ${record.committee}`
      .toLowerCase()
      .includes(reviewSearch.toLowerCase()),
  );
  const filteredMarketplace = marketplaceRecords.filter((record) => {
    const searchText =
      `${record.title} ${record.owner} ${record.kind} ${record.moderationStatus}`.toLowerCase();
    const status =
      record.moderationStatus === "approved" ||
      record.moderationStatus === PROJECT_STATUS.OPEN ||
      record.moderationStatus === SERVICE_STATUS.PUBLISHED
        ? record.moderationStatus === "approved"
          ? "Approved"
          : "Active"
        : record.moderationStatus === "removed"
          ? "Removed"
          : record.moderationStatus === "paused"
            ? "Paused"
            : record.moderationStatus === PROJECT_STATUS.SELECTED
              ? "In progress"
              : "Closed";
    return (
      searchText.includes(marketplaceSearch.toLowerCase()) &&
      (marketplaceType === "All" ||
        (marketplaceType === "Jobs" && record.kind === "job") ||
        (marketplaceType === "Services" && record.kind === "service")) &&
      (marketplaceStatus === "All" || status === marketplaceStatus)
    );
  });
  const auditRows = empty
    ? []
    : auditHistory.filter((record) =>
        `${record.actor} ${record.action} ${record.target} ${record.reason}`
          .toLowerCase()
          .includes(auditSearch.toLowerCase()),
      );
  const searchResults = searchAdminRecords(globalSearch, {
    users: directoryUsers,
    marketplace: marketplaceRecords,
    audit: auditHistory,
  });
  const urgentAlerts = pending
    .filter(
      (record) => record.priority === "High" || record.status === "Escalated",
    )
    .slice(0, 5)
    .map((record) => ({
      id: record.id,
      caseId: record.id,
      title: record.title,
      detail: `${t(record.category)} · ${t(
        committees.find((committee) => committee.id === record.committee)
          ?.name ?? record.committee,
      )}`,
    }));
  const activityBaseline = [8, 11, 9, 13, 12, 16];
  const activityMonths = activityBaseline.map((baseline, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (activityBaseline.length - index - 1));
    return {
      label: date.toLocaleString(locale, { month: "short" }),
      value:
        baseline +
        (index === activityBaseline.length - 1 ? auditHistory.length : 0),
    };
  });
  const activityMaximum = Math.max(
    ...activityMonths.map(({ value }) => value),
    1,
  );
  const filteredAuditHistory = auditRows;
  const selectedUsers = directoryUsers.filter(
    (u) =>
      (u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" ||
        (filter === "Committee"
          ? u.role.endsWith("committee")
          : u.role === filter.toLowerCase())),
  );
  function go(id) {
    navigateSection(id);
    setSearch("");
    setFilter("All");
    setReviewSearch("");
    setMarketplaceSearch("");
    setMarketplaceType("All");
    setMarketplaceStatus("All");
    setAuditSearch("");
    setGlobalSearch("");
  }
  function open(value) {
    setError("");
    setDialog(value);
  }
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    if (dialog.type === "status") {
      if (!canManageRegistration) {
        setError("Sign in as Super Admin to manage saved accounts.");
        return;
      }
      setSaving(true);
      try {
        const result = updateAccountStatus({
          target: dialog.target,
          value: dialog.value,
          reason: String(form.get("reason")),
        });
        if (!result.ok) {
          setError(result.message || result.errors?.form);
          return;
        }
        setDialog(null);
        setNotice(
          "Account status saved in this browser and recorded in the audit history.",
        );
      } catch {
        setError("Could not save the account. Please try again.");
      } finally {
        setSaving(false);
      }
      return;
    }
    if (dialog.type === "add-country") {
      if (!canManageRegistration) {
        setError("Sign in as Super Admin to manage registration settings.");
        return;
      }
      const result = addRegistrationCountry({
        country: String(form.get("country")),
        reason: String(form.get("reason")),
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDialog(null);
      setNotice(result.message);
      return;
    }
    const action = {
      ...dialog,
      reason: String(form.get("reason") || "").trim(),
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
    };
    if (!action.reason) {
      setError("A decision reason is required.");
      return;
    }
    dispatch(action);
    setDialog(null);
    setNotice(
      "Simulated change recorded with an audit entry. Nothing was sent to a server.",
    );
  }
  function updateDirectoryValue(user, key, value) {
    const before =
      directoryValues[user.id]?.[key] ??
      (key === "role" ? user.role : (user.status ?? "Active"));
    if (before === value) return;
    setDirectoryValues((current) => ({
      ...current,
      [user.id]: { ...current[user.id], [key]: value },
    }));
    setDirectoryAudit((current) => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        actor: "Preview Super Admin",
        action: key === "role" ? "Directory role" : "Directory status",
        target: user.id,
        reason: `Updated ${key === "role" ? "role" : "status"} in the user directory preview.`,
        before,
        after: value,
        result: "Simulated success",
      },
      ...current,
    ]);
  }
  function updateAction(user, value) {
    if (user.accountStatus === "banned") return;
    if (userStatusOptions.includes(value)) {
      updateDirectoryValue(user, "status", value);
      return;
    }
    if (
      (value === "suspend" && user.accountStatus === "suspended") ||
      (value === "restore" && user.accountStatus === "active")
    )
      return;
    if (value === "suspend" || value === "restore" || value === "ban") {
      const nextStatus =
        value === "suspend"
          ? "suspended"
          : value === "ban"
            ? "banned"
            : "active";
      open({
        type: "status",
        target: user.id,
        value: nextStatus,
        record: user,
      });
    }
  }
  function selectGlobalResult(result) {
    const query = globalSearch.trim();
    if (result.kind === "user") {
      go("users");
      setSearch(query);
    } else if (result.kind === "marketplace") {
      go("jobs");
      setMarketplaceSearch(query);
    } else {
      go("reports");
      setAuditSearch(query);
    }
    setGlobalSearch("");
  }
  function selectAlert(alert) {
    if (alert.caseId) {
      go("reviews");
      setReviewSearch(alert.title);
      return;
    }
    go("overview");
  }
  function saveSettings(event) {
    event.preventDefault();
    setSettingsError("");
    const form = new FormData(event.currentTarget);
    const numberOrNull = (value) =>
      String(value ?? "").trim() === "" ? null : Number(value);
    const value = {
      commissionPercent: numberOrNull(settingsDraft.commissionPercent),
      minProjectBudgetEGP: numberOrNull(settingsDraft.minProjectBudgetEGP),
      maxProjectBudgetEGP: numberOrNull(settingsDraft.maxProjectBudgetEGP),
      maintenanceMode: settingsDraft.maintenanceMode,
    };
    const reason = String(form.get("settingsReason") ?? "").trim();
    const validation = validatePlatformSettings(value);
    if (validation) {
      setSettingsError(validation);
      return;
    }
    if (!reason) {
      setSettingsError("Add a reason before saving platform settings.");
      return;
    }
    if (JSON.stringify(value) === JSON.stringify(state.settings)) {
      setNotice("No platform setting changes to save.");
      return;
    }
    dispatch({
      type: "settings",
      target: "platform",
      targetLabel: "Platform settings",
      actionLabel: "Updated platform settings",
      value,
      reason,
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
    });
    setSettingsDraft({
      commissionPercent: value.commissionPercent ?? "",
      minProjectBudgetEGP: value.minProjectBudgetEGP ?? "",
      maxProjectBudgetEGP: value.maxProjectBudgetEGP ?? "",
      maintenanceMode: value.maintenanceMode,
    });
    setNotice(
      "Platform settings updated in this preview and recorded in audit history.",
    );
  }
  function inspectCommittee(committee) {
    setInspectingCommittee(committee);
  }
  const committeeCards = committees.map((committee) => (
    <article className="ac-panel ac-committee" key={committee.id}>
      <span className="ac-icon">
        <ShieldCheck size={20} />
      </span>
      <h3>{t(committee.name)}</h3>
      <p>{t(committee.description)}</p>
      <div>
        <Badge>
          {getCommitteeQueueCount(cases, committee.id)} {t("queued")}
        </Badge>
        <button
          className="button-text-only"
          onClick={() => inspectCommittee(committee)}
        >
          {t("Inspect workspace")}
        </button>
      </div>
    </article>
  ));
  const reviewTable = (
    <DataTable
      rows={filteredPending}
      columns={[
        {
          key: "title",
          label: "Case",
          render: (record) => t(record.title),
        },
        {
          key: "category",
          label: "Queue",
          render: (record) => t(record.category),
        },
        {
          key: "committee",
          label: "Committee",
          render: (record) =>
            t(
              committees.find((committee) => committee.id === record.committee)
                ?.name ?? record.committee,
            ),
        },
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge>{t(r.status)}</Badge>,
        },
        {
          key: "priority",
          label: "Priority",
          render: (record) => t(record.priority),
        },
        {
          key: "review",
          label: "Action",
          render: (record) => (
            <div className="ac-review-actions">
              <button
                className="ac-primary"
                onClick={() =>
                  open({
                    type: "decision",
                    target: record.id,
                    value: "Approved",
                    record,
                  })
                }
              >
                {t("Approve")}
              </button>
              <button
                onClick={() =>
                  open({
                    type: "decision",
                    target: record.id,
                    value: "Rejected",
                    record,
                  })
                }
              >
                {t("Reject")}
              </button>
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <DashboardLayout
      title="Administration"
      variant="admin"
      navItems={availableSections.map(([id, label, Icon]) => ({
        id,
        label,
        icon: <Icon size={18} aria-hidden="true" />,
      }))}
      defaultSection="overview"
      mainId="admin-content"
      navLabel="Super Admin sections"
      caption="PLATFORM CONTROL"
      brand={
        <>
          {" "}
          <Link to="/projects" className="ac-brand">
            <img src={logo} alt={t("MIU anniversary logo")} />
            <b>
              {t("MIU Freelance")}
              <small>{t("Administration workspace")}</small>
            </b>
          </Link>
        </>
      }
      sidebarFooter={
        <>
          {" "}
          <div className="ac-trust">
            <ShieldCheck size={22} />
            <h3>{t("Accountable by design")}</h3>
            <p>
              {t(
                "Every simulated decision includes a reason and an audit record.",
              )}
            </p>
          </div>
          <Link className="ac-back" to="/">
            {t("Preview controls")}
          </Link>
        </>
      }

      headerAccount={
        <AdminWorkspaceHeader
          alerts={urgentAlerts}
          onAlertSelect={selectAlert}
          onSearchChange={setGlobalSearch}
          onSearchSelect={selectGlobalResult}
          onShowOverview={() => go("overview")}
          searchResults={searchResults}
          searchValue={globalSearch}
        />
      }
      onSectionChange={() => {
        setSearch("");
        setFilter("All");
        setReviewSearch("");
        setMarketplaceSearch("");
        setMarketplaceType("All");
        setMarketplaceStatus("All");
        setAuditSearch("");
        setGlobalSearch("");
      }}

      overlays={
        <>
          {inspectingCommittee && (
            <AdminDialog
              title={t("Inspect workspace · {value0}", {
                value0: inspectingCommittee.name,
              })}
              close={() => setInspectingCommittee(null)}
            >
              <p>{t(inspectingCommittee.description)}</p>
              <p className="ac-inspect-summary">
                {getCommitteeQueueCount(cases, inspectingCommittee.id)}{" "}
                {t("open cases in this queue")}
              </p>
              <div className="ac-inspect-list">
                {cases
                  .filter(
                    (record) =>
                      record.committee === inspectingCommittee.id &&
                      ["Pending", "Escalated"].includes(record.status),
                  )
                  .map((record) => (
                    <article key={record.id}>
                      <div>
                        <strong>{t(record.title)}</strong>
                        <span>
                          {t(record.category)} · {t(record.status)}
                        </span>
                        <p>{record.detail}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingCommittee(null);
                          open({
                            type: "decision",
                            target: record.id,
                            value: "Approved",
                            record,
                          });
                        }}
                      >
                        {t("Review case")}
                      </button>
                    </article>
                  ))}
                {!getCommitteeQueueCount(cases, inspectingCommittee.id) && (
                  <p className="ac-empty">
                    {t("No open cases in this queue.")}
                  </p>
                )}
              </div>
            </AdminDialog>
          )}
          {dialog && (
            <AdminDialog
              title={t(
                {
                  "add-country": "Add country",
                  decision: "Review queue item",
                  moderation: "Moderate marketplace record",
                }[dialog.type] ?? "Record administrative decision",
              )}
              close={() => setDialog(null)}
            >
              <form onSubmit={submit} aria-busy={saving}>
                {dialog.type === "add-country" ? (
                  <label>
                    {t("Country name")}
                    <input name="country" required maxLength={80} />
                  </label>
                ) : (
                  <>
                    <p>
                      {dialog.record?.detail ||
                        `Target: ${dialog.record?.displayName || dialog.target}. Proposed change: ${String(dialog.value)}.`}
                    </p>
                    {dialog.type === "decision" && (
                      <label>
                        {t("Decision")}
                        <select
                          value={dialog.value}
                          onChange={(e) =>
                            setDialog({ ...dialog, value: e.target.value })
                          }
                        >
                          {[
                            "Approved",
                            "Rejected",
                            "Resubmission requested",
                          ].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </>
                )}
                <label>
                  {t("Reason (required)")}
                  <textarea name="reason" required maxLength={1000} />
                </label>
                <p role="alert">{t(error)}</p>
                <div className="ac-actions">
                  <button type="button" onClick={() => setDialog(null)}>
                    {t("Cancel")}
                  </button>
                  <button className="ac-primary" disabled={saving}>
                    {t(saving ? "Please wait…" : "Confirm simulated change")}
                  </button>
                </div>
              </form>
            </AdminDialog>
          )}
        </>
      }
    >
      {section !== "finance" && (
        <div className="ac-heading">
          <div>
            <p className="ac-eyebrow">{t("MIU FREELANCE · GOVERNANCE")}</p>
            <h1>
              {section === "overview" ? t("Platform Control Center") : title}
            </h1>
            <p>
              {t(
                "Clarity across the platform. Accountability in every decision.",
              )}
            </p>
          </div>
        </div>
      )}
      <div className="ac-demo">
        {t(
          "Local preview · Accounts and account audit records stay in this browser. Other workspace previews reset when you leave. No real verification, payments or escrow.",
        )}
      </div>
      <p role="status" className="ac-notice">
        {t(notice)}
      </p>
      {!loaded ? (
        <div className="ac-panel ac-empty" role="status">
          {t("Loading control center…")}
        </div>
      ) : scenario === "error" ? (
        <div className="ac-panel ac-empty" role="alert">
          <h2>{t("Unable to load this preview")}</h2>
          <p>{t("Your in-memory changes are retained.")}</p>
          <button
            onClick={() => {
              setLoaded(false);
              setScenario("sample");
            }}
          >
            {t("Try again")}
          </button>
        </div>
      ) : (
        <>
          {section === "overview" && (
            <>
              <div className="ac-stats">
                {[
                  [
                    "Total Students",
                    directoryUsers.filter((user) => user.role === ROLES.STUDENT)
                      .length,
                    "Student accounts in the directory",
                    Users,
                  ],
                  [
                    "Active Jobs",
                    activeJobCount,
                    "Open freelance projects",
                    BriefcaseBusiness,
                  ],
                  [
                    "Total Escrow Volume",
                    formatEGP(
                      empty ? 0 : financeOverview.escrowHeldMinor / 100,
                      locale,
                    ),
                    "Recorded checkout funds held",
                    Wallet,
                  ],
                  [
                    "Pending Reviews",
                    pending.length,
                    "Awaiting a decision",
                    ClipboardCheck,
                  ],
                ].map(([label, value, caption, Icon]) => (
                  <DashboardStat
                    key={label}
                    variant="admin"
                    label={label}
                    value={value}
                    caption={caption}
                    icon={<Icon size={18} aria-hidden="true" />}
                  />
                ))}
              </div>
              <div className="ac-overview-grid">
                <Panel
                  title={t("Monthly platform activity")}
                  subtitle={t(
                    "Illustrative baseline plus administrative actions recorded this session.",
                  )}
                >
                  <div
                    className="ac-activity-chart"
                    role="img"
                    aria-label={t(
                      "Monthly platform activity chart with six months of preview activity.",
                    )}
                  >
                    {activityMonths.map((month) => (
                      <div className="ac-activity-column" key={month.label}>
                        <strong>{month.value}</strong>
                        <span className="ac-activity-track">
                          <span
                            className="ac-activity-bar"
                            style={{
                              height: `${Math.max(12, (month.value / activityMaximum) * 100)}%`,
                            }}
                          />
                        </span>
                        <small>{month.label}</small>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel
                  title={t("Recent urgent alerts")}
                  subtitle={t(
                    "High-priority items from the unified review queue.",
                  )}
                >
                  {urgentAlerts.length ? (
                    <ul className="ac-urgent-list">
                      {urgentAlerts.map((alert) => (
                        <li key={alert.id}>
                          <button
                            type="button"
                            onClick={() => selectAlert(alert)}
                          >
                            <strong>{t(alert.title)}</strong>
                            <span>{alert.detail}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ac-empty">{t("No urgent alerts.")}</p>
                  )}
                  <button
                    className="ac-panel-link"
                    onClick={() => go("reviews")}
                  >
                    {t("Open review queue")}
                  </button>
                </Panel>
              </div>
              <div className="ac-section-title">
                <h2>{t("Committee oversight")}</h2>
                <button onClick={() => go("committees")}>
                  {t("View all committees →")}
                </button>
              </div>
              <div className="ac-committee-grid">{committeeCards}</div>
            </>
          )}
          {section === "users" && (
            <Panel
              title={t("User directory")}
              subtitle={t(
                "Role and directory status selections are temporary preview values; suspension and ban actions update the saved account.",
              )}
            >
              <div className="ac-filters">
                <label>
                  {t("Search accounts")}
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <label>
                  {t("Role")}
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {["All", "Student", "Client", "Committee"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <DataTable
                tableClassName="ac-user-table"
                rows={selectedUsers}
                columns={[
                  { key: "displayName", label: "Account" },
                  { key: "email", label: "Email" },
                  {
                    key: "role",
                    label: "Role",
                    render: (user) => (
                      <select
                        aria-label={t("Role for {value0}", {
                          value0: user.displayName,
                        })}
                        value={user.role}
                        disabled={user.role === ROLES.SUPER_ADMIN}
                        onChange={(event) =>
                          updateDirectoryValue(user, "role", event.target.value)
                        }
                      >
                        {!userRoleOptions.some(
                          (option) => option.value === user.role,
                        ) && (
                          <option value={user.role} disabled>
                            {user.role === ROLES.CLIENT
                              ? t("Client")
                              : t("Super Admin")}
                          </option>
                        )}
                        {userRoleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {t(option.label)}
                          </option>
                        ))}
                      </select>
                    ),
                  },
                  {
                    key: "action",
                    label: "Action",
                    render: (user) => (
                      <select
                        aria-label={t("Status and actions for {value0}", {
                          value0: user.displayName,
                        })}
                        value={
                          user.accountStatus === "banned"
                            ? "ban"
                            : user.accountStatus === "suspended"
                              ? "restore"
                              : user.directoryStatus
                        }
                        disabled={
                          user.role === ROLES.SUPER_ADMIN ||
                          user.accountStatus === "banned"
                        }
                        onChange={(event) =>
                          updateAction(user, event.target.value)
                        }
                      >
                        <optgroup label={t("Directory status")}>
                          {userStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {t(status)}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup
                          label={t("Account actions")}
                          disabled={!canManageRegistration}
                        >
                          <option value="suspend">{t("Suspend")}</option>
                          <option value="restore">{t("Restore")}</option>
                          <option value="ban">{t("Ban")}</option>
                        </optgroup>
                      </select>
                    ),
                  },
                ]}
              />
            </Panel>
          )}
          {section === "committees" && (
            <>
              <Panel
                title={t("Five specialist workspaces")}
                subtitle={t(
                  "Queue totals update when cases are resolved. Inspection is a local workspace preview.",
                )}
              >
                <div className="ac-committee-grid ac-padded">
                  {committeeCards}
                </div>
              </Panel>
              <Panel
                title={t("Provisioned committee accounts")}
                subtitle="Preloaded local accounts can sign in with their assigned credentials."
              >
                <DataTable
                  rows={users.filter((u) => u.role.endsWith("committee"))}
                  columns={[
                    { key: "displayName", label: "Member" },
                    { key: "email", label: "Email" },
                    { key: "role", label: "Committee" },
                    { key: "accountStatus", label: "Status" },
                    {
                      key: "action",
                      label: "Action",
                      render: (u) => (
                        <button
                          onClick={() =>
                            open({
                              type: "status",
                              target: u.id,
                              value:
                                u.accountStatus === "active"
                                  ? "suspended"
                                  : "active",
                              record: u,
                            })
                          }
                        >
                          {u.accountStatus === "active"
                            ? t("Suspend")
                            : t("Reactivate")}
                        </button>
                      ),
                    },
                  ]}
                />
              </Panel>
            </>
          )}
          {section === "permissions" && (
            <Panel
              title={t("Committee permission matrix")}
              subtitle="Least privilege: each committee is limited to its own domain. Preview permission changes are recorded here; shared login guards remain unchanged."
            >
              <DataTable
                rows={committees}
                columns={[
                  { key: "name", label: "Role" },
                  { key: "scope", label: "Assigned scope" },
                  {
                    key: "review",
                    label: "Review assigned cases",
                    render: (c) => (
                      <button
                        aria-pressed={state.grants[c.id]}
                        onClick={() =>
                          open({
                            type: "permission",
                            target: c.id,
                            value: !state.grants[c.id],
                          })
                        }
                      >
                        {state.grants[c.id] ? t("Enabled") : t("Disabled")}
                      </button>
                    ),
                  },
                  {
                    key: "governance",
                    label: "Manage roles / accounts",
                    render: () => "Super Admin only",
                  },
                ]}
              />
            </Panel>
          )}
          {section === "reviews" && (
            <Panel
              title={t("Pending reviews & escalations")}
              subtitle={t(
                "ID verification, flagged content, finance exceptions, quality reports and disputes share one reason-required decision queue.",
              )}
            >
              <div className="ac-filters">
                <label>
                  {t("Search review queue")}
                  <input
                    type="search"
                    value={reviewSearch}
                    onChange={(event) => setReviewSearch(event.target.value)}
                  />
                </label>
              </div>
              {reviewTable}
            </Panel>
          )}
          {section === "finance" && (
            <>
              <div className="ac-stats">
                {[
                  [
                    "Successful sandbox payments",
                    financeOverview.transactions.length,
                    "Successful initial payments only.",
                    ReceiptText,
                  ],
                  [
                    "Amount paid",
                    formatEGP(financeOverview.amountPaidMinor / 100, locale),
                    "From successful checkouts.",
                    Wallet,
                  ],
                  [
                    "Held in escrow",
                    formatEGP(financeOverview.escrowHeldMinor / 100, locale),
                    "Simulated funds not released.",
                    ShieldCheck,
                  ],
                  [
                    "Remaining balance",
                    formatEGP(financeOverview.remainingMinor / 100, locale),
                    "Unpaid on the listed orders.",
                    ReceiptText,
                  ],
                ].map(([label, value, caption, Icon]) => (
                  <DashboardStat
                    key={label}
                    variant="admin"
                    label={label}
                    value={value}
                    caption={caption}
                    icon={<Icon size={18} aria-hidden="true" />}
                  />
                ))}
              </div>
              <Panel
                title={t("Sandbox financial overview")}
                subtitle="Successful simulated service payments only. Amounts come from checkout records; no real money is moved."
              >
                <DataTable
                  rows={financeOverview.transactions}
                  empty="No successful payments have been recorded yet."
                  columns={[
                    { key: "id", label: "Reference" },
                    { key: "serviceTitle", label: "Service" },
                    {
                      key: "amountPaidMinor",
                      label: "Amount paid",
                      render: (payment) =>
                        formatEGP(payment.amountPaidMinor / 100, locale),
                    },
                    {
                      key: "escrowHeldMinor",
                      label: "Held in escrow",
                      render: (payment) =>
                        formatEGP(payment.escrowHeldMinor / 100, locale),
                    },
                    {
                      key: "remainingMinor",
                      label: "Remaining balance",
                      render: (payment) =>
                        formatEGP(payment.remainingMinor / 100, locale),
                    },
                    {
                      key: "paymentStatus",
                      label: "Status",
                      render: (payment) => (
                        <Badge>{payment.paymentStatus}</Badge>
                      ),
                    },
                  ]}
                />
              </Panel>
            </>
          )}
          {section === "jobs" && (
            <Panel
              title={t("Jobs and services")}
              subtitle={t(
                "Moderation changes affect this workspace preview only; existing order terms and marketplace records are not changed.",
              )}
            >
              <div className="ac-filters ac-marketplace-filters">
                <label>
                  {t("Search listings")}
                  <input
                    type="search"
                    value={marketplaceSearch}
                    onChange={(event) =>
                      setMarketplaceSearch(event.target.value)
                    }
                  />
                </label>
                <label>
                  {t("Listing type")}
                  <select
                    value={marketplaceType}
                    onChange={(event) => setMarketplaceType(event.target.value)}
                  >
                    {["All", "Jobs", "Services"].map((option) => (
                      <option key={option}>{t(option)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("Status")}
                  <select
                    value={marketplaceStatus}
                    onChange={(event) =>
                      setMarketplaceStatus(event.target.value)
                    }
                  >
                    {[
                      "All",
                      "Active",
                      "Approved",
                      "Paused",
                      "Removed",
                      "In progress",
                      "Closed",
                    ].map((option) => (
                      <option key={option}>{t(option)}</option>
                    ))}
                  </select>
                </label>
              </div>
              <DataTable
                rows={filteredMarketplace}
                empty="No matching listings."
                columns={[
                  { key: "title", label: "Listing" },
                  {
                    key: "kind",
                    label: "Type",
                    render: (record) =>
                      t(record.kind === "job" ? "Job" : "Service"),
                  },
                  { key: "owner", label: "Owner" },
                  {
                    key: "status",
                    label: "Status",
                    render: (record) => (
                      <Badge>
                        {t(
                          record.moderationStatus === PROJECT_STATUS.OPEN ||
                            record.moderationStatus === SERVICE_STATUS.PUBLISHED
                            ? "Active"
                            : record.moderationStatus === "approved"
                              ? "Approved"
                              : record.moderationStatus === "paused"
                                ? "Paused"
                                : record.moderationStatus === "removed"
                                  ? "Removed"
                                  : record.moderationStatus ===
                                      PROJECT_STATUS.SELECTED
                                    ? "In progress"
                                    : "Closed",
                        )}
                      </Badge>
                    ),
                  },
                  {
                    key: "moderate",
                    label: "Moderation",
                    render: (record) => (
                      <select
                        aria-label={t("Moderate {value0}", {
                          value0: record.title,
                        })}
                        value=""
                        disabled={record.moderationStatus === "removed"}
                        onChange={(event) => {
                          const action = event.target.value;
                          if (!action) return;
                          open({
                            type: "moderation",
                            target: record.id,
                            targetLabel: record.title,
                            recordId: record.id,
                            recordType: record.kind,
                            before: record.moderationStatus,
                            value: action,
                            actionLabel: `${action} ${record.kind}`,
                            record,
                          });
                        }}
                      >
                        <option value="" disabled>
                          {t("Choose action")}
                        </option>
                        <option value="approved">{t("Approve")}</option>
                        <option value="paused">{t("Pause")}</option>
                        <option value="removed">{t("Remove")}</option>
                      </select>
                    ),
                  },
                ]}
              />
            </Panel>
          )}
          {section === "settings" && (
            <Panel
              title={t("Platform settings")}
              subtitle={t(
                "These values are saved in this preview only. Financial policy limits remain unconfigured until approved.",
              )}
            >
              <form className="ac-settings-form" onSubmit={saveSettings}>
                <div className="ac-settings-grid">
                  <label>
                    {t("Platform commission (%)")}
                    <input
                      name="commissionPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settingsDraft.commissionPercent}
                      onChange={(event) =>
                        setSettingsDraft((current) => ({
                          ...current,
                          commissionPercent: event.target.value,
                        }))
                      }
                    />
                    <small>{t("Leave blank until a rate is approved.")}</small>
                  </label>
                  <label>
                    {t("Minimum project budget (EGP)")}
                    <input
                      name="minProjectBudgetEGP"
                      type="number"
                      min="1"
                      step="1"
                      value={settingsDraft.minProjectBudgetEGP}
                      onChange={(event) =>
                        setSettingsDraft((current) => ({
                          ...current,
                          minProjectBudgetEGP: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    {t("Maximum project budget (EGP)")}
                    <input
                      name="maxProjectBudgetEGP"
                      type="number"
                      min="1"
                      step="1"
                      value={settingsDraft.maxProjectBudgetEGP}
                      onChange={(event) =>
                        setSettingsDraft((current) => ({
                          ...current,
                          maxProjectBudgetEGP: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <label className="ac-toggle-row">
                  <input
                    name="maintenanceMode"
                    type="checkbox"
                    checked={settingsDraft.maintenanceMode}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        maintenanceMode: event.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>{t("Maintenance mode")}</strong>
                    <small>
                      {t(
                        "Preview setting only; this does not take the platform offline.",
                      )}
                    </small>
                  </span>
                </label>
                <label>
                  {t("Reason (required)")}
                  <textarea name="settingsReason" required maxLength={1000} />
                </label>
                {settingsError && (
                  <p className="ac-form-error" role="alert">
                    {t(settingsError)}
                  </p>
                )}
                <button className="ac-primary" type="submit">
                  {t("Save settings")}
                </button>
              </form>
            </Panel>
          )}
          {section === "registration" && (
            <Panel
              title={t("Registration countries")}
              subtitle={t(
                "These countries are saved in this browser and appear in the sign-up form.",
              )}
            >
              <ul className="mb-4 list-disc space-y-1 ps-5">
                {registrationSettings.countries.map((country) => (
                  <li key={country}>{t(country)}</li>
                ))}
              </ul>
              <button
                className="ac-primary"
                onClick={() => open({ type: "add-country" })}
              >
                {t("Add country")}
              </button>
            </Panel>
          )}
          {section === "reports" && (
            <>
              <div className="ac-stats">
                {[
                  [
                    "Approved decisions",
                    cases.filter((record) => record.status === "Approved")
                      .length,
                  ],
                  [
                    "Rejected decisions",
                    cases.filter((record) => record.status === "Rejected")
                      .length,
                  ],
                  ["Open review queues", pending.length],
                  ["Administrative actions", auditHistory.length],
                ].map(([label, value]) => (
                  <article className="ac-panel ac-stat" key={label}>
                    <div>{t(label)}</div>
                    <strong>{value}</strong>
                    <small>{t("Live administrative records")}</small>
                  </article>
                ))}
              </div>
              <Panel
                title={t("Administrative audit history")}
                subtitle={t(
                  "Account events are saved locally; review, moderation and settings records last for this workspace session.",
                )}
              >
                <div className="ac-filters">
                  <label>
                    {t("Search audit history")}
                    <input
                      type="search"
                      value={auditSearch}
                      onChange={(event) => setAuditSearch(event.target.value)}
                    />
                  </label>
                </div>
                <DataTable
                  rows={filteredAuditHistory}
                  empty="No administrative actions yet. Record a simulated decision to create an audit event."
                  columns={[
                    {
                      key: "timestamp",
                      label: "Time",
                      render: (r) =>
                        new Date(r.timestamp).toLocaleString(locale, {
                          timeZone: "Africa/Cairo",
                        }),
                    },
                    { key: "actor", label: "Actor" },
                    {
                      key: "action",
                      label: "Action / target",
                      render: (r) => `${r.action} · ${r.target}`,
                    },
                    { key: "reason", label: "Reason" },
                    {
                      key: "change",
                      label: "Before → after",
                      render: (record) =>
                        `${formatAuditValue(record.before)} → ${formatAuditValue(record.after)}`,
                    },
                    { key: "result", label: "Result" },
                  ]}
                />
              </Panel>
            </>
          )}
        </>
      )}
      <footer className="ac-footer">
        <span>{t("© 2026 MIU Freelance")}</span>
        <details>
          <summary>{t("Preview states")}</summary>
          <label>
            {t("Data scenario")}
            <select
              value={scenario}
              onChange={(e) => {
                setLoaded(false);
                setScenario(e.target.value);
              }}
            >
              {["sample", "empty", "error"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </details>
      </footer>
    </DashboardLayout>
  );
}
