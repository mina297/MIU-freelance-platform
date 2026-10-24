import { useEffect, useReducer, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
  History,
  Landmark,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import {
  financeOrders,
  financeTransactions,
  financeSummary,
  filterTransactions,
  createFinanceReviewState,
  financeReviewReducer,
} from "./financeModel.js";
import TransactionDetails from "./TransactionDetails.jsx";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./finance.css";

const sections = [
  ["overview", "Financial overview", Landmark],
  ["transactions", "Transaction history", History],
  ["escrow", "Escrow balances", ShieldCheck],
  ["payouts", "Payouts & refunds", ArrowUpRight],
  ["fees", "Revenue & fees", Receipt],
  ["pending", "Pending financial reviews", ClipboardCheck],
];
export default function FinanceDashboard() {
  const [params, setParams] = useSearchParams();
  const section = sections.some(([id]) => id === params.get("section"))
    ? params.get("section")
    : "overview";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [reviews, dispatch] = useReducer(
    financeReviewReducer,
    undefined,
    createFinanceReviewState,
  );
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [scenario]);
  const transactions = scenario === "empty" ? [] : financeTransactions;
  const summary = financeSummary(transactions);
  const tableState = !loaded
    ? "loading"
    : scenario === "error"
      ? "error"
      : "ready";
  const selected = transactions.find((t) => t.id === params.get("transaction"));
  const scoped = transactions.filter((t) =>
    section === "payouts"
      ? ["Payout", "Refund"].includes(t.type)
      : section === "fees"
        ? t.type === "Fee"
        : section === "pending"
          ? ["Pending", "Failed"].includes(t.status)
          : true,
  );
  const rows = filterTransactions(scoped, { query, status, type }).toSorted(
    (a, b) => b.timestamp.localeCompare(a.timestamp),
  );
  function go(id) {
    setParams(id === "overview" ? {} : { section: id });
    setQuery("");
    setStatus("All");
    setType("All");
  }
  function clear() {
    setQuery("");
    setStatus("All");
    setType("All");
  }
  function select(transaction) {
    setParams({ section, transaction: transaction.id });
  }
  function close() {
    setParams(section === "overview" ? {} : { section });
    setAction(null);
  }
  function openAction(value) {
    setAction(value);
    setReason("");
    setError("");
  }
  function retry() {
    setLoaded(false);
    setScenario("sample");
  }
  function submit(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setError("Enter a financial review reason.");
      return;
    }
    dispatch({
      type: action,
      transactionId: selected.id,
      reason,
      actor: "Demo Finance Reviewer",
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
    setNotice(
      `${selected.id}: ${action === "escalate" ? "escalation recorded for Super Admin" : "review note recorded"}. No funds moved and payment status is unchanged.`,
    );
    setAction(null);
  }
  const columns = [
    {
      id: "reference",
      header: "Transaction / order",
      rowHeader: true,
      render: (t) => (
        <div>
          <b>{t.id}</b>
          <small className="fd-subtext">
            {financeOrders.find((o) => o.id === t.orderId).title}
          </small>
        </div>
      ),
    },
    { id: "type", header: "Type", render: (t) => t.type },
    {
      id: "amount",
      header: "Amount (EGP)",
      render: (t) => formatEGP(t.amountMinor / 100),
    },
    {
      id: "status",
      header: "Payment status",
      render: (t) => (
        <Badge
          variant={
            t.status === "Completed"
              ? "success"
              : t.status === "Failed"
                ? "danger"
                : "warning"
          }
        >
          {t.status}
        </Badge>
      ),
    },
    {
      id: "date",
      header: "Date",
      render: (t) => (
        <time dateTime={t.timestamp}>{formatDate(t.timestamp)}</time>
      ),
    },
    {
      id: "view",
      header: "Review",
      render: (t) => (
        <Button
          variant="ghost"
          aria-label={`View ${t.id}`}
          onClick={() => select(t)}
        >
          View →
        </Button>
      ),
    },
  ];
  const toolbar = (
    <div className="fd-filters">
      <Input
        type="search"
        label="Search reference, order or participant"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Select
        label="Payment status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {["All", "Completed", "Pending", "Failed"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Select>
      {["overview", "transactions", "pending", "payouts"].includes(section) && (
        <Select
          label="Transaction type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {["All", "Funding", "Payout", "Refund", "Fee"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      )}
      <Button variant="ghost" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
  return (
    <div className="finance-dashboard">
      <a className="fd-skip" href="#finance-content">
        Skip to finance dashboard
      </a>
      <aside className="fd-sidebar">
        <Link className="fd-brand" to="/projects">
          <img src={logo} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>Committee workspace</small>
          </span>
        </Link>
        <p className="fd-eyebrow">FINANCE COMMITTEE</p>
        <nav aria-label="Finance sections">
          {sections.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <div className="fd-trust">
          <ShieldCheck size={24} aria-hidden="true" />
          <h2>Every amount accounted for</h2>
          <p>
            Review financial records and document exceptions without moving real
            funds.
          </p>
        </div>
        <Link className="fd-session" to="/">
          Demo session controls ↗
        </Link>
      </aside>
      <div className="fd-workspace">
        <header className="fd-topbar">
          <span>
            Committee / <b>Finance</b>
          </span>
          <Badge variant="info">EGP · Frontend simulation</Badge>
        </header>
        <main id="finance-content" className="fd-main">
          <div className="fd-page-heading">
            <div>
              <p className="fd-eyebrow">PAYMENTS · ESCROW · ACCOUNTABILITY</p>
              <h1>Finance Dashboard</h1>
              <p>
                A clear view of platform finances, with a traceable review for
                every exception.
              </p>
            </div>
            <span className="fd-reviewer">
              <Wallet size={20} aria-hidden="true" /> Demo Finance Reviewer
            </span>
          </div>
          <p className="fd-disclosure">
            Fictional EGP ledger only. No payment provider, real funds, live
            escrow or bank details. Changes reset on reload.
          </p>
          <div className="fd-stats">
            {[
              [
                "Completed funding",
                summary.funding,
                "All completed funding in demo ledger",
                ArrowDownLeft,
              ],
              [
                "Escrow held",
                summary.held,
                "Funding less settled payouts, fees and refunds",
                ShieldCheck,
              ],
              [
                "Completed payouts",
                summary.payouts,
                "Settled fictional student payouts",
                ArrowUpRight,
              ],
              [
                "Platform revenue",
                summary.revenue,
                "Recorded completed fees only · not net profit",
                Receipt,
              ],
            ].map(([label, amount, description, Icon]) => (
              <StatCard
                key={label}
                label={label}
                value={formatEGP(amount / 100)}
                description={description}
                icon={<Icon size={19} />}
                state={tableState}
                onRetry={retry}
              />
            ))}
          </div>
          <p className="fd-notice" role="status">
            {notice}
          </p>
          {["overview", "payouts", "fees", "pending"].includes(section) && (
            <Card className="fd-pending-summary">
              <div>
                <h2>Pending amounts · not settled</h2>
                <p>
                  Requests are not deducted from escrow until a completed ledger
                  event exists.
                </p>
              </div>
              <dl>
                {[
                  ["Payouts", summary.pendingPayouts],
                  ["Refunds", summary.pendingRefunds],
                  ["Fees", summary.pendingFees],
                ].map(([label, amount]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {tableState === "ready"
                        ? formatEGP(amount / 100)
                        : "Unavailable"}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
          {section === "escrow" ? (
            <DataTable
              caption="Escrow balances by order"
              description="Derived from completed demo ledger events; includes both project and service orders. Disputed and release-pending labels are illustrative stages, not authority to release funds."
              rows={scenario === "empty" ? [] : financeOrders}
              state={tableState}
              onRetry={retry}
              emptyTitle="No escrow records"
              columns={[
                {
                  id: "order",
                  header: "Order",
                  rowHeader: true,
                  render: (o) => (
                    <div>
                      <b>{o.title}</b>
                      <small className="fd-subtext">
                        {o.id} · {o.source}
                      </small>
                    </div>
                  ),
                },
                {
                  id: "stage",
                  header: "Stage",
                  render: (o) => <Badge>{o.stage}</Badge>,
                },
                {
                  id: "balance",
                  header: "Held amount",
                  render: (o) =>
                    formatEGP(
                      financeSummary(
                        transactions.filter((t) => t.orderId === o.id),
                      ).held / 100,
                    ),
                },
                {
                  id: "events",
                  header: "Order events",
                  render: (o) => (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        go("transactions");
                        setQuery(o.id);
                      }}
                    >
                      View ledger →
                    </Button>
                  ),
                },
              ]}
            />
          ) : (
            <DataTable
              caption={
                section === "pending"
                  ? "Pending financial actions & exceptions"
                  : section === "payouts"
                    ? "Payouts & refunds"
                    : section === "fees"
                      ? "Platform revenue & fee records"
                      : "Transaction history"
              }
              description={
                section === "pending"
                  ? "Review pending requests and failed events. Record notes or escalate; no approval or transfer capability is implied."
                  : section === "fees"
                    ? "Illustrative fee amounts only. No platform commission rate, tax or fee policy is assumed."
                    : "Fictional project and service payment events. Pending/failed amounts are excluded from settled totals."
              }
              state={tableState}
              onRetry={retry}
              toolbar={toolbar}
              rows={rows}
              emptyTitle="No matching transactions"
              emptyDescription="Try another search, payment status or transaction type."
              onEmptyAction={clear}
              columns={
                section === "pending"
                  ? [
                      ...columns.slice(0, 4),
                      {
                        id: "reviewState",
                        header: "Review status",
                        render: (t) => (
                          <Badge>{reviews.reviews[t.id] || "Unreviewed"}</Badge>
                        ),
                      },
                      columns[5],
                    ]
                  : columns
              }
            />
          )}
          {section === "overview" && (
            <Card className="fd-reconciliation">
              <ShieldCheck size={22} aria-hidden="true" />
              <div>
                <h2>Ledger reconciliation</h2>
                <p>
                  {tableState === "ready"
                    ? `${formatEGP(summary.funding / 100)} funding = ${formatEGP(summary.held / 100)} held + ${formatEGP(summary.payouts / 100)} payouts + ${formatEGP(summary.revenue / 100)} recorded fees + ${formatEGP(summary.refunds / 100)} refunds.`
                    : "Reconciliation unavailable while the ledger is loading or unavailable."}
                </p>
                <small>
                  Figures describe available demo records only. No all-time
                  platform totals, available bank balance or custody claim.
                </small>
              </div>
            </Card>
          )}
          <footer className="fd-footer">
            <span>© 2026 MIU Freelance · Finance Committee</span>
            <details>
              <summary>Demo preview states</summary>
              <Select
                label="Data scenario"
                value={scenario}
                onChange={(e) => {
                  setLoaded(false);
                  setScenario(e.target.value);
                  close();
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
        open={!!selected && !action && tableState === "ready"}
        onClose={close}
        title="Transaction details"
        description="Fictional financial record and related order history."
      >
        {selected && (
          <TransactionDetails
            transaction={selected}
            transactions={transactions}
            reviews={reviews}
            onAction={openAction}
          />
        )}
      </Modal>
      <Modal
        open={!!action}
        onClose={() => setAction(null)}
        title={
          action === "escalate"
            ? "Escalate financial exception"
            : "Record financial review"
        }
        description={`${selected?.id || ""} · This records a local review only. Financial authorization thresholds remain undecided.`}
      >
        <form className="fd-review-form" onSubmit={submit}>
          {action === "escalate" && (
            <p>Destination: Super Admin. No message is sent.</p>
          )}
          <Textarea
            label="Review reason"
            required
            maxLength={1500}
            value={reason}
            error={error}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
          <div className="fd-actions">
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
