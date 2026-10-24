import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import {
  clientJobs,
  clientActivity,
  clientMetrics,
  selectClientJobs,
} from "./clientDashboardModel.js";
import DashboardDialog from "./DashboardDialog.jsx";
import "./dashboard.css";
import "./clientDashboard.css";

import { asset } from "./clientDashboardAssets.js";
import { Icon, Badge } from "./ClientDashboardUi.jsx";
import { ReviewForm, JobsTable } from "./ClientDashboardPanels.jsx";
const navigation = [
  ["overview", "Overview"],
  ["jobs", "My Jobs"],
  ["applicants", "Applicants"],
  ["active", "Active Jobs"],
  ["completed", "Completed Jobs"],
  ["profile", "Profile"],
  ["settings", "Settings"],
];

export default function ClientDashboard() {
  const [params, setParams] = useSearchParams();
  const section = navigation.some(([key]) => key === params.get("section"))
    ? params.get("section")
    : "overview";
  const [menuOpen, setMenuOpen] = useState(false);
  const [jobs, setJobs] = useState(clientJobs);
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [reviews, setReviews] = useState({});
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [notifications, setNotifications] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(timer);
  }, [scenario]);
  const visibleJobs = scenario === "empty" ? [] : jobs;
  const metrics = clientMetrics(visibleJobs, scenario === "empty");
  const active = visibleJobs.find(
    (job) => job.id === "client_launch" && job.status === "In progress",
  );
  const completed = visibleJobs.filter((job) => job.status === "Completed");
  const label = navigation.find(([key]) => key === section)[1];
  function navigate(key) {
    setParams(key === "overview" ? {} : { section: key });
    setMenuOpen(false);
  }
  function information(title, body) {
    setDialog({ type: "info", title, body });
  }
  function help() {
    information(
      "Help & support",
      "Support tickets and disputes await the support module. This fictional preview sends no messages.",
    );
  }
  function finish(job) {
    const completedOn = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
    }).format(new Date());
    setJobs((current) =>
      current.map((item) =>
        item.id === job.id
          ? { ...item, status: "Completed", completedOn }
          : item,
      ),
    );
    setDialog(null);
    setNotice(
      "Job marked as completed in this demo. No real payment or escrow release occurred.",
    );
  }
  return (
    <div className="student-dashboard client-dashboard">
      <a className="sd-skip" href="#client-main">
        Skip to dashboard content
      </a>
      <aside className="sd-sidebar">
        <Link className="sd-brand" to="/projects">
          <img src={asset("logo")} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>The MIU community at work</small>
          </span>
        </Link>
        <button
          className="sd-menu"
          aria-label="Toggle client navigation"
          aria-controls="client-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <span className="cd-initials cd-mobile-account">RC</span>
        <div
          className={`sd-navigation ${menuOpen ? "sd-open" : ""}`}
          id="client-navigation"
        >
          <p className="sd-caption">CLIENT WORKSPACE</p>
          <nav aria-label="Client workspace">
            {navigation.map(([key, title]) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                aria-current={section === key ? "page" : undefined}
              >
                <Icon name={key} />
                <span>{title}</span>
                {key === "applicants" && (
                  <b className="cd-nav-count">{metrics.applicants}</b>
                )}
              </button>
            ))}
          </nav>
          <div className="sd-help">
            <Icon name="shield" />
            <h3>Built on campus trust</h3>
            <p>Real projects. Verified members of the MIU community.</p>
            <button onClick={help}>Visit Help Center →</button>
          </div>
        </div>
      </aside>
      <div className="sd-workspace">
        <header className="sd-topbar">
          <div className="sd-breadcrumb">
            Client dashboard <Icon name="chevron" />
            <strong>{label}</strong>
          </div>
          <div className="sd-account">
            <button
              className="cd-red"
              onClick={() =>
                information(
                  "Find Talent",
                  "Freelancer discovery and service browsing await the marketplace module. No AI matching is performed.",
                )
              }
            >
              Find Talent
            </button>
            <button
              aria-label="View notifications"
              onClick={() =>
                information(
                  "Notifications",
                  notifications
                    ? `${metrics.applicants} new fictional applicants. Final delivery is ready for review.`
                    : "Demo notification reminders are disabled.",
                )
              }
            >
              <Icon name="bell" />
            </button>
            <span className="cd-initials">RC</span>
            <span>
              <b>MIU Robotics Club</b>
              <small>Verified MIU club</small>
            </span>
          </div>
        </header>
        <main id="client-main" className="sd-main">
          <div className="sd-welcome">
            <div>
              <h1>{section === "overview" ? "MIU Robotics Club" : label}</h1>
              <p>Your talent, applications, and projects in one place.</p>
            </div>
            <button
              className="sd-button sd-primary"
              onClick={() =>
                information(
                  "Post a Job",
                  "The project editor (P-16) awaits the marketplace module. It will collect scope, skills, an EGP budget, and a deadline. No project has been published.",
                )
              }
            >
              <Icon name="plus" />
              Post a Job
            </button>
          </div>
          <p className="cd-announcement" role="status">
            {notice}
          </p>
          {!loaded ? (
            <section role="status" className="sd-panel sd-loading">
              Loading client dashboard…
              <div />
              <div />
            </section>
          ) : scenario === "error" ? (
            <section className="sd-panel sd-empty" role="alert">
              <h2>Dashboard unavailable</h2>
              <p>Simulated load failure. Your demo changes are retained.</p>
              <button
                className="sd-button sd-primary"
                onClick={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
              >
                Try again
              </button>
            </section>
          ) : (
            <>
              {section === "overview" && (
                <div className="sd-stats">
                  {[
                    [
                      "Open jobs",
                      metrics.open,
                      "Accepting applications",
                      "briefcase",
                    ],
                    [
                      "New applicants",
                      metrics.applicants,
                      `Across ${metrics.open} open jobs`,
                      "users",
                    ],
                    [
                      "Active jobs",
                      metrics.active,
                      active ? "Ready for approval" : "No active work",
                      "clock",
                    ],
                    [
                      "Completed jobs",
                      metrics.completed,
                      "All time",
                      "checkCircle",
                    ],
                  ].map(([title, value, caption, icon]) => (
                    <section className="sd-panel sd-stat" key={title}>
                      <div>
                        <span>{title}</span>
                        <Icon name={icon} />
                      </div>
                      <strong>{value}</strong>
                      <small>{caption}</small>
                    </section>
                  ))}
                </div>
              )}
              {section === "jobs" && (
                <div className="cd-filters">
                  <label>
                    Search jobs
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      {["All", "Open", "In progress", "Completed"].map(
                        (item) => (
                          <option key={item}>{item}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <button
                    className="sd-button sd-secondary"
                    onClick={() => {
                      setQuery("");
                      setStatus("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
              {["overview", "jobs"].includes(section) && (
                <JobsTable
                  jobs={
                    section === "jobs"
                      ? selectClientJobs(visibleJobs, query, status)
                      : visibleJobs
                  }
                  filtered={section === "jobs" || !visibleJobs.length}
                  openJob={(job) => setDialog({ type: "job", job })}
                />
              )}
              {["overview", "active"].includes(section) && (
                <section>
                  <div className="sd-section-heading">
                    <div>
                      <h2>Active Jobs</h2>
                      <p>
                        {metrics.active} active project
                        {active ? " • final delivery ready to review" : "s"}
                      </p>
                    </div>
                    {section === "overview" && (
                      <button onClick={() => navigate("active")}>
                        View all →
                      </button>
                    )}
                  </div>
                  {active ? (
                    <article className="sd-panel cd-active">
                      <div className="cd-project-overview">
                        <div>
                          <Badge status="In progress" />
                          <h3>{active.title}</h3>
                          <p>
                            Social announcement set and competition presentation
                            templates.
                          </p>
                        </div>
                        <div className="cd-person">
                          <span className="cd-initials">SA</span>
                          <div>
                            <b>Salma Ahmed</b>
                            <small>Student designer</small>
                          </div>
                        </div>
                      </div>
                      <dl>
                        <div>
                          <dt>Agreed price</dt>
                          <dd>{formatEGP(active.budget)}</dd>
                        </div>
                        <div>
                          <dt>Deadline</dt>
                          <dd>{formatDate(active.deadline, "en-GB")}</dd>
                        </div>
                      </dl>
                      <div className="sd-progress">
                        <div>
                          <strong>4 of 4 deliverables submitted</strong>
                          <span>100%</span>
                        </div>
                        <progress
                          max="100"
                          value="100"
                          aria-label="Competition launch visuals delivery progress"
                        />
                      </div>
                      <div className="cd-approval">
                        <div>
                          <b>Ready for your approval</b>
                          <p>
                            Review the final files, then mark the job as
                            completed.
                          </p>
                        </div>
                        <button
                          className="sd-button sd-primary"
                          onClick={() =>
                            setDialog({ type: "complete", job: active })
                          }
                        >
                          <Icon name="check" />
                          Mark as completed
                        </button>
                      </div>
                    </article>
                  ) : (
                    <div className="sd-panel sd-empty">
                      No active projects or service orders.
                    </div>
                  )}
                </section>
              )}
              {["overview", "completed"].includes(section) &&
                (completed.length
                  ? completed.map((job) => (
                      <article
                        className="sd-panel cd-review-reminder"
                        key={job.id}
                      >
                        <div className="cd-person">
                          {job.student === "Nour El-Sayed" ? (
                            <img
                              className="sd-avatar"
                              src={asset("avatar")}
                              width="40"
                              height="40"
                              alt="Fictional student avatar"
                            />
                          ) : (
                            <span className="cd-initials">SA</span>
                          )}
                          <div>
                            <b>{job.title}</b>
                            <small>
                              Completed {formatDate(job.completedOn, "en-GB")}{" "}
                              by {job.student} •{" "}
                              {reviews[job.id]
                                ? "Review submitted (demo)"
                                : "Review pending"}
                            </small>
                          </div>
                        </div>
                        <button
                          className="sd-button sd-secondary"
                          disabled={!!reviews[job.id]}
                          onClick={() => setDialog({ type: "review", job })}
                        >
                          <Icon name="star" />
                          {reviews[job.id] ? "Reviewed" : "Leave a review"}
                        </button>
                      </article>
                    ))
                  : section === "completed" && (
                      <div className="sd-panel sd-empty">
                        No completed jobs to review yet.
                      </div>
                    ))}
              {section === "overview" && (
                <div className="sd-supplement">
                  <section className="sd-panel sd-summary">
                    <h2>Spending summary</h2>
                    <strong>
                      {formatEGP(
                        completed.reduce((total, job) => total + job.budget, 0),
                      )}
                    </strong>
                    <p>
                      Agreed value of completed work in the available demo
                      records
                    </p>
                    <p>
                      Active work:{" "}
                      {formatEGP(
                        visibleJobs
                          .filter((job) => job.status === "In progress")
                          .reduce((total, job) => total + job.budget, 0),
                      )}
                    </p>
                    <small>
                      Fictional work values, not processed payments. Fees,
                      refunds, escrow and all-time spending are not calculated.
                    </small>
                  </section>
                  <section className="sd-panel sd-summary">
                    <h2>Recent activity</h2>
                    {visibleJobs.length ? (
                      <ul>
                        {notice && <li>{notice}</li>}
                        {clientActivity.map((event) => (
                          <li key={event.id}>
                            <span>{event.text}</span>
                            <time dateTime={event.date}>
                              {formatDate(event.date, "en-GB")}
                            </time>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No recent activity yet.</p>
                    )}
                  </section>
                </div>
              )}
              {section === "applicants" && (
                <section className="sd-panel sd-summary">
                  <h2>Incoming applicants</h2>
                  <p>
                    {metrics.applicants} new applicants across your open jobs.
                  </p>
                  {visibleJobs
                    .filter((job) => job.status === "Open")
                    .map((job) => (
                      <div className="cd-applicant-job" key={job.id}>
                        <h3>{job.title}</h3>
                        <p>
                          {job.applicants} applicants • {job.newApplicants} new
                        </p>
                        <button
                          className="sd-button sd-secondary"
                          onClick={() =>
                            information(
                              "Proposal comparison",
                              "Proposal comparison, student profiles, shortlisting, acceptance and rejection await the marketplace module (P-17). No applicant decision has been recorded.",
                            )
                          }
                        >
                          Review applicants
                        </button>
                      </div>
                    ))}
                  {!metrics.open && (
                    <p>No open projects receiving applicants.</p>
                  )}
                </section>
              )}
              {section === "profile" && (
                <section className="sd-panel sd-summary">
                  <h2>MIU Robotics Club</h2>
                  <p>Fictional organization profile • MIU community</p>
                  <p>
                    Profile editing and identity verification await their owning
                    modules.
                  </p>
                </section>
              )}
              {section === "settings" && (
                <section className="sd-panel sd-summary">
                  <h2>Demo preferences</h2>
                  <label>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(event) =>
                        setNotifications(event.target.checked)
                      }
                    />{" "}
                    Show demo notification reminders
                  </label>
                  <p role="status">
                    Reminders {notifications ? "enabled" : "disabled"} for this
                    visit.
                  </p>
                  <p>
                    Password, language and session management await account
                    integration.
                  </p>
                </section>
              )}
            </>
          )}
          <footer className="sd-footer">
            <span>© 2026 MIU Freelance</span>
            <button onClick={help}>Help & support</button>
          </footer>
          <details className="sd-demo-controls">
            <summary>Frontend demo · fictional data</summary>
            <p>
              No real authentication, verification, payment or escrow. Changes
              reset on reload. The design’s 24 posted / 18 completed totals are
              fictional aggregates; only four job records are supplied. Dates
              reproduce the design snapshot. Service orders, transactions,
              messages, project editing and proposal decisions await their
              owning modules.
            </p>
            <label>
              Preview state{" "}
              <select
                value={scenario}
                onChange={(event) => {
                  setLoaded(false);
                  setScenario(event.target.value);
                }}
              >
                <option value="sample">Sample data</option>
                <option value="empty">Empty</option>
                <option value="error">Error</option>
              </select>
            </label>
          </details>
        </main>
      </div>
      {dialog?.type === "info" && (
        <DashboardDialog title={dialog.title} close={() => setDialog(null)}>
          <p>{dialog.body}</p>
          <button
            className="sd-button sd-primary"
            onClick={() => setDialog(null)}
          >
            Close
          </button>
        </DashboardDialog>
      )}
      {dialog?.type === "job" && (
        <DashboardDialog title={dialog.job.title} close={() => setDialog(null)}>
          <p>
            {formatEGP(dialog.job.budget)} • {dialog.job.status} • Deadline{" "}
            {formatDate(dialog.job.deadline, "en-GB")}
          </p>
          <p>
            {dialog.job.applicants} fictional applicants. Project details and
            editing await the marketplace module.
          </p>
          <button
            className="sd-button sd-primary"
            onClick={() => {
              setDialog(null);
              navigate("applicants");
            }}
          >
            View applicants
          </button>
        </DashboardDialog>
      )}
      {dialog?.type === "complete" && (
        <DashboardDialog
          title="Complete this job?"
          close={() => setDialog(null)}
        >
          <p>
            All four fictional deliverables have been submitted. Confirm
            acceptance to complete {dialog.job.title} in this demo. No real
            funds are released.
          </p>
          <div className="cd-actions">
            <button
              className="sd-button sd-secondary"
              onClick={() => setDialog(null)}
            >
              Cancel
            </button>
            <button
              className="sd-button sd-primary"
              onClick={() => finish(dialog.job)}
            >
              Confirm completion
            </button>
          </div>
        </DashboardDialog>
      )}
      {dialog?.type === "review" && (
        <ReviewForm
          job={dialog.job}
          close={() => setDialog(null)}
          submit={(review) => {
            setReviews((current) => ({ ...current, [dialog.job.id]: review }));
            setDialog(null);
            setNotice(
              "Review submitted for this demo session. It has not been published.",
            );
          }}
        />
      )}
    </div>
  );
}
