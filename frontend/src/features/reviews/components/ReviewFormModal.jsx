import { useEffect } from "react";
import ReviewForm from "./ReviewForm.jsx";

/** Modal wrapper around ReviewForm. Also exported as LeaveReviewModal. */
export default function ReviewFormModal({
  open,
  onClose,
  defaultClientId,
  defaultStudentId,
  defaultOrderId,
  onSuccess,
  onViewReview,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[12px] bg-[#f8f8f9] p-1 shadow-xl sm:max-w-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sr-only" id="review-modal-title">
          Leave a review
        </div>
        <ReviewForm
          key={`${defaultClientId ?? "client"}-${defaultStudentId ?? "any"}-${defaultOrderId ?? "pick"}-${open}`}
          defaultClientId={defaultClientId}
          defaultStudentId={defaultStudentId}
          defaultOrderId={defaultOrderId}
          onCancel={onClose}
          onSuccess={onSuccess}
          onViewReview={(review) => {
            onViewReview?.(review);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
