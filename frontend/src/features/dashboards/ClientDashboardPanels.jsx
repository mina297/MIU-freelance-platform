import { useState } from "react";
import DashboardDialog from "./DashboardDialog.jsx";
import { asset } from "./clientDashboardAssets.js";
import { Icon, Badge } from "./ClientDashboardUi.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
export function ReviewForm({ job, close, submit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  return (
    <DashboardDialog
      title="Leave a review"
      close={close}
      className="cd-review-dialog"
    >
      <p>
        Tell the MIU community about your experience working with{" "}
        {job.student.split(" ")[0]}.
      </p>
      <div className="cd-reviewed-project">
        <div className="cd-person">
          {job.student === "Nour El-Sayed" ? (
            <img
              src={asset("reviewAvatar")}
              width="44"
              height="44"
              alt="Fictional student avatar"
            />
          ) : (
            <span className="cd-initials">SA</span>
          )}
          <div>
            <b>{job.student}</b>
            <small>
              {job.student === "Nour El-Sayed"
                ? "Graphic Design • Year 4"
                : "Student designer"}
            </small>
          </div>
        </div>
        <b>{job.title}</b>
        <div>
          <Badge status="Completed" />{" "}
          <small>{formatDate(job.completedOn, "en-GB")}</small>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
          }
          submit({ rating, comment: comment.trim() });
        }}
      >
        <fieldset>
          <legend>Your rating</legend>
          <div className="cd-stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                />
                <span aria-hidden="true">{value <= rating ? "★" : "☆"}</span>
                <span className="sr-only">{value} out of 5 stars</span>
              </label>
            ))}
          </div>
          <small>
            {rating} out of 5{rating === 5 ? " • Excellent" : ""}
          </small>
        </fieldset>
        <label htmlFor="review-comment">Comment (required)</label>
        <textarea
          id="review-comment"
          value={comment}
          aria-required="true"
          maxLength={2000}
          aria-invalid={!!error}
          aria-describedby="review-disclosure review-error"
          onChange={(event) => {
            setComment(event.target.value);
            setError("");
          }}
          placeholder="Share what went well and what could improve."
        />
        <small id="review-disclosure">
          Demo only. Your review stays in memory and is not published.
        </small>
        <p id="review-error" role="alert">
          {error}
        </p>
        <div className="cd-actions">
          <button
            type="button"
            className="sd-button sd-secondary"
            onClick={close}
          >
            Cancel
          </button>
          <button className="sd-button sd-primary">Submit review</button>
        </div>
      </form>
    </DashboardDialog>
  );
}

export function JobsTable({ jobs, openJob, filtered }) {
  return (
    <section className="sd-panel cd-jobs">
      <div className="sd-panel-heading">
        <h2>My Jobs</h2>
        <p>
          {filtered
            ? `${jobs.length} matching jobs`
            : "Your 4 most recent jobs • 24 posted in total"}
        </p>
      </div>
      {jobs.length ? (
        <>
          <div className="cd-table-head" aria-hidden="true">
            <span>Title</span>
            <span>Status</span>
            <span>Applicants count</span>
            <span>Deadline</span>
            <span />
          </div>
          {jobs.map((job) => (
            <article className="cd-job-row" key={job.id}>
              <div className="cd-job-title">
                <h3>{job.title}</h3>
                <small>{formatEGP(job.budget)} • Fixed budget</small>
              </div>
              <div className="cd-job-status">
                <Badge status={job.status} />
              </div>
              <div className="cd-job-applicants">
                <small className="cd-mobile-label">Applicants count</small>
                <b>{job.applicants} applicants</b>
                <small className={job.newApplicants ? "cd-red" : ""}>
                  {job.newApplicants
                    ? `${job.newApplicants} new`
                    : `${job.student} hired`}
                </small>
              </div>
              <div className="cd-job-deadline">
                <small className="cd-mobile-label">Deadline</small>
                <time dateTime={job.deadline}>
                  {formatDate(job.deadline, "en-GB")}
                </time>
              </div>
              <button
                className="sd-more"
                aria-label={`View job: ${job.title}`}
                onClick={() => openJob(job)}
              >
                <Icon name="more" />
              </button>
              <div className="cd-job-context">
                <span>{formatEGP(job.budget)} • Fixed budget</span>
                <span className={job.newApplicants ? "cd-red" : ""}>
                  {job.newApplicants
                    ? `${job.newApplicants} new`
                    : `${job.student} hired`}
                </span>
              </div>
            </article>
          ))}
          <div className="cd-table-footer">
            <span>Showing {jobs.length} available demo records</span>
            <span>1 of 1</span>
          </div>
        </>
      ) : (
        <div className="sd-empty">
          <h3>No matching jobs</h3>
          <p>Try another search or post your first project.</p>
        </div>
      )}
    </section>
  );
}
