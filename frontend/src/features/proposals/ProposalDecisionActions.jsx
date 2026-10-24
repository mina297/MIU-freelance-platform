import { useRef, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { proposalStore } from "./proposalStore.js";
import { studentName } from "./clientProposalModel.js";
import { clientEligibility } from "../projects/projectCreation.js";
import { formatEGP } from "../../utils/formatEGP.js";

export default function ProposalDecisionActions({
  proposal,
  project,
  session,
  onResult,
}) {
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState("");
  const keepButton = useRef(null);
  const eligible =
    project.status === "open" &&
    ["submitted", "shortlisted"].includes(proposal.status);
  const accepting = decision === "accept";
  function dismiss() {
    setDecision(null);
    setError("");
  }
  function confirm() {
    const result = proposalStore.decide(proposal.id, session, decision);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dismiss();
    onResult(result);
  }
  return (
    <>
      {eligible && (
        <div className="client-proposals__decisions">
          <Button
            disabled={Boolean(clientEligibility(session, true))}
            onClick={() => setDecision("accept")}
          >
            Accept offer
          </Button>
          <Button variant="outline" onClick={() => setDecision("reject")}>
            Reject offer
          </Button>
        </div>
      )}
      <Modal
        open={Boolean(decision)}
        onClose={dismiss}
        initialFocusRef={keepButton}
        title={accepting ? "Accept this offer?" : "Reject this offer?"}
        description={
          accepting
            ? "Select this proposal and create an order awaiting payment in the demo. Other proposals keep their current statuses."
            : "Mark this proposal as rejected in the demo. This cannot be undone in the current preview."
        }
        className="project-create__dialog"
        actions={
          <>
            <Button ref={keepButton} variant="outline" onClick={dismiss}>
              Keep proposal unchanged
            </Button>
            <Button
              variant={accepting ? "primary" : "destructive"}
              onClick={confirm}
            >
              {accepting ? "Confirm demo acceptance" : "Confirm rejection"}
            </Button>
          </>
        }
      >
        <p className="font-semibold">{studentName(proposal.studentId)}</p>
        <p className="mt-3">
          {formatEGP(proposal.priceEGP)} · {proposal.deliveryDays} days delivery
        </p>
        <p className="mt-3 text-sm">
          Simulation only. No notifications, payments or escrow funding occur.
          Changes reset on refresh.
        </p>
        {error && (
          <p role="alert" className="project-create__alert mt-4">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
