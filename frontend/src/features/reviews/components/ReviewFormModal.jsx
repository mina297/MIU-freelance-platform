import { useLanguage } from "../../../i18n/LanguageContext.js";
import Modal from "../../../components/ui/Modal.jsx";
import ReviewForm from "./ReviewForm.jsx";
export default function ReviewFormModal({
  open,
  onClose,
  defaultStudentId,
  defaultOrderId,
  onSuccess,
  onViewReview,
}) {
  const { t } = useLanguage();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("Leave a review")}
      closeOnBackdrop
    >
      {open && (
        <ReviewForm
          key={`${defaultStudentId ?? "any"}:${defaultOrderId ?? "pick"}`}
          defaultStudentId={defaultStudentId}
          defaultOrderId={defaultOrderId}
          onCancel={onClose}
          onSuccess={onSuccess}
          onViewReview={
            onViewReview
              ? (review) => {
                  onViewReview(review);
                  onClose();
                }
              : undefined
          }
        />
      )}
    </Modal>
  );
}
