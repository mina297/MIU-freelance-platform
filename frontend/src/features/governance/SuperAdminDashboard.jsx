import { useLanguage } from "../../i18n/LanguageContext.js";
import { startTransition, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { formatEGP } from "../../utils/formatEGP.js";
import {
  committees,
  transactions,
  adminReducer,
  createAdminState,
} from "./adminModel.js";
import { AdminDialog, Badge, DataTable, Panel } from "./AdminUi.jsx";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./admin.css";

const sections = [
  ["overview", "Overview", LayoutDashboard],
  ["users", "Users", Users],
  ["committees", "Committees", Building2],
  ["permissions", "Roles & permissions", ShieldCheck],
  ["reviews", "Reviews & approvals", ClipboardCheck],
  ["finance", "Financial overview", Wallet],
  ["reports", "Reports & audit", Activity],
];
export default function SuperAdminDashboard() {
  const { t, locale } = useLanguage();

  const [params, setParams] = useSearchParams();
  const section = sections.some(([id]) => id === params.get("section"))
    ? params.get("section")
    : "overview";
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
  const { startDemoSession } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const empty = scenario === "empty";
  const users = empty ? [] : state.users;
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
    setParams(id === "overview" ? {} : { section: id });
    setSearch("");
    setFilter("All");
  }
  function open(value) {
    setError("");
    setDialog(value);
  }
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const action = {
      ...dialog,
      reason: String(form.get("reason") || "").trim(),
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
    };
    if (dialog.type === "create")
      action.value = {
        name: String(form.get("name")).trim(),
        email: String(form.get("email")).trim(),
        committee: form.get("committee"),
      };
    if (!action.reason) {
      setError("A decision reason is required.");
      return;
    }
    if (
      dialog.type === "create" &&
      state.users.some(
        (u) => u.email?.toLowerCase() === action.value.email.toLowerCase(),
      )
    ) {
      setError("This demo email is already assigned.");
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
    <div className="admin-center">
      <a className="ac-skip" href="#admin-content">
        {t("Skip to control center")}
      </a>
      <aside className="ac-sidebar">
        <Link to="/projects" className="ac-brand">
          <img src={logo} alt={t("MIU anniversary logo")} />
          <b>
            {t("MIU Freelance")}
            <small>{t("Administration workspace")}</small>
          </b>
        </Link>
        <p className="ac-eyebrow">{t("PLATFORM CONTROL")}</p>
        <nav aria-label={t("Super Admin sections")}>
          {sections.map(([id, label, Icon]) => (
            <button
              key={id}
              aria-current={id === section ? "page" : undefined}
              onClick={() => go(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {t(label)}
            </button>
          ))}
        </nav>
        <div className="ac-trust">
          <ShieldCheck size={22} />
          <h3>{t("Accountable by design")}</h3>
          <p>
            {t("Every demo decision includes a reason and an audit record.")}
          </p>
        </div>
        <Link className="ac-back" to="/">
          {t("Demo session controls ↗")}
        </Link>
      </aside>
      <div className="ac-workspace">
        <header className="ac-topbar">
          <span>
            {t("Administration")} <span aria-hidden="true">/</span>{" "}
            <b>{title}</b>
          </span>
          <span className="ac-account">
            <span className="ac-avatar">{t("SA")}</span>
            {t("Super Admin")} <Badge>{t("Frontend demo")}</Badge>
          </span>
        </header>
        <main id="admin-content" className="ac-main">
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
              "Fictional records · EGP only · No real verification, AI, payments or escrow. Changes reset when you leave this workspace.",
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
                        users.filter((u) => u.accountStatus === "active")
                          .length,
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
                      <article className="ac-panel ac-stat" key={label}>
                        <div>
                          {t(label)}
                          <Icon size={18} aria-hidden="true" />
                        </div>
                        <strong>{value}</strong>
                        <small>{t(caption)}</small>
                      </article>
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
                            onClick={() => {
                              go("committees");
                            }}
                          >
                            {t("Inspect workspace")} <ArrowUpRight size={15} />
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
                  subtitle="Manage fictional student and client accounts; committee accounts remain separate."
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
                    subtitle="Opening a committee demo switches the simulated account. Committee screens are currently routing placeholders; use session controls to return as Super Admin."
                  >
                    <div className="ac-committee-grid ac-padded">
                      {committees.map((c) => (
                        <article className="ac-committee" key={c.id}>
                          <h3>{c.name}</h3>
                          <p>{c.description}</p>
                          <button
                            onClick={() => {
                              startTransition(() => {
                                startDemoSession(c.account);
                                navigate(`/committee/${c.id}`);
                              });
                            }}
                          >
                            {t("Open")} {c.name} {t("demo ↗")}
                          </button>
                        </article>
                      ))}
                    </div>
                  </Panel>
                  <Panel
                    title={t("Provisioned committee accounts")}
                    subtitle="No public registration. New records are display-only and cannot log in."
                  >
                    <DataTable
                      rows={users.filter((u) => u.role.endsWith("committee"))}
                      columns={[
                        { key: "displayName", label: "Member" },
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
                    subtitle="Session-only events. Actor, target, reason, timestamp and before/after values are recorded together."
                  >
                    <DataTable
                      rows={empty ? [] : state.audit}
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
        </main>
      </div>
      {dialog && (
        <AdminDialog
          title={t(
            dialog.type === "create"
              ? t("Create committee account")
              : t("Record administrative decision"),
          )}
          close={() => setDialog(null)}
        >
          <form onSubmit={submit}>
            {dialog.type === "create" ? (
              <>
                <p>
                  {t(
                    "Fictional account only. No credentials or activation email will be generated.",
                  )}
                </p>
                <label>
                  {t("Member name")}
                  <input name="name" required maxLength={80} />
                </label>
                <label>
                  {t("Demo email")}
                  <input name="email" type="email" required maxLength={160} />
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
                      {["Approved", "Rejected", "Resubmission requested"].map(
                        (s) => (
                          <option key={s}>{s}</option>
                        ),
                      )}
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
              <button className="ac-primary">{t("Confirm demo change")}</button>
            </div>
          </form>
        </AdminDialog>
      )}
    </div>
  );
}
