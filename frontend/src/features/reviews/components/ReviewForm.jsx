import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  getEligibleOrdersForReview,
  getOrderById,
} from "../../../data/fixtures/reviews.js";
import { clientProfiles, studentProfiles } from "../../../data/fixtures/profiles.js";
import { validateReviewForm } from "../utils/validateReview.js";
import {
  loadSubmittedReviews,
  saveSubmittedReview,
} from "../utils/reviewStorage.js";
import ReviewSubjectSummary from "./ReviewSubjectSummary.jsx";
import StarRatingInput from "./StarRatingInput.jsx";

/** Leave-a-review form shared by the page and the modal. */
export default function ReviewForm({
  defaultClientId = "client_001",
  defaultStudentId,
  defaultOrderId = "",
  onSuccess,
  onViewReview,
  onCancel,
}) {
  const eligibleOrders = useMemo(() => {
    const submittedIds = new Set(
      loadSubmittedReviews().map((r) => r.relatedOrderId).filter(Boolean),
    );
    return getEligibleOrdersForReview({
      clientId: defaultClientId,
      studentId: defaultStudentId,
    }).filter((order) => !submittedIds.has(order.id));
  }, [defaultClientId, defaultStudentId]);

  const [orderId, setOrderId] = useState(
    defaultOrderId || eligibleOrders[0]?.id || "",
  );
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [submittedReview, setSubmittedReview] = useState(null);

  const selectedOrder = orderId ? getOrderById(orderId) : null;
  const student = selectedOrder
    ? studentProfiles.find((s) => s.id === selectedOrder.studentId)
    : null;
  const client = clientProfiles.find((c) => c.id === defaultClientId);

  const scopedStudent = defaultStudentId
    ? studentProfiles.find((entry) => entry.id === defaultStudentId)
    : null;

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validateReviewForm({ rating, body, orderId });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    if (!selectedOrder || !student || !client) {
      setSubmitError(
        "That completed project is no longer available to review. Please choose another or close this form.",
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");
    window.setTimeout(() => {
      try {
        const review = saveSubmittedReview({
          id: `review_sim_${Date.now()}`,
          targetStudentId: selectedOrder.studentId,
          reviewerClientId: client.id,
          reviewerName: client.displayName,
          reviewerOrganization: client.organizationName,
          reviewerInitials: client.displayName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          rating,
          createdAt: new Date().toISOString().slice(0, 10),
          body: body.trim(),
          jobLabel: selectedOrder.title,
          relatedOrderId: selectedOrder.id,
          simulated: true,
        });
        setSubmittedReview(review);
        setStatus("success");
        onSuccess?.(review);
      } catch {
        setSubmitError("Could not save the simulated review. Try again.");
        setStatus("error");
      }
    }, 350);
  }

  if (status === "success" && submittedReview) {
    const reviewedStudent =
      studentProfiles.find((s) => s.id === submittedReview.targetStudentId) ??
      student;
    return (
      <div
        className="space-y-5 rounded-[10px] border border-success/25 bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-6"
        role="status"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-miu-black">
            Review submitted
          </h2>
          <p className="max-w-md text-sm text-[#4b5563]">
            Thank you for reviewing{" "}
            <span className="font-semibold text-miu-black">
              {reviewedStudent?.displayName ?? "this student"}
            </span>
            . Your feedback is saved in this browser session only (Phase 1
            simulation) and will appear on their Reviews tab.
          </p>
        </div>

        <ReviewSubjectSummary
          student={reviewedStudent}
          order={{
            title: submittedReview.jobLabel,
            completedAt: selectedOrder?.completedAt,
          }}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <button
              type="button"
              className="h-11 rounded-full border border-[#e5e7eb] px-5 text-sm font-semibold text-miu-black hover:bg-[#f8f8f9]"
              onClick={onCancel}
            >
              Close
            </button>
          ) : null}
          {typeof onViewReview === "function" ? (
            <button
              type="button"
              className="h-11 rounded-full bg-miu-red px-5 text-sm font-semibold text-white hover:bg-miu-red-dark"
              onClick={() => onViewReview(submittedReview)}
            >
              View review
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (eligibleOrders.length === 0) {
    return (
      <div className="space-y-4 rounded-[10px] border border-dashed border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-miu-black">
          No projects left to review
        </h2>
        <p className="text-sm leading-relaxed text-[#4b5563]">
          {scopedStudent
            ? `You have already reviewed every completed project with ${scopedStudent.displayName} that is available in this demo, or there are no completed projects waiting for feedback.`
            : "You have already reviewed every completed project available in this demo, or there are no completed projects waiting for feedback right now."}
        </p>
        <p className="text-sm text-[#4b5563]">
          Each completed project can receive one review. When another order is
          marked complete, it will appear here.
        </p>
        {onCancel ? (
          <button
            type="button"
            className="h-11 rounded-full border border-[#e5e7eb] px-5 text-sm font-semibold text-miu-black hover:bg-[#f8f8f9]"
            onClick={onCancel}
          >
            Close
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-[10px] border border-[#e5e7eb] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
          Simulated Phase 1 workflow
        </p>
        <h2 className="mt-1 text-xl font-semibold text-miu-black">
          Leave a review
        </h2>
        <p className="mt-1 text-sm text-[#4b5563]">
          Reviewing as {client?.displayName ?? "Client"}
          {client?.organizationName ? ` · ${client.organizationName}` : ""}.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="review-order"
          className="text-sm font-semibold text-miu-black"
        >
          Completed project
        </label>
        <select
          id="review-order"
          className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-miu-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        >
          {eligibleOrders.map((order) => {
            const s = studentProfiles.find((p) => p.id === order.studentId);
            return (
              <option key={order.id} value={order.id}>
                {order.title}
                {s ? ` — ${s.displayName}` : ""}
              </option>
            );
          })}
        </select>
        {errors.orderId ? (
          <p className="text-sm text-danger" role="alert">
            {errors.orderId}
          </p>
        ) : null}
      </div>

      <ReviewSubjectSummary student={student} order={selectedOrder} />

      <StarRatingInput
        value={rating}
        onChange={setRating}
        error={errors.rating}
        disabled={status === "submitting"}
      />

      <div className="space-y-2">
        <label
          htmlFor="review-body"
          className="text-sm font-semibold text-miu-black"
        >
          Written feedback
        </label>
        <textarea
          id="review-body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-miu-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          placeholder="Share what went well and what could improve…"
          disabled={status === "submitting"}
        />
        <p className="text-xs text-[#4b5563]">{body.trim().length}/800</p>
        {errors.body ? (
          <p className="text-sm text-danger" role="alert">
            {errors.body}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="text-sm text-danger" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            className="h-11 rounded-full border border-[#e5e7eb] px-5 text-sm font-semibold text-miu-black"
            onClick={onCancel}
            disabled={status === "submitting"}
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="h-11 rounded-full bg-miu-red px-5 text-sm font-semibold text-white hover:bg-miu-red-dark disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
