import { useEffect, useReducer, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ClipboardList,
  Headphones,
  MessagesSquare,
  Scale,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Modal from "../../components/ui/Modal.jsx";
import SupportCaseDetails from "./SupportCaseDetails.jsx";
import {
  createSupportState,
  filterSupportCases,
  supportAgent,
  supportPriorities,
  supportReducer,
  supportStatuses,
  supportSummary,
  supportTypes,
} from "./supportModel.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./support.css";

const areas = [
  ["All", "All cases", ClipboardList],
  ["Ticket", "Support tickets", Headphones],
  ["Complaint", "Customer complaints", MessagesSquare],
  ["Dispute", "Disputes", Scale],
];
const actionTitles = {
  assign: "Assign case",
  note: "Add internal case note",
  priority: "Change case priority",
  resolve: "Resolve nonfinancial case",
  escalate: "Escalate case",
};
export default function SupportDisputesDashboard() {
  const [state, dispatch] = useReducer(
    supportReducer,
    undefined,
    createSupportState,
  );
  const [params, setParams] = useSearchParams();
  const type = ["All", ...supportTypes].includes(params.get("type"))
    ? params.get("type")
    : "All";
  const status = ["All", ...supportStatuses].includes(params.get("status"))
    ? params.get("status")
    : "All";
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [newPriority, setNewPriority] = useState("Normal");
  const [destination, setDestination] = useState("Super Admin");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [evidence, setEvidence] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const cases = scenario === "empty" ? [] : state.cases;
  const rows = filterSupportCases(cases, { type, status, query, priority });
  const selected = rows.find((c) => c.id === params.get("case")) || rows[0];
  const summary = supportSummary(filterSupportCases(cases, { type }));
  const tableState = !loaded
    ? "loading"
    : scenario === "error"
      ? "error"
      : "ready";
  function changeType(value) {
    setParams(value === "All" ? {} : { type: value });
    setQuery("");
    setPriority("All");
  }
  function clear() {
    setQuery("");
    setPriority("All");
    setParams({ type });
  }
  function retry() {
    setLoaded(false);
    setScenario("sample");
  }
  function open(value) {
    setAction(value);
    setReason("");
    setNewPriority(selected.priority);
    setDestination(selected.financial ? "Finance" : "Super Admin");
    setError("");
  }
  function submit(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setError("Enter a case note or decision reason.");
      return;
    }
    if (action === "priority" && newPriority === selected.priority) {
      setError("Choose a different priority.");
      return;
    }
    dispatch({
      type: action,
      caseId: selected.id,
      reason,
      priority: newPriority,
      destination,
      actor: supportAgent,
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
    const nextStatus =
      action === "assign"
        ? "In review"
        : action === "resolve"
          ? "Resolved"
          : action === "escalate"
            ? "Escalated"
            : selected.status;
    setParams({ type, status: nextStatus, case: selected.id });
    setPriority("All");
    setAction(null);
    setNotice(
      `${selected.id}: ${actionTitles[action]} recorded in this demo. No message or financial action was sent.`,
    );
  }
  return (
    <div className="support-dashboard">
      <a className="sdc-skip" href="#support-content">
        Skip to support dashboard
      </a>
      <aside className="sdc-sidebar">
        <Link to="/projects" className="sdc-brand">
          <img src={logo} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>Committee workspace</small>
          </span>
        </Link>
        <p className="sdc-eyebrow">SUPPORT & DISPUTES COMMITTEE</p>
        <nav aria-label="Support case queues">
          {areas.map(([id, label, Icon]) => (
            <button
              key={id}
              aria-current={type === id ? "page" : undefined}
              onClick={() => changeType(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <div className="sdc-trust">
          <ShieldCheck size={24} aria-hidden="true" />
          <h2>A fair path forward</h2>
          <p>
            Review both sides. Document the evidence. Escalate decisions outside
            your authority.
          </p>
        </div>
        <Link to="/" className="sdc-session">
          Demo session controls ↗
        </Link>
      </aside>
      <div className="sdc-workspace">
        <header className="sdc-topbar">
          <span>
            Committee / <b>Support & Disputes</b>
          </span>
          <Badge variant="info">Frontend demonstration</Badge>
        </header>
        <main id="support-content" className="sdc-main">
          <div className="sdc-page-heading">
            <div>
              <p className="sdc-eyebrow">
                CASEWORK · EVIDENCE · ACCOUNTABILITY
              </p>
              <h1>Support & Disputes Dashboard</h1>
              <p>
                Help people move forward, with context and a clear record of
                every decision.
              </p>
            </div>
            <span className="sdc-reviewer">
              <Headphones size={20} aria-hidden="true" /> Demo support agent
            </span>
          </div>
          <p className="sdc-disclosure">
            Fictional cases, conversation samples and text-only evidence. No
            messages, uploads, payment actions or real customer data. Changes
            reset on reload.
          </p>
          <div className="sdc-stats">
            {[
              [
                "Active cases",
                summary.active,
                "Open and in-review records",
                ClipboardList,
              ],
              [
                "Active disputes",
                summary.disputes,
                "Disputes awaiting local review",
                Scale,
              ],
              [
                "High priority",
                summary.high,
                "Active cases marked high",
                AlertTriangle,
              ],
              [
                "Unassigned",
                summary.unassigned,
                "Active cases without an agent",
                UsersRound,
              ],
            ].map(([label, value, description, Icon]) => (
              <StatCard
                key={label}
                label={label}
                value={value}
                description={description}
                icon={<Icon size={19} />}
                state={tableState}
                onRetry={retry}
              />
            ))}
          </div>
          <p role="status" className="sdc-notice">
            {notice}
          </p>
          <div className="sdc-review-layout">
            <div className="sdc-queue">
              <DataTable
                caption="Support case queue"
                description="Search the available fictional records; select a case to review its context, evidence and notes."
                state={tableState}
                onRetry={retry}
                rows={rows}
                emptyTitle="No matching support cases"
                emptyDescription="Try another queue, search, status or priority."
                onEmptyAction={clear}
                toolbar={
                  <div className="sdc-filters">
                    <Input
                      label="Search case, requester or reference"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Select
                      label="Case status"
                      value={status}
                      onChange={(e) =>
                        setParams({ type, status: e.target.value })
                      }
                    >
                      {["All", ...supportStatuses].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                    <Select
                      label="Priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {["All", ...supportPriorities].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </Select>
                    <Button variant="ghost" onClick={clear}>
                      Clear filters
                    </Button>
                  </div>
                }
                columns={[
                  {
                    id: "case",
                    header: "Case / requester",
                    rowHeader: true,
                    render: (c) => (
                      <div>
                        <b>{c.title}</b>
                        <small className="sdc-subtext">
                          {c.requester} · {c.type}
                        </small>
                        <small className="sdc-subtext">
                          Agent: {c.assignee || "Unassigned"}
                        </small>
                      </div>
                    ),
                  },
                  {
                    id: "priority",
                    header: "Priority",
                    render: (c) => (
                      <Badge
                        variant={c.priority === "High" ? "danger" : "neutral"}
                      >
                        {c.priority}
                      </Badge>
                    ),
                  },
                  {
                    id: "status",
                    header: "Status",
                    render: (c) => (
                      <Badge
                        variant={
                          c.status === "Resolved" ? "success" : "warning"
                        }
                      >
                        {c.status}
                      </Badge>
                    ),
                  },
                  {
                    id: "review",
                    header: "Review",
                    render: (c) => (
                      <Button
                        variant="ghost"
                        aria-label={`Review ${c.id}`}
                        aria-pressed={selected?.id === c.id}
                        onClick={() => setParams({ type, status, case: c.id })}
                      >
                        Review →
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
            {tableState === "ready" && selected && (
              <SupportCaseDetails
                record={selected}
                onAction={open}
                onEvidence={setEvidence}
              />
            )}
          </div>
          <footer className="sdc-footer">
            <span>© 2026 MIU Freelance · Support & Disputes Committee</span>
            <details>
              <summary>Demo preview states</summary>
              <Select
                label="Data scenario"
                value={scenario}
                onChange={(e) => {
                  setLoaded(false);
                  setScenario(e.target.value);
                  setAction(null);
                  setEvidence(null);
                }}
              >
                {["sample", "empty", "error"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </details>
          </footer>
        </main>
      </div>
      <Modal
        open={!!action}
        onClose={() => setAction(null)}
        title={actionTitles[action] || "Case review"}
        description={`Fictional case ${selected?.id || ""}. Every change requires a note; no real user or financial action is performed.`}
      >
        <form onSubmit={submit} className="sdc-action-form">
          {action === "assign" && (
            <p>
              <UserRoundCheck size={18} aria-hidden="true" /> Assign to{" "}
              {supportAgent}, a fictional provisioned committee agent.
            </p>
          )}
          {action === "priority" && (
            <Select
              label="New priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              {supportPriorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          )}
          {action === "escalate" && (
            <Select
              label="Escalation destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {selected?.financial && <option>Finance</option>}
              <option>Super Admin</option>
            </Select>
          )}
          {action === "resolve" && (
            <p>
              Record the nonfinancial resolution and close the local case.
              Financial disputes require escalation.
            </p>
          )}
          <Textarea
            label={action === "note" ? "Internal note" : "Decision reason"}
            required
            value={reason}
            error={error}
            maxLength={1500}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
          <div className="sdc-case-actions">
            <Button variant="outline" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button type="submit">Confirm demo action</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={!!evidence}
        onClose={() => setEvidence(null)}
        title={evidence?.name || "Evidence preview"}
        description="Safe fictional text placeholder; no file is opened or downloaded."
      >
        <p className="sdc-evidence-text">{evidence?.detail}</p>
      </Modal>
    </div>
  );
}
