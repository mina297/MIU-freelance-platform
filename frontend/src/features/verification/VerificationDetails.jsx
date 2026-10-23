import { FileCheck2, ScanFace, ShieldAlert } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function VerificationDetails({ record, onDecision }) {
  return (
    <Card
      as="section"
      className="vd-details"
      aria-labelledby="verification-details-title"
    >
      <div className="vd-section-heading">
        <div>
          <p className="vd-eyebrow">SUBMISSION DETAILS</p>
          <h2 id="verification-details-title">{record.name}</h2>
          <p>{record.id}</p>
        </div>
        <Badge>{record.status}</Badge>
      </div>
      <dl className="vd-meta">
        {[
          ["Account type", record.role],
          ["Affiliation", record.affiliation],
          ["Document category", record.document],
          ["Submitted", formatDate(record.submitted)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="vd-context">{record.context}</p>
      <section
        className="vd-evidence"
        aria-labelledby="verification-evidence-title"
      >
        <h3 id="verification-evidence-title">Document & capture review</h3>
        <div className="vd-placeholder">
          <ScanFace size={36} aria-hidden="true" />
          <strong>Fictional evidence preview</strong>
          <p>{record.capture}</p>
          <span>
            <FileCheck2 size={17} aria-hidden="true" /> {record.document} ·
            sample category only
          </span>
        </div>
        <p className="vd-hint">
          No real document, face image, ID number or biometric data is stored or
          displayed.
        </p>
      </section>
      <div className="vd-signals">
        <ShieldAlert size={20} aria-hidden="true" />
        <div>
          <h3>Review signals · simulated</h3>
          <p>{record.signal}</p>
          <p>
            Liveness and face matching are not performed. A visual match does
            not prove MIU affiliation.
          </p>
        </div>
      </div>
      <section className="vd-history">
        <h3>Decision history</h3>
        {record.history.length ? (
          <ol>
            {record.history.map((event) => (
              <li key={event.id}>
                <b>{event.after}</b>
                <p>{event.reason}</p>
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
          <p>No decisions recorded for this submission.</p>
        )}
      </section>
      {record.status === "Pending" ? (
        <div className="vd-decision-actions">
          <Button onClick={() => onDecision("Approved")}>Approve</Button>
          <Button variant="destructive" onClick={() => onDecision("Rejected")}>
            Reject
          </Button>
          <Button
            variant="outline"
            onClick={() => onDecision("Resubmission Requested")}
          >
            Request resubmission
          </Button>
        </div>
      ) : (
        <p className="vd-readonly">
          Read-only{" "}
          {record.status === "Escalated"
            ? "while authorized escalation review is pending"
            : "until a new submission is received"}
          . This preview cannot fabricate a resubmission.
        </p>
      )}
    </Card>
  );
}
