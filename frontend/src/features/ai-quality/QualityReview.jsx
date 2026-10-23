import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function QualityReview({ report, onAction }) {
  const actionable = ["Open", "In review"].includes(report.status);
  return (
    <Card
      as="section"
      className="aq-review"
      aria-labelledby="quality-review-title"
    >
      <div className="aq-review-heading">
        <div>
          <p className="aq-eyebrow">HUMAN REVIEW</p>
          <h2 id="quality-review-title">{report.title}</h2>
          <p>
            {report.id} · {formatDate(report.date)}
          </p>
        </div>
        <Badge variant={report.status === "Resolved" ? "success" : "warning"}>
          {report.status}
        </Badge>
      </div>
      <dl className="aq-facts">
        <div>
          <dt>Area</dt>
          <dd>{report.service}</dd>
        </div>
        <div>
          <dt>Issue type</dt>
          <dd>{report.category}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{report.priority}</dd>
        </div>
        <div>
          <dt>Assigned reviewer</dt>
          <dd>{report.assignee || "Unassigned"}</dd>
        </div>
      </dl>
      <div className="aq-output">
        <h3>Sample input</h3>
        <p>{report.input}</p>
        <h3>Flagged or reported output · simulated</h3>
        <blockquote>{report.output}</blockquote>
      </div>
      <div className="aq-guidance">
        <h3>Evaluation context</h3>
        <p>{report.expected}</p>
      </div>
      <p className="aq-boundary">
        Quality findings do not change recommendations, publish model updates,
        hide content, or approve financial/account actions.
      </p>
      <section className="aq-history">
        <h3>Review history</h3>
        {report.history.length ? (
          <ol>
            {report.history.map((event) => (
              <li key={event.id}>
                <b>
                  {event.action} · {event.after}
                </b>
                <p>{event.reason}</p>
                {event.destination && (
                  <p>Escalation destination: {event.destination}</p>
                )}
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
          <p>No findings recorded yet.</p>
        )}
      </section>
      {actionable ? (
        <div className="aq-actions">
          {!report.assignee && (
            <Button variant="outline" onClick={() => onAction("assign")}>
              Assign to demo reviewer
            </Button>
          )}
          <Button onClick={() => onAction("finding")}>Record finding</Button>
          <Button variant="outline" onClick={() => onAction("escalate")}>
            Escalate issue
          </Button>
        </div>
      ) : (
        <p className="aq-boundary">
          Read-only:{" "}
          {report.status === "Escalated"
            ? "awaiting the authorized destination’s review"
            : "quality finding recorded"}
          . No external action was performed.
        </p>
      )}
    </Card>
  );
}
