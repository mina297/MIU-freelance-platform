import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { financeOrders, financeSummary } from "./financeModel.js";

export default function TransactionDetails({
  transaction,
  transactions,
  reviews,
  onAction,
}) {
  const order = financeOrders.find((o) => o.id === transaction.orderId);
  const events = transactions
    .filter((t) => t.orderId === order.id)
    .toSorted((a, b) => a.timestamp.localeCompare(b.timestamp));
  const balance = financeSummary(events).held;
  return (
    <div className="fd-detail">
      <div className="fd-detail-amount">
        <strong>{formatEGP(transaction.amountMinor / 100)}</strong>
        <Badge
          variant={
            transaction.status === "Failed"
              ? "danger"
              : transaction.status === "Completed"
                ? "success"
                : "warning"
          }
        >
          {transaction.status}
        </Badge>
      </div>
      <dl className="fd-meta">
        {[
          ["Transaction", transaction.id],
          ["Event type", transaction.type],
          ["Order", order.id],
          ["Marketplace", order.source],
          ["Client", order.client],
          ["Student", order.student],
          ["Provider reference", `DEMO-${transaction.id}`],
          [
            "Timestamp (Cairo)",
            new Date(transaction.timestamp).toLocaleString("en-GB", {
              timeZone: "Africa/Cairo",
            }),
          ],
          ["Order stage", order.stage],
          ["Current order escrow", formatEGP(balance / 100)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="fd-context">{order.title}</p>
      {transaction.note && <p className="fd-warning">{transaction.note}</p>}
      <section className="fd-timeline">
        <h3>Related order events</h3>
        <p>Pending and failed events do not change held balances.</p>
        <ol>
          {events.map((event) => (
            <li key={event.id}>
              <b>
                {event.type} · {event.status} ·{" "}
                {formatEGP(event.amountMinor / 100)}
              </b>
              <small>
                {new Date(event.timestamp).toLocaleString("en-GB", {
                  timeZone: "Africa/Cairo",
                })}{" "}
                · {event.id}
              </small>
            </li>
          ))}
        </ol>
      </section>
      <section className="fd-history">
        <h3>Financial review history</h3>
        {reviews.audit.filter((e) => e.transactionId === transaction.id)
          .length ? (
          <ol>
            {reviews.audit
              .filter((e) => e.transactionId === transaction.id)
              .map((event) => (
                <li key={event.id}>
                  <b>
                    {event.after}
                    {event.destination ? ` → ${event.destination}` : ""}
                  </b>
                  <p>{event.reason}</p>
                  <small>
                    {event.actor} ·{" "}
                    {new Date(event.timestamp).toLocaleString("en-GB", {
                      timeZone: "Africa/Cairo",
                    })}
                  </small>
                </li>
              ))}
          </ol>
        ) : (
          <p>No review notes yet.</p>
        )}
      </section>
      {["Pending", "Failed"].includes(transaction.status) &&
        reviews.reviews[transaction.id] !== "Escalated" && (
          <div className="fd-actions">
            <Button onClick={() => onAction("review")}>Record review</Button>
            <Button variant="outline" onClick={() => onAction("escalate")}>
              Escalate to Super Admin
            </Button>
          </div>
        )}
      <p className="fd-boundary">
        Demo only. Review notes do not approve, pay, refund, release escrow or
        contact a payment provider.
      </p>
    </div>
  );
}
