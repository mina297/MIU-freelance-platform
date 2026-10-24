import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { proposalStore } from "./proposalStore.js";

export default function StudentProposalActions({
  proposal,
  projectTitle,
  session,
  onWithdraw,
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const keepButton = useRef(null);
  const editError = proposalStore.studentActionError(
    proposal.id,
    session,
    "edit",
  );
  const withdrawError = proposalStore.studentActionError(
    proposal.id,
    session,
    "withdraw",
  );
  function dismiss() {
    setOpen(false);
    setError("");
  }
  function confirm() {
    const result = proposalStore.withdraw(proposal.id, session);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dismiss();
    onWithdraw();
  }
  return (
    <div className="student-proposals__actions">
      <div className="project-create__success-links">
        {!editError && (
          <Link to={`/student/proposals/${proposal.id}/edit`}>
            Edit proposal
          </Link>
        )}
        {!withdrawError && (
          <Button variant="outline" onClick={() => setOpen(true)}>
            Withdraw proposal
          </Button>
        )}
      </div>
      {(withdrawError || editError) && (
        <p className="project-create__action-help">
          {withdrawError ?? editError}
        </p>
      )}
      <Modal
        open={open}
        onClose={dismiss}
        initialFocusRef={keepButton}
        title="Withdraw this proposal?"
        description="The client will see it as withdrawn. Resubmission and undo are not supported in this demo."
        className="project-create__dialog"
        actions={
          <>
            <Button ref={keepButton} variant="outline" onClick={dismiss}>
              Keep proposal unchanged
            </Button>
            <Button variant="destructive" onClick={confirm}>
              Confirm withdrawal
            </Button>
          </>
        }
      >
        <p className="font-semibold">{projectTitle}</p>
        <p className="mt-3 text-sm">
          Simulation only. No notification is sent. Your record remains visible
          and resets to fixture state on refresh.
        </p>
        {error && (
          <p role="alert" className="project-create__alert mt-4">
            {error}
          </p>
        )}
      </Modal>
    </div>
  );
}
