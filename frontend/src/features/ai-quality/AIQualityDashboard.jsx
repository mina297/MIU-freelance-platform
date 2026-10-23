import { useEffect, useReducer, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  ClipboardCheck,
  Flag,
  Gauge,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card from "../../components/ui/Card.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Modal from "../../components/ui/Modal.jsx";
import QualityReview from "./QualityReview.jsx";
import {
  createQualityState,
  evaluations,
  filterQualityReports,
  qualityReducer,
  qualityServices,
  qualityStatuses,
  qualitySummary,
} from "./qualityModel.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./quality.css";

const navigation = [
  ["All", "Quality overview", Activity],
  ["Matching", "Skills matching", Sparkles],
  ["Chatbot", "Chatbot quality", MessageSquare],
  ["Moderation", "Moderation flags", Flag],
];
export default function AIQualityDashboard() {
  const [state, dispatch] = useReducer(
    qualityReducer,
    undefined,
    createQualityState,
  );
  const [params, setParams] = useSearchParams();
  const service = ["All", ...qualityServices].includes(params.get("area"))
    ? params.get("area")
    : "All";
  const status = ["All", ...qualityStatuses].includes(params.get("status"))
    ? params.get("status")
    : "All";
  const [query, setQuery] = useState("");
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [outcome, setOutcome] = useState("In review");
  const [destination, setDestination] = useState("Super Admin");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const reports = scenario === "empty" ? [] : state.reports;
  const sampleRows =
    scenario === "empty"
      ? []
      : evaluations.filter((e) => service === "All" || e.service === service);
  const rows = filterQualityReports(reports, { service, status, query });
  const selected = rows.find((r) => r.id === params.get("report")) || rows[0];
  const summary = qualitySummary(
    filterQualityReports(reports, { service }),
    sampleRows,
  );
  const tableState = !loaded
    ? "loading"
    : scenario === "error"
      ? "error"
      : "ready";
  function changeArea(area) {
    setParams(area === "All" ? {} : { area });
    setQuery("");
  }
  function clear() {
    setQuery("");
    setParams({ area: service });
  }
  function open(type) {
    setAction(type);
    setReason("");
    setOutcome("In review");
    setDestination("Super Admin");
    setError("");
  }
  function submit(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setError("Enter a review note or escalation reason.");
      return;
    }
    dispatch({
      type: action,
      reportId: selected.id,
      outcome,
      destination,
      reason,
      actor: "Demo AI Quality Reviewer",
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
    });
    const nextStatus =
      action === "assign"
        ? "In review"
        : action === "escalate"
          ? "Escalated"
          : outcome;
    setParams({ area: service, status: nextStatus, report: selected.id });
    setNotice(
      `${selected.id}: ${nextStatus}. Review event recorded in this demo only.`,
    );
    setAction(null);
  }
  return (
    <div className="ai-quality-dashboard">
      <a className="aq-skip" href="#quality-content">
        Skip to quality dashboard
      </a>
      <aside className="aq-sidebar">
        <Link className="aq-brand" to="/projects">
          <img src={logo} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>Committee workspace</small>
          </span>
        </Link>
        <p className="aq-eyebrow">AI & QUALITY COMMITTEE</p>
        <nav aria-label="Quality monitoring areas">
          {navigation.map(([id, label, Icon]) => (
            <button
              key={id}
              aria-current={service === id ? "page" : undefined}
              onClick={() => changeArea(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <div className="aq-trust">
          <ShieldCheck size={24} aria-hidden="true" />
          <h2>Human judgment first</h2>
          <p>
            Document findings. Escalate consequential decisions to the
            authorized team.
          </p>
        </div>
        <Link className="aq-session" to="/">
          Demo session controls ↗
        </Link>
      </aside>
      <div className="aq-workspace">
        <header className="aq-topbar">
          <span>
            Committee / <b>AI & Quality</b>
          </span>
          <Badge variant="info">Frontend demonstration</Badge>
        </header>
        <main id="quality-content" className="aq-main">
          <div className="aq-page-heading">
            <div>
              <p className="aq-eyebrow">
                RELIABILITY · FAIRNESS · HUMAN OVERSIGHT
              </p>
              <h1>AI & Quality Dashboard</h1>
              <p>
                Understand the signals. Investigate the failures. Record the
                human review.
              </p>
            </div>
            <span className="aq-reviewer">
              <ClipboardCheck size={19} aria-hidden="true" /> Demo quality
              reviewer
            </span>
          </div>
          <p className="aq-disclosure">
            Fictional evaluation samples and outputs only. No live AI inference,
            provider telemetry, private messages or enforcement. Changes reset
            on reload.
          </p>
          <div className="aq-stats">
            {[
              [
                "Evaluated samples",
                summary.total,
                "Fixed fictional evaluation set",
                Gauge,
              ],
              [
                "Observed error rate",
                summary.errorRate,
                `${summary.errors} failed checks / ${summary.total} samples`,
                Activity,
              ],
              [
                "Moderation reports",
                summary.flagged,
                "False-positive and false-negative cases",
                Flag,
              ],
              [
                "Open reviews",
                summary.open,
                "Open or in-review reports",
                ClipboardCheck,
              ],
            ].map(([label, value, description, Icon]) => (
              <StatCard
                key={label}
                label={label}
                value={value}
                description={description}
                icon={<Icon size={19} />}
                state={tableState}
                onRetry={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
              />
            ))}
          </div>
          <p className="aq-notice" role="status">
            {notice}
          </p>
          <DataTable
            caption="Evaluation results"
            description="Illustrative human-reference checks · 23 Oct 2026. Error rate = failed checks ÷ evaluated samples. These are not validated production metrics or deployment thresholds."
            state={tableState}
            onRetry={() => {
              setLoaded(false);
              setScenario("sample");
            }}
            rows={sampleRows}
            emptyTitle="No evaluation samples"
            columns={[
              {
                id: "service",
                header: "Area",
                rowHeader: true,
                render: (e) => e.service,
              },
              {
                id: "criterion",
                header: "Check criterion",
                render: (e) => e.criterion,
              },
              { id: "samples", header: "Samples", render: (e) => e.samples },
              {
                id: "errors",
                header: "Failed checks",
                render: (e) => e.errors,
              },
              {
                id: "rate",
                header: "Error rate",
                render: (e) => `${((e.errors / e.samples) * 100).toFixed(1)}%`,
              },
              {
                id: "result",
                header: "Result",
                render: () => <Badge variant="warning">Human follow-up</Badge>,
              },
            ]}
          />
          <Card className="aq-method">
            <ShieldCheck size={22} aria-hidden="true" />
            <p>
              Future evaluation must examine unfair outcomes and failure
              handling before automated results affect access or visibility.
              This small fictional set does not establish fairness, model
              accuracy or production readiness.
            </p>
          </Card>
          <div className="aq-review-layout">
            <div className="aq-queue">
              <DataTable
                caption="Review queue & flagged outputs"
                description="Select a report to compare its sample output with the evaluation context."
                state={tableState}
                onRetry={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
                rows={rows}
                emptyTitle="No matching quality reports"
                emptyDescription="Try another area, status or search term."
                onEmptyAction={clear}
                toolbar={
                  <div className="aq-filters">
                    <Input
                      label="Search report or reference"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Select
                      label="Review status"
                      value={status}
                      onChange={(e) =>
                        setParams({ area: service, status: e.target.value })
                      }
                    >
                      {["All", ...qualityStatuses].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                    <Button variant="ghost" onClick={clear}>
                      Clear filters
                    </Button>
                  </div>
                }
                columns={[
                  {
                    id: "title",
                    header: "Report",
                    rowHeader: true,
                    render: (r) => (
                      <div>
                        <b>{r.title}</b>
                        <small className="aq-subtext">
                          {r.service} · {r.category}
                        </small>
                      </div>
                    ),
                  },
                  {
                    id: "priority",
                    header: "Priority",
                    render: (r) => r.priority,
                  },
                  {
                    id: "status",
                    header: "Status",
                    render: (r) => (
                      <Badge
                        variant={
                          r.status === "Resolved" ? "success" : "warning"
                        }
                      >
                        {r.status}
                      </Badge>
                    ),
                  },
                  {
                    id: "action",
                    header: "Review",
                    render: (r) => (
                      <Button
                        variant="ghost"
                        aria-label={`Review ${r.id}`}
                        aria-pressed={r.id === selected?.id}
                        onClick={() =>
                          setParams({ area: service, status, report: r.id })
                        }
                      >
                        Review →
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
            {tableState === "ready" && selected && (
              <QualityReview report={selected} onAction={open} />
            )}
          </div>
          <footer className="aq-footer">
            <span>© 2026 MIU Freelance · AI & Quality Committee</span>
            <details>
              <summary>Demo preview states</summary>
              <Select
                label="Data scenario"
                value={scenario}
                onChange={(e) => {
                  setLoaded(false);
                  setScenario(e.target.value);
                  setAction(null);
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
        title={
          action === "assign"
            ? "Assign quality review"
            : action === "escalate"
              ? "Escalate quality issue"
              : "Record quality finding"
        }
        description={`Fictional report ${selected?.id || ""}. No model, account, content or financial action is performed.`}
      >
        <form className="aq-review-form" onSubmit={submit}>
          {action === "assign" && (
            <p>
              Assign to Demo AI Quality Reviewer, a fictional provisioned
              committee reviewer.
            </p>
          )}
          {action === "finding" && (
            <Select
              label="Review outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            >
              <option>In review</option>
              <option>Resolved</option>
            </Select>
          )}
          {action === "escalate" && (
            <Select
              label="Escalation destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option>Super Admin</option>
              {selected?.service === "Moderation" && (
                <option>Marketplace Operations</option>
              )}
            </Select>
          )}
          <Textarea
            label={
              action === "escalate"
                ? "Escalation reason"
                : "Review finding or assignment reason"
            }
            required
            maxLength={1500}
            value={reason}
            error={error}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
          <div className="aq-actions">
            <Button variant="outline" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button type="submit">Confirm demo review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
