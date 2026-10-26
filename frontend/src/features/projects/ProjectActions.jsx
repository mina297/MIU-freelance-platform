import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useId, useRef, useState } from "react";
import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { projectStore } from "./projectStore.js";

export default function ProjectActions({ project, session }) {
  const { t } = useLanguage();

  const [action, setAction] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const keepButton = useRef(null);
  const feedback = useRef(null);
  const helpId = useId();
  useEffect(() => {
    if (notice && !action) feedback.current?.focus();
  }, [notice, action]);
  if (project.status === "draft") return null;
  const closeError = projectStore.transitionError(project.id, session, "close");
  const cancelError = projectStore.transitionError(
    project.id,
    session,
    "cancel",
  );
  const closing = action === "close";
  function dismiss() {
    setAction(null);
    setError("");
  }
  function confirm() {
    const result = projectStore.transition(project.id, session, action);
    if (!result.ok) {
      setError(result.errors.session);
      return;
    }
    setNotice(
      closing
        ? "Project closed — simulation. New proposals are no longer accepted."
        : "Project cancelled — simulation. No money moved and no notifications were sent.",
    );
    dismiss();
  }
  return (
    <div className="project-create__lifecycle">
      <p ref={feedback} role="status" tabIndex={-1}>
        {t(notice)}
      </p>
      {project.status !== "cancelled" && (
        <>
          <div className="project-create__lifecycle-buttons">
            {project.status === "open" && (
              <Button
                variant="outline"
                disabled={Boolean(closeError)}
                aria-describedby={closeError ? helpId : undefined}
                aria-label={t("Close project: {value0}", {
                  value0: project.title,
                })}
                onClick={() => {
                  setNotice("");
                  setAction("close");
                }}
              >
                {t("Close project")}
              </Button>
            )}
            <Button
              variant="outline"
              disabled={Boolean(cancelError)}
              aria-describedby={cancelError ? helpId : undefined}
              aria-label={t("Cancel project: {value0}", {
                value0: project.title,
              })}
              onClick={() => {
                setNotice("");
                setAction("cancel");
              }}
            >
              {t("Cancel project")}
            </Button>
          </div>
          {cancelError && (
            <p id={helpId} className="project-create__action-help">
              {cancelError}
            </p>
          )}
        </>
      )}
      <Modal
        open={Boolean(action)}
        onClose={dismiss}
        title={t(
          closing ? t("Close this project?") : t("Cancel this project?"),
        )}
        description={t(
          closing
            ? t(
                "This stops new proposals. The brief stays available by its direct link.",
              )
            : t(
                "This marks the project as cancelled and stops new proposals. Reopening is not supported in this demo.",
              ),
        )}
        initialFocusRef={keepButton}
        className="project-create__dialog"
        actions={
          <>
            <Button ref={keepButton} variant="outline" onClick={dismiss}>
              {t("Keep project unchanged")}
            </Button>
            <Button
              variant={closing ? "primary" : "destructive"}
              onClick={confirm}
            >
              {closing ? t("Confirm close") : t("Confirm cancellation")}
            </Button>
          </>
        }
      >
        <p className="font-semibold">{project.title}</p>
        <p className="mt-3 text-sm">
          {t(
            "Phase 1 simulation. Existing proposals are retained. No notifications, refunds, or payments are processed. Changes reset on refresh.",
          )}
        </p>
        {error && (
          <p className="project-create__alert mt-4" role="alert">
            {t(error)}
          </p>
        )}
      </Modal>
    </div>
  );
}
