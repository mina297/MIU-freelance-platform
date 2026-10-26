import { useLanguage } from "../../i18n/LanguageContext.js";
import ReviewForm from "./components/ReviewForm.jsx";

/** Standalone leave-a-review page (`/reviews/new`). */
export default function NewReviewPage({
  clientId = "client_001",
  studentId,
  orderId,
  onBack,
  onSuccess,
  onViewReview,
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-surface-page">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-[var(--theme-accent,var(--color-miu-red))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            {t("← Back")}
          </button>
        ) : null}

        <ReviewForm
          defaultClientId={clientId}
          defaultStudentId={studentId}
          defaultOrderId={orderId}
          onCancel={onBack}
          onSuccess={onSuccess}
          onViewReview={onViewReview}
        />
      </div>
    </div>
  );
}
