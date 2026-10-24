import { Check, Clock3, LockKeyhole } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import "./escrow-progress.css";

export default function EscrowProgress({ transaction }) {
  const funded = Boolean(transaction);
  return (
    <section className="ec-progress" aria-label="Service and escrow progress">
      <div className="ec-progress-title">
        <h3>{funded ? "Work is in progress" : "Your payment plan"}</h3>
        <span>{funded ? "50% funded" : "Awaiting initial payment"}</span>
      </div>
      <label className="ec-work-progress">
        Service completion <progress value={0} max={100} />
        0% · No delivery accepted
      </label>
      <ol>
        <li className={funded ? "is-done" : ""}>
          {funded ? (
            <Check size={17} aria-hidden="true" />
          ) : (
            <Clock3 size={17} aria-hidden="true" />
          )}
          <div>
            <b>Initial 50% {funded ? "held in escrow" : "due now"}</b>
            <small>
              {funded
                ? formatEGP(transaction.escrowHeldMinor / 100) +
                  " held; nothing released"
                : "Funds are held, not sent to the freelancer"}
            </small>
          </div>
        </li>
        <li aria-current={funded ? "step" : undefined}>
          <Clock3 size={17} aria-hidden="true" />
          <div>
            <b>Service delivery and client review</b>
            <small>
              {funded
                ? "In Progress · service is not yet complete"
                : "Work starts after initial funding"}
            </small>
          </div>
        </li>
        <li>
          <LockKeyhole size={17} aria-hidden="true" />
          <div>
            <b>Remaining balance and escrow release</b>
            <small>
              Separate future decisions after agreed conditions. No automatic
              charge or release.
            </small>
          </div>
        </li>
      </ol>
    </section>
  );
}
