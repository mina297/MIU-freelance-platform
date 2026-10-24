import { useState, useSyncExternalStore } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { orderStore } from "../../orders/orderStore.js";
import { projectStore } from "../../projects/projectStore.js";
import { getProjectById } from "../../marketplace/selectors.js";
import { reviewStore, reviewClientAllowed } from "../reviewStore.js";
import { getStudentProfileById } from "../../profiles/utils/getStudentProfile.js";
import Button from "../../../components/ui/Button.jsx";
import Select from "../../../components/ui/Select.jsx";
import Textarea from "../../../components/ui/Textarea.jsx";
import ReviewSubjectSummary from "./ReviewSubjectSummary.jsx";
import StarRatingInput from "./StarRatingInput.jsx";

export default function ReviewForm({
  defaultStudentId,
  defaultOrderId = "",
  onSuccess,
  onViewReview,
  onCancel,
}) {
  const { session } = useAuth();
  useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  useSyncExternalStore(
    reviewStore.subscribe,
    reviewStore.getSnapshot,
    reviewStore.getSnapshot,
  );
  useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const eligible = reviewStore.eligibleOrders(session, defaultStudentId);
  const [orderId, setOrderId] = useState(defaultOrderId);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const selectedId = orderId || eligible[0]?.id || "";
  const order = eligible.find(({ id }) => id === selectedId);
  const title = (record) =>
    record.serviceTerms?.serviceTitle ??
    getProjectById(record.sourceId)?.title ??
    `Completed ${record.sourceType} order (${record.id})`;
  const subject = order && getStudentProfileById(order.studentId)?.profile;
  if (!reviewClientAllowed(session))
    return (
      <p role="alert">
        An active client session is required to leave a review.
      </p>
    );
  if (submitted && submitted.reviewerClientId === session.user.id)
    return (
      <section className="space-y-4" role="status">
        <h2 className="text-xl font-semibold">Review submitted</h2>
        <p>
          Saved in memory for this preview only. Refresh clears this review.
        </p>
        <p>{submitted.body}</p>
        {onViewReview && (
          <Button onClick={() => onViewReview(submitted)}>View review</Button>
        )}
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        )}
      </section>
    );
  if (!eligible.length)
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          No completed orders available to review
        </h2>
        <p>
          Only your completed, unreviewed orders are eligible. Awaiting-payment
          and active orders cannot be reviewed.
        </p>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        )}
      </section>
    );
  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const result = reviewStore.submit(
          { orderId: selectedId, rating, body },
          session,
          defaultStudentId,
        );
        setErrors(result.errors ?? {});
        if (result.ok) {
          setSubmitted(result.review);
          onSuccess?.(result.review);
        }
      }}
    >
      <p className="text-sm text-miu-red">
        Simulated Phase 1 review · Reviewing as {session.user.displayName}
      </p>
      <h2 className="text-xl font-semibold">Leave a review</h2>
      <Select
        label="Completed order"
        value={selectedId}
        error={errors.orderId}
        onChange={(event) => {
          setOrderId(event.target.value);
          setErrors({});
        }}
      >
        <option value="" disabled>
          Choose a completed order
        </option>
        {eligible.map((record) => (
          <option key={record.id} value={record.id}>
            {title(record)}
          </option>
        ))}
      </Select>
      <ReviewSubjectSummary
        student={subject}
        order={order ? { ...order, title: title(order) } : null}
      />
      <StarRatingInput
        value={rating}
        onChange={setRating}
        error={errors.rating}
      />
      <Textarea
        label="Written feedback"
        rows={5}
        maxLength={800}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        error={errors.body}
        required
        helperText="20–800 characters. Use fictional feedback only."
      />
      <div className="flex flex-wrap gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Submit review</Button>
      </div>
    </form>
  );
}
