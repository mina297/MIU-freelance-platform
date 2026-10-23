import { useEffect, useReducer, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ClipboardCheck,
  FileClock,
  History,
  ShieldCheck,
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
import VerificationDetails from "./VerificationDetails.jsx";
import {
  createVerificationState,
  filterVerificationCases,
  verificationReducer,
  verificationStatuses,
} from "./verificationModel.js";
import { formatDate } from "../../utils/formatDate.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./verification.css";

export default function VerificationDashboard() {
  const [state, dispatch] = useReducer(
    verificationReducer,
    undefined,
    createVerificationState,
  );
  const [params, setParams] = useSearchParams();
  const status = ["All", ...verificationStatuses].includes(params.get("status"))
    ? params.get("status")
    : "Pending";
  const [query, setQuery] = useState("");
  const [affiliation, setAffiliation] = useState("All");
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const cases = scenario === "empty" ? [] : state.cases;
  const rows = filterVerificationCases(cases, { status, query, affiliation });
  const selected = rows.find((c) => c.id === params.get("case")) || rows[0];
  function setStatus(value) {
    setParams(value === "Pending" ? {} : { status: value });
  }
  function clear() {
    setQuery("");
    setAffiliation("All");
    setStatus("All");
  }
  function decide(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setError("Enter a reason for this decision.");
      return;
    }
    dispatch({
      type: "decide",
      caseId: selected.id,
      outcome,
      reason,
      actor: "Demo Verification Reviewer",
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
    setNotice(
      `${selected.name}: ${outcome}. Decision and reason recorded in this demo only.`,
    );
    setParams({ status: outcome, case: selected.id });
    setOutcome(null);
    setReason("");
  }
  const tableState = !loaded
    ? "loading"
    : scenario === "error"
      ? "error"
      : "ready";
  return (
    <div className="verification-dashboard">
      <a href="#verification-content" className="vd-skip">
        Skip to verification queue
      </a>
      <aside className="vd-sidebar">
        <Link to="/projects" className="vd-brand">
          <img src={logo} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>Committee workspace</small>
          </span>
        </Link>
        <p className="vd-eyebrow">VERIFICATION COMMITTEE</p>
        <nav aria-label="Verification queues">
          {[
            "Pending",
            "All",
            "Approved",
            "Rejected",
            "Resubmission Requested",
            "Escalated",
          ].map((label) => (
            <button
              key={label}
              aria-current={status === label ? "page" : undefined}
              onClick={() => setStatus(label)}
            >
              <ClipboardCheck size={17} aria-hidden="true" />
              <span>{label === "All" ? "All submissions" : label}</span>
              <span className="vd-count">
                {label === "All"
                  ? cases.length
                  : cases.filter((c) => c.status === label).length}
              </span>
            </button>
          ))}
        </nav>
        <div className="vd-trust">
          <ShieldCheck size={24} aria-hidden="true" />
          <h2>Privacy comes first</h2>
          <p>Review only the evidence needed for a verification decision.</p>
        </div>
        <Link to="/" className="vd-session">
          Demo session controls ↗
        </Link>
      </aside>
      <div className="vd-workspace">
        <header className="vd-topbar">
          <span>
            Committee / <b>Verification</b>
          </span>
          <Badge variant="info">Frontend demonstration</Badge>
        </header>
        <main id="verification-content" className="vd-main">
          <div className="vd-page-heading">
            <div>
              <p className="vd-eyebrow">TRUST & IDENTITY</p>
              <h1>Verification Dashboard</h1>
              <p>
                Review submissions thoughtfully. Keep every decision
                accountable.
              </p>
            </div>
            <span className="vd-avatar">
              <UsersRound size={20} aria-hidden="true" /> Demo reviewer
            </span>
          </div>
          <p className="vd-disclosure">
            Fictional submissions and evidence placeholders. No real identity
            verification, camera access, biometric processing or user
            notifications. Changes reset on reload.
          </p>
          <div className="vd-stats">
            {[
              ["Awaiting review", "Pending", FileClock],
              ["Approved", "Approved", ShieldCheck],
              ["Resubmission requested", "Resubmission Requested", History],
              ["Escalated", "Escalated", ClipboardCheck],
            ].map(([label, value, Icon]) => (
              <StatCard
                key={value}
                label={label}
                value={cases.filter((c) => c.status === value).length}
                description="Available fictional submissions"
                icon={<Icon size={19} />}
                state={tableState}
                onRetry={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
              />
            ))}
          </div>
          <p role="status" className="vd-notice">
            {notice}
          </p>
          <div className="vd-review-layout">
            <div className="vd-queue">
              <DataTable
                caption="Verification queue"
                description={`${rows.length} matching submissions · select a record to review its evidence and history.`}
                state={tableState}
                onRetry={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
                emptyTitle="No matching submissions"
                emptyDescription="Choose another queue or clear the search and affiliation filters."
                onEmptyAction={clear}
                toolbar={
                  <div className="vd-filters">
                    <Input
                      label="Search name or reference"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Select
                      label="Affiliation"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                    >
                      {["All", "MIU", "External"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </Select>
                    <Button variant="ghost" onClick={clear}>
                      Clear filters
                    </Button>
                  </div>
                }
                rows={rows}
                columns={[
                  {
                    id: "applicant",
                    header: "Applicant",
                    rowHeader: true,
                    render: (c) => (
                      <div>
                        <b>{c.name}</b>
                        <small className="vd-subtext">
                          {c.role} · {c.document}
                        </small>
                      </div>
                    ),
                  },
                  {
                    id: "submitted",
                    header: "Submitted",
                    render: (c) => (
                      <time dateTime={c.submitted}>
                        {formatDate(c.submitted)}
                      </time>
                    ),
                  },
                  {
                    id: "status",
                    header: "Status",
                    render: (c) => (
                      <Badge
                        variant={
                          c.status === "Approved"
                            ? "success"
                            : c.status === "Rejected"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {c.status}
                      </Badge>
                    ),
                  },
                  {
                    id: "action",
                    header: "Review",
                    render: (c) => (
                      <Button
                        variant="ghost"
                        aria-pressed={selected?.id === c.id}
                        aria-label={`Review ${c.name}`}
                        onClick={() => setParams({ status, case: c.id })}
                      >
                        Review →
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
            {tableState === "ready" && selected && (
              <VerificationDetails
                record={selected}
                onDecision={(value) => {
                  setOutcome(value);
                  setReason("");
                  setError("");
                }}
              />
            )}
          </div>
          <footer className="vd-footer">
            <span>© 2026 MIU Freelance · Verification Committee</span>
            <details>
              <summary>Demo preview states</summary>
              <Select
                label="Data scenario"
                value={scenario}
                onChange={(e) => {
                  setOutcome(null);
                  setLoaded(false);
                  setScenario(e.target.value);
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
        open={!!outcome}
        onClose={() => setOutcome(null)}
        title={`Confirm: ${outcome || "decision"}`}
        description={`Record a simulated decision for ${selected?.name || "this submission"}. No real account status or notification is changed.`}
      >
        <form onSubmit={decide} className="vd-decision-form">
          <Textarea
            label="Decision reason"
            required
            value={reason}
            maxLength={1000}
            error={error}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
          <div className="vd-decision-actions">
            <Button variant="outline" onClick={() => setOutcome(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={outcome === "Rejected" ? "destructive" : "primary"}
            >
              Confirm decision
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
