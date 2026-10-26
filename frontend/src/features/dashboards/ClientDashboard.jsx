import { useLanguage } from "../../i18n/LanguageContext.js";
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
  const { t, locale } = useLanguage();

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
        {t("Skip to dashboard content")}
      </a>
      <aside className="sd-sidebar">
        <Link className="sd-brand" to="/projects">
          <img src={asset("logo")} alt={t("MIU anniversary logo")} />
          <span>
            <b>{t("MIU Freelance")}</b>
            <small>{t("The MIU community at work")}</small>
          </span>
        </Link>
        <button
          className="sd-menu"
          aria-label={t("Toggle client navigation")}
          aria-controls="client-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <span className="cd-initials cd-mobile-account">{t("RC")}</span>
        <div
          className={`sd-navigation ${menuOpen ? "sd-open" : ""}`}
          id="client-navigation"
        >
          <p className="sd-caption">{t("CLIENT WORKSPACE")}</p>
          <nav aria-label={t("Client workspace")}>
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
            <h3>{t("Built on campus trust")}</h3>
            <p>{t("Real projects. Verified members of the MIU community.")}</p>
            <button onClick={help}>{t("Visit Help Center →")}</button>
          </div>
        </div>
      </aside>
      <div className="sd-workspace">
        <header className="sd-topbar">
          <div className="sd-breadcrumb">
            {t("Client dashboard")} <Icon name="chevron" />
            <strong>{t(label)}</strong>
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
              {t("Find Talent")}
            </button>
            <button
              aria-label={t("View notifications")}
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
            <span className="cd-initials">{t("RC")}</span>
            <span>
              <b>{t("MIU Robotics Club")}</b>
              <small>{t("Verified MIU club")}</small>
            </span>
          </div>
        </header>
        <main id="client-main" className="sd-main">
          <div className="sd-welcome">
            <div>
              <h1>{section === "overview" ? t("MIU Robotics Club") : label}</h1>
              <p>
                {t("Your talent, applications, and projects in one place.")}
              </p>
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
              {t("Post a Job")}
            </button>
          </div>
          <p className="cd-announcement" role="status">
            {t(notice)}
          </p>
          {!loaded ? (
            <section role="status" className="sd-panel sd-loading">
              {t("Loading client dashboard…")}
              <div />
              <div />
            </section>
          ) : scenario === "error" ? (
            <section className="sd-panel sd-empty" role="alert">
              <h2>{t("Dashboard unavailable")}</h2>
              <p>
                {t("Simulated load failure. Your demo changes are retained.")}
              </p>
              <button
                className="sd-button sd-primary"
                onClick={() => {
                  setLoaded(false);
                  setScenario("sample");
                }}
              >
                {t("Try again")}
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
                      <small>{t(caption)}</small>
                    </section>
                  ))}
                </div>
              )}
              {section === "jobs" && (
                <div className="cd-filters">
                  <label>
                    {t("Search jobs")}
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  <label>
                    {t("Status")}
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
                    {t("Clear filters")}
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
                      <h2>{t("Active Jobs")}</h2>
                      <p>
                        {metrics.active} {t("active project")}
                        {active ? t(" • final delivery ready to review") : "s"}
                      </p>
                    </div>
                    {section === "overview" && (
                      <button onClick={() => navigate("active")}>
                        {t("View all →")}
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
                            {t(
                              "Social announcement set and competition presentation templates.",
                            )}
                          </p>
                        </div>
                        <div className="cd-person">
                          <span className="cd-initials">{t("SA")}</span>
                          <div>
                            <b>{t("Salma Ahmed")}</b>
                            <small>{t("Student designer")}</small>
                          </div>
                        </div>
                      </div>
                      <dl>
                        <div>
                          <dt>{t("Agreed price")}</dt>
                          <dd>{formatEGP(active.budget, locale)}</dd>
                        </div>
                        <div>
                          <dt>{t("Deadline")}</dt>
                          <dd>{formatDate(active.deadline, "en-GB")}</dd>
                        </div>
                      </dl>
                      <div className="sd-progress">
                        <div>
                          <strong>{t("4 of 4 deliverables submitted")}</strong>
                          <span>100%</span>
                        </div>
                        <progress
                          max="100"
                          value="100"
                          aria-label={t(
                            "Competition launch visuals delivery progress",
                          )}
                        />
                      </div>
                      <div className="cd-approval">
                        <div>
                          <b>{t("Ready for your approval")}</b>
                          <p>
                            {t(
                              "Review the final files, then mark the job as completed.",
                            )}
                          </p>
                        </div>
                        <button
                          className="sd-button sd-primary"
                          onClick={() =>
                            setDialog({ type: "complete", job: active })
                          }
                        >
                          <Icon name="check" />
                          {t("Mark as completed")}
                        </button>
                      </div>
                    </article>
                  ) : (
                    <div className="sd-panel sd-empty">
                      {t("No active projects or service orders.")}
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
                              alt={t("Fictional student avatar")}
                            />
                          ) : (
                            <span className="cd-initials">{t("SA")}</span>
                          )}
                          <div>
                            <b>{job.title}</b>
                            <small>
                              {t("Completed")}{" "}
                              {formatDate(job.completedOn, "en-GB")} {t("by")}{" "}
                              {job.student} •{" "}
                              {reviews[job.id]
                                ? t("Review submitted (demo)")
                                : t("Review pending")}
                            </small>
                          </div>
                        </div>
                        <button
                          className="sd-button sd-secondary"
                          disabled={!!reviews[job.id]}
                          onClick={() => setDialog({ type: "review", job })}
                        >
                          <Icon name="star" />
                          {reviews[job.id]
                            ? t("Reviewed")
                            : t("Leave a review")}
                        </button>
                      </article>
                    ))
                  : section === "completed" && (
                      <div className="sd-panel sd-empty">
                        {t("No completed jobs to review yet.")}
                      </div>
                    ))}
              {section === "overview" && (
                <div className="sd-supplement">
                  <section className="sd-panel sd-summary">
                    <h2>{t("Spending summary")}</h2>
                    <strong>
                      {formatEGP(
                        completed.reduce((total, job) => total + job.budget, 0),
                        locale,
                      )}
                    </strong>
                    <p>
                      {t(
                        "Agreed value of completed work in the available demo records",
                      )}
                    </p>
                    <p>
                      {t("Active work:")}{" "}
                      {formatEGP(
                        visibleJobs
                          .filter((job) => job.status === "In progress")
                          .reduce((total, job) => total + job.budget, 0),
                        locale,
                      )}
                    </p>
                    <small>
                      {t(
                        "Fictional work values, not processed payments. Fees, refunds, escrow and all-time spending are not calculated.",
                      )}
                    </small>
                  </section>
                  <section className="sd-panel sd-summary">
                    <h2>{t("Recent activity")}</h2>
                    {visibleJobs.length ? (
                      <ul>
                        {notice && <li>{t(notice)}</li>}
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
                      <p>{t("No recent activity yet.")}</p>
                    )}
                  </section>
                </div>
              )}
              {section === "applicants" && (
                <section className="sd-panel sd-summary">
                  <h2>{t("Incoming applicants")}</h2>
                  <p>
                    {metrics.applicants}{" "}
                    {t("new applicants across your open jobs.")}
                  </p>
                  {visibleJobs
                    .filter((job) => job.status === "Open")
                    .map((job) => (
                      <div className="cd-applicant-job" key={job.id}>
                        <h3>{job.title}</h3>
                        <p>
                          {job.applicants} {t("applicants •")}{" "}
                          {job.newApplicants} {t("new")}
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
                          {t("Review applicants")}
                        </button>
                      </div>
                    ))}
                  {!metrics.open && (
                    <p>{t("No open projects receiving applicants.")}</p>
                  )}
                </section>
              )}
              {section === "profile" && (
                <section className="sd-panel sd-summary">
                  <h2>{t("MIU Robotics Club")}</h2>
                  <p>{t("Fictional organization profile • MIU community")}</p>
                  <p>
                    {t(
                      "Profile editing and identity verification await their owning modules.",
                    )}
                  </p>
                </section>
              )}
              {section === "settings" && (
                <section className="sd-panel sd-summary">
                  <h2>{t("Demo preferences")}</h2>
                  <label>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(event) =>
                        setNotifications(event.target.checked)
                      }
                    />{" "}
                    {t("Show demo notification reminders")}
                  </label>
                  <p role="status">
                    {t("Reminders")}{" "}
                    {notifications ? t("enabled") : t("disabled")}{" "}
                    {t("for this visit.")}
                  </p>
                  <p>
                    {t(
                      "Password, language and session management await account integration.",
                    )}
                  </p>
                </section>
              )}
            </>
          )}
          <footer className="sd-footer">
            <span>{t("© 2026 MIU Freelance")}</span>
            <button onClick={help}>{t("Help & support")}</button>
          </footer>
          <details className="sd-demo-controls">
            <summary>{t("Frontend demo · fictional data")}</summary>
            <p>
              {t(
                "No real authentication, verification, payment or escrow. Changes reset on reload. The design’s 24 posted / 18 completed totals are fictional aggregates; only four job records are supplied. Dates reproduce the design snapshot. Service orders, transactions, messages, project editing and proposal decisions await their owning modules.",
              )}
            </p>
            <label>
              {t("Preview state")}{" "}
              <select
                value={scenario}
                onChange={(event) => {
                  setLoaded(false);
                  setScenario(event.target.value);
                }}
              >
                <option value="sample">{t("Sample data")}</option>
                <option value="empty">{t("Empty")}</option>
                <option value="error">{t("Error")}</option>
              </select>
            </label>
          </details>
        </main>
      </div>
      {dialog?.type === "info" && (
        <DashboardDialog title={t(dialog.title)} close={() => setDialog(null)}>
          <p>{dialog.body}</p>
          <button
            className="sd-button sd-primary"
            onClick={() => setDialog(null)}
          >
            {t("Close")}
          </button>
        </DashboardDialog>
      )}
      {dialog?.type === "job" && (
        <DashboardDialog title={dialog.job.title} close={() => setDialog(null)}>
          <p>
            {formatEGP(dialog.job.budget, locale)} • {dialog.job.status}{" "}
            {t("• Deadline")} {formatDate(dialog.job.deadline, "en-GB")}
          </p>
          <p>
            {dialog.job.applicants}{" "}
            {t(
              "fictional applicants. Project details and editing await the marketplace module.",
            )}
          </p>
          <button
            className="sd-button sd-primary"
            onClick={() => {
              setDialog(null);
              navigate("applicants");
            }}
          >
            {t("View applicants")}
          </button>
        </DashboardDialog>
      )}
      {dialog?.type === "complete" && (
        <DashboardDialog
          title={t("Complete this job?")}
          close={() => setDialog(null)}
        >
          <p>
            {t(
              "All four fictional deliverables have been submitted. Confirm acceptance to complete",
            )}{" "}
            {dialog.job.title} {t("in this demo. No real funds are released.")}
          </p>
          <div className="cd-actions">
            <button
              className="sd-button sd-secondary"
              onClick={() => setDialog(null)}
            >
              {t("Cancel")}
            </button>
            <button
              className="sd-button sd-primary"
              onClick={() => finish(dialog.job)}
            >
              {t("Confirm completion")}
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
