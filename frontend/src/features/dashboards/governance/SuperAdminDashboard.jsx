import DashboardLayout from "../shared/DashboardLayout.jsx";
import { useDashboardSection } from "../shared/useDashboardSection.js";
import { DashboardStat } from "../shared/DashboardUi.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Building2,
  ClipboardCheck,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.js";
import { getRouteAccess, ROLES } from "../../auth/session.js";
import { formatEGP } from "../../../utils/formatEGP.js";
import {
  committees,
  transactions,
  adminReducer,
  createAdminState,
} from "./governanceModel.js";
import { AdminDialog, Badge, DataTable, Panel } from "./AdminUi.jsx";
import logo from "../../../assets/figma/miu-anniversary-logo.png";
import "./admin.css";

const sections = [
  ["overview", "Overview", LayoutDashboard],
  ["users", "Users", Users],
  ["committees", "Committees", Building2],
  ["permissions", "Roles & permissions", ShieldCheck],
  ["reviews", "Reviews & approvals", ClipboardCheck],
  ["finance", "Financial overview", Wallet],
  ["registration", "Registration settings", Globe],
  ["reports", "Reports & audit", Activity],
];
export default function SuperAdminDashboard() {
  const { t, locale } = useLanguage();
  const {
    session,
    listAccounts,
    accountAudit = [],
    createCommitteeAccount,
    updateAccountStatus,
    registrationSettings,
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
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const empty = scenario === "empty";
  const users = empty
    ? []
    : canManageRegistration && listAccounts
      ? listAccounts()
      : state.users;
  const cases = empty ? [] : state.cases;
  const pending = cases.filter((c) =>
    ["Pending", "Escalated"].includes(c.status),
  );
  const selectedUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" ||
        (filter === "Committee"
          ? u.role.endsWith("committee")
          : u.role === filter.toLowerCase())),
  );
  function go(id) {
    navigateSection(id);
    setSearch("");
    setFilter("All");
  }
  function open(value) {
    setError("");
    setDialog(value);
  }
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    if (!canManageRegistration) {
      setError("Sign in as Super Admin to manage saved accounts.");
      return;
    }
    const form = new FormData(event.currentTarget);
    if (["create", "status"].includes(dialog.type)) {
      setSaving(true);
      try {
        const result =
          dialog.type === "create"
            ? await createCommitteeAccount({
                name: String(form.get("name")),
                email: String(form.get("email")),
                password: String(form.get("password")),
                committee: String(form.get("committee")),
                reason: String(form.get("reason")),
              })
            : updateAccountStatus({
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
          "Demo account saved in this browser. Committee members can sign in with their assigned email and password.",
        );
      } catch {
        setError("Could not save the account. Please try again.");
      } finally {
        setSaving(false);
      }
      return;
    }
    if (dialog.type === "add-country") {
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
      "Demo change recorded with an audit entry. Nothing was sent to a server.",
    );
  }
  const reviewTable = (
    <DataTable
      rows={pending}
      columns={[
        { key: "title", label: "Case" },
        { key: "committee", label: "Committee" },
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge>{r.status}</Badge>,
        },
        { key: "priority", label: "Priority" },
        {
          key: "review",
          label: "Action",
          render: (r) => (
            <button
              onClick={() =>
                open({
                  type: "decision",
                  target: r.id,
                  value: "Approved",
                  record: r,
                })
              }
            >
              {t("Review case →")}
            </button>
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
              {t("Every demo decision includes a reason and an audit record.")}
            </p>
          </div>
          <Link className="ac-back" to="/">
            {t("Demo session controls")}
          </Link>
        </>
      }

      headerAccount={
        <>
          {" "}
          <span className="ac-account">
            <span className="ac-avatar">{t("SA")}</span>
            {t("Super Admin")} <Badge>{t("Frontend demo")}</Badge>
          </span>
        </>
      }
      onSectionChange={() => {
        setSearch("");
        setFilter("All");
      }}

      overlays={
        <>
          {dialog && (
            <AdminDialog
              title={t(
                {
                  create: "Create committee account",
                  "add-country": "Add country",
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
                ) : dialog.type === "create" ? (
                  <>
                    <p>
                      {t(
                        "Local demo account. Set a test password and share it manually; no activation email is sent.",
                      )}
                    </p>
                    <label>
                      {t("Member name")}
                      <input name="name" required maxLength={80} />
                    </label>
                    <label>
                      {t("Demo email")}
                      <input
                        name="email"
                        type="email"
                        required
                        maxLength={160}
                      />
                    </label>
                    <label>
                      {t("Demo password")}
                      <input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                      />
                    </label>
                    <label>
                      {t("Committee")}
                      <select name="committee">
                        {committees.map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
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
                    {t(saving ? "Please wait…" : "Confirm demo change")}
                  </button>
                </div>
              </form>
            </AdminDialog>
          )}
        </>
      }
    >
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
        <button
          className="ac-primary"
          disabled={!canManageRegistration}
          onClick={() =>
            open({
              type: "create",
              target: `committee_${crypto.randomUUID()}`,
            })
          }
        >
          {t("+ Create committee account")}
        </button>
      </div>
      <div className="ac-demo">
        {t(
          "Local demo · Accounts and account audit records stay in this browser. Other workspace previews reset when you leave. No real verification, payments or escrow.",
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
          <h2>{t("Unable to load this demo")}</h2>
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
                    "Active accounts",
                    users.filter((u) => u.accountStatus === "active").length,
                    "Available demo accounts",
                    Users,
                  ],
                  [
                    "Pending reviews",
                    pending.length,
                    "Awaiting a recorded decision",
                    ClipboardCheck,
                  ],
                  [
                    "Committee queues",
                    empty ? 0 : 5,
                    "Five specialist areas",
                    Building2,
                  ],
                  [
                    "Sandbox escrow",
                    formatEGP(empty ? 0 : 7500, locale),
                    "Fictional held amount",
                    Wallet,
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
                title={t("Needs your attention")}
                subtitle="Review escalations and pending cases before recording a decision."
              >
                {reviewTable}
              </Panel>
              <div className="ac-section-title">
                <h2>{t("Committee oversight")}</h2>
                <button onClick={() => go("committees")}>
                  {t("View all committees →")}
                </button>
              </div>
              <div className="ac-committee-grid">
                {committees.map((c) => (
                  <article className="ac-panel ac-committee" key={c.id}>
                    <span className="ac-icon">
                      <ShieldCheck size={20} />
                    </span>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    <div>
                      <Badge>
                        {empty ? 0 : c.pending} {t("queued")}
                      </Badge>
                      <button
                        className="button-text-only"
                        onClick={() => {
                          go("committees");
                        }}
                      >
                        {t("Inspect workspace")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {section === "users" && (
            <Panel
              title={t("User directory")}
              subtitle="Saved local demo accounts, including students, clients and provisioned committees."
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
                rows={selectedUsers}
                columns={[
                  { key: "displayName", label: "Account" },
                  { key: "email", label: "Email" },
                  { key: "role", label: "Role" },
                  {
                    key: "accountStatus",
                    label: "Access",
                    render: (u) => <Badge>{u.accountStatus}</Badge>,
                  },
                  {
                    key: "action",
                    label: "Action",
                    render: (u) => (
                      <button
                        disabled={
                          !canManageRegistration || u.role === ROLES.SUPER_ADMIN
                        }
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
                          : t("Restore")}
                      </button>
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
                subtitle="Committee members sign in with their assigned credentials. Committee screens currently show routing placeholders."
              >
                <div className="ac-committee-grid ac-padded">
                  {committees.map((c) => (
                    <article className="ac-committee" key={c.id}>
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                      <button
                        className="button-text-only button-text-only--glyph"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        {t("Sign in")} · {c.name}
                      </button>
                    </article>
                  ))}
                </div>
              </Panel>
              <Panel
                title={t("Provisioned committee accounts")}
                subtitle="Created only by Super Admin. Saved accounts can sign in with their assigned email and test password."
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
              subtitle="Least privilege: each committee is limited to its own domain. Demo review permission changes are recorded here; shared login guards remain unchanged."
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
              subtitle="Recorded decisions are simulations. No biometric data or real evidence is processed."
            >
              {reviewTable}
            </Panel>
          )}
          {section === "finance" && (
            <Panel
              title={t("Sandbox financial overview")}
              subtitle="Fictional records only. Financial approval thresholds and fee policies remain undecided; no money movement is available."
            >
              <DataTable
                rows={empty ? [] : transactions}
                columns={[
                  { key: "id", label: "Reference" },
                  { key: "type", label: "Event" },
                  {
                    key: "amount",
                    label: "Amount",
                    render: (t) => formatEGP(t.amount, locale),
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (t) => <Badge>{t.status}</Badge>,
                  },
                ]}
              />
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
                {["Approved", "Rejected", "Resubmission requested"].map(
                  (status) => (
                    <article className="ac-panel ac-stat" key={status}>
                      <div>{status}</div>
                      <strong>
                        {cases.filter((c) => c.status === status).length}
                      </strong>
                      <small>{t("Decisions in this preview")}</small>
                    </article>
                  ),
                )}
              </div>
              <Panel
                title={t("Administrative audit history")}
                subtitle="Account events are saved locally; case and permission preview events last for this workspace session."
              >
                <DataTable
                  rows={
                    empty
                      ? []
                      : [
                          ...state.audit,
                          ...accountAudit,
                          ...(canManageRegistration
                            ? registrationSettings.audit
                            : []),
                        ].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                  }
                  empty="No administrative actions yet. Make a demo decision to create an audit event."
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
                      render: (r) => `${r.before} → ${r.after}`,
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
