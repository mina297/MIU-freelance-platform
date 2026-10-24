import { FileText, ShieldAlert } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
export default function SupportCaseDetails({ record, onAction, onEvidence }) {
  const active = ["Open", "In review"].includes(record.status);
  return (
    <Card
      as="section"
      className="sdc-case-details"
      aria-labelledby="support-case-title"
    >
      <div className="sdc-case-heading">
        <div>
          <p className="sdc-eyebrow">CASE WORKSPACE</p>
          <h2 id="support-case-title">{record.title}</h2>
          <p>
            {record.id} · {formatDate(record.submitted)}
          </p>
        </div>
        <Badge variant={record.status === "Resolved" ? "success" : "warning"}>
          {record.status}
        </Badge>
      </div>
      <dl className="sdc-case-meta">
        {[
          ["Requester", record.requester],
          ["Assigned agent", record.assignee || "Unassigned"],
          ["Case type", record.type],
          ["Priority", record.priority],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="sdc-case-summary">{record.summary}</p>
      {record.order && (
        <section className="sdc-order-context">
          <h3>Related order & transaction</h3>
          <b>{record.order.title}</b>
          <dl className="sdc-case-meta">
            {[
              ["Order", record.order.id],
              ["Marketplace", record.order.source],
              ["Client", record.order.client],
              ["Student", record.order.student],
              ["Order status", record.order.status],
              ["Agreed amount", formatEGP(record.order.amountEGP)],
              [
                "Transaction reference",
                record.order.transaction || "No financial exception linked",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {record.financial && (
        <div className="sdc-financial-boundary">
          <ShieldAlert size={20} aria-hidden="true" />
          <p>
            Financial decision required. Escalate to Finance or Super Admin.
            Support cannot approve refunds, release escrow, or change payout
            status.
          </p>
        </div>
      )}
      <section className="sdc-evidence">
        <h3>Evidence references</h3>
        {record.evidence.length ? (
          record.evidence.map((evidence) => (
            <Button
              key={evidence.id}
              variant="outline"
              onClick={() => onEvidence(evidence)}
            >
              <FileText size={16} aria-hidden="true" />
              {evidence.name}
            </Button>
          ))
        ) : (
          <p>No evidence attached to this fictional case.</p>
        )}
        <small>
          Text placeholders only. No real attachments or identity documents.
        </small>
      </section>
      <section className="sdc-conversation">
        <h3>Conversation sample</h3>
        <ol>
          {record.messages.map((message) => (
            <li key={message.id}>
              <b>{message.sender}</b>
              <p>{message.text}</p>
              <small>
                {new Date(message.timestamp).toLocaleString("en-GB", {
                  timeZone: "Africa/Cairo",
                })}
              </small>
            </li>
          ))}
        </ol>
        <p>Fictional excerpts only. This preview does not send messages.</p>
      </section>
      <section className="sdc-case-history">
        <h3>Case notes & decisions</h3>
        {record.history.length ? (
          <ol>
            {record.history.map((event) => (
              <li key={event.id}>
                <b>
                  {event.action} · {event.after}
                </b>
                <p>{event.reason}</p>
                {event.action === "priority" && (
                  <p>
                    Priority: {event.priorityBefore} → {event.priorityAfter}
                  </p>
                )}
                {event.destination && <p>Destination: {event.destination}</p>}
                <small>
                  {event.actor} ·{" "}
                  <time dateTime={event.timestamp}>
                    {new Date(event.timestamp).toLocaleString("en-GB", {
                      timeZone: "Africa/Cairo",
                    })}
                  </time>
                </small>
              </li>
            ))}
          </ol>
        ) : (
          <p>No internal notes recorded yet.</p>
        )}
      </section>
      {active ? (
        <div className="sdc-case-actions">
          {!record.assignee && (
            <Button variant="outline" onClick={() => onAction("assign")}>
              Assign to demo agent
            </Button>
          )}
          <Button variant="outline" onClick={() => onAction("note")}>
            Add internal note
          </Button>
          <Button variant="outline" onClick={() => onAction("priority")}>
            Change priority
          </Button>
          {!record.financial && (
            <Button onClick={() => onAction("resolve")}>Resolve case</Button>
          )}
          <Button variant="outline" onClick={() => onAction("escalate")}>
            Escalate case
          </Button>
        </div>
      ) : (
        <p className="sdc-readonly">
          Read-only:{" "}
          {record.status === "Escalated"
            ? "awaiting the authorized team’s decision"
            : "a resolution has been recorded"}
          . No external action was performed.
        </p>
      )}
    </Card>
  );
}
