import { useLanguage } from "../../../i18n/LanguageContext.js";
import { Link } from "react-router-dom";
import { formatEGP } from "../../../utils/formatEGP.js";
import { formatDate } from "../../../utils/formatDate.js";
import { applications, dashboardStudent } from "./studentDashboardModel.js";
import { Icon } from "./StudentDashboardUi.jsx";
import { Badge, DashboardStat } from "../shared/DashboardUi.jsx";
const date = (value, locale) => formatDate(value, locale);
function Empty({ children }) {
  const { t } = useLanguage();

  return (
    <div className="sd-empty">
      <p>{children}</p>
      <Link to="/projects">{t("Browse Jobs →")}</Link>
    </div>
  );
}

export function ApplicationsTable({ rows, openDetail }) {
  const { t, locale } = useLanguage();

  return (
    <section className="sd-panel sd-applications">
      <div className="sd-panel-heading">
        <h2>{t("My Applications")}</h2>
        <p>
          {rows.length} {t("sent this month •")}{" "}
          {rows.filter((row) => row.status === "Pending").length}{" "}
          {t("awaiting a response")}
        </p>
      </div>
      {rows.length ? (
        <>
          <div className="sd-table-head">
            <span>{t("Job")}</span>
            <span>{t("Client")}</span>
            <span>{t("Proposed price")}</span>
            <span>{t("Status")}</span>
            <span>{t("Date")}</span>
            <span />
          </div>
          {rows.map((row) => (
            <article className="sd-table-row" key={row.id}>
              <h3>{row.title}</h3>
              <div className="sd-cell">
                <small>{t("Client")}</small>
                {row.client}
              </div>
              <div className="sd-cell sd-price">
                <small>{t("Proposed price")}</small>
                {formatEGP(row.price, locale)}
              </div>
              <div className="sd-status">
                <Badge status={row.status} />
              </div>
              <div className="sd-cell">
                <small>{t("Date")}</small>
                {date(row.date, locale)}
              </div>
              <button
                className="sd-more"
                onClick={() =>
                  openDetail({
                    title: row.title,
                    body: `${row.client} · ${formatEGP(row.price, locale)} · ${row.status}. Proposal editing and withdrawal await the marketplace module.`,
                  })
                }
                aria-label={t("View application: {value0}", {
                  value0: row.title,
                })}
              >
                <Icon name="more" />
              </button>
            </article>
          ))}
          <p className="sd-table-footer">
            {t("Showing all")} {rows.length} {t("applications • October 2026")}
          </p>
        </>
      ) : (
        <Empty>
          {t("No applications yet. Your next opportunity starts here.")}
        </Empty>
      )}
    </section>
  );
}

export function ActiveJobs({ jobs, openDetail, showAll }) {
  const { t, locale } = useLanguage();

  return (
    <section>
      <div className="sd-section-heading">
        <div>
          <h2>{t("Active Jobs")}</h2>
          <p>
            {jobs.length} {t("projects in progress")}
            {jobs.length > 0 ? t(" • both on track") : ""}
          </p>
        </div>
        {showAll && <button onClick={showAll}>{t("View all →")}</button>}
      </div>
      {jobs.length ? (
        <div className="sd-job-grid">
          {jobs.map((job) => {
            const application = applications.find(
              (row) => row.id === job.applicationId,
            );
            return (
              <article className="sd-panel sd-job" key={job.id}>
                <div className="sd-job-status">
                  <Badge status="In progress" />
                  <span>{t("On track")}</span>
                </div>
                <div>
                  <h3>{application.title}</h3>
                  <p>{application.client}</p>
                </div>
                <dl>
                  <div>
                    <dt>{t("Agreed price")}</dt>
                    <dd>{formatEGP(application.price, locale)}</dd>
                  </div>
                  <div>
                    <dt>{t("Deadline")}</dt>
                    <dd>{date(job.deadline, locale)}</dd>
                  </div>
                </dl>
                <div className="sd-progress">
                  <div>
                    <span>{t("Project progress")}</span>
                    <strong>{job.progress}%</strong>
                  </div>
                  <progress
                    max="100"
                    value={job.progress}
                    aria-label={t("{value0} progress", {
                      value0: application.title,
                    })}
                  />
                  <strong>{job.milestone}</strong>
                  <p>{job.next}</p>
                </div>
                <button
                  className="sd-button sd-secondary"
                  onClick={() =>
                    openDetail({
                      title: application.title,
                      body: `${job.milestone}. ${job.next} Deadline: ${date(job.deadline, locale)}. This preview shows mock project progress. Messaging, delivery, and escrow actions await the order workspace.`,
                    })
                  }
                >
                  <Icon name="arrow" />
                  {t("View job")}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty>{t("No active projects or service orders yet.")}</Empty>
      )}
    </section>
  );
}

export function StudentSectionViews({
  section,
  rows,
  jobs,
  scenario,
  setDetail,
  navigate,
  notifications,
  setNotifications,
}) {
  const { t, locale } = useLanguage();
  return (
    <>
      {" "}
      {section === "overview" && (
        <div className="sd-stats">
          {[
            ["Applications sent", rows.length, "This month", "send"],
            [
              "Active jobs",
              jobs.length,
              jobs.length ? "On track" : "No active work",
              "briefcase",
            ],
            [
              "Completed jobs",
              scenario === "empty" ? 0 : dashboardStudent.completedJobs,
              "All time",
              "check",
            ],
            [
              "My rating",
              scenario === "empty" ? "—" : dashboardStudent.rating,
              scenario === "empty" ? "No reviews yet" : "32 client reviews",
              "star",
            ],
          ].map(([title, value, caption, icon]) => (
            <DashboardStat
              key={title}
              label={title}
              value={value}
              caption={caption}
              icon={<Icon name={icon} />}
            />
          ))}
        </div>
      )}
      {["overview", "applications"].includes(section) && (
        <ApplicationsTable rows={rows} openDetail={setDetail} />
      )}
      {["overview", "active"].includes(section) && (
        <ActiveJobs
          jobs={jobs}
          openDetail={setDetail}
          showAll={section === "overview" ? () => navigate("active") : null}
        />
      )}
      {section === "overview" && (
        <div className="sd-supplement">
          <section className="sd-panel sd-summary">
            <h2>{t("Earnings summary")}</h2>
            <strong>
              {formatEGP(
                scenario === "empty" ? 0 : dashboardStudent.earningsEGP,
                locale,
              )}
            </strong>
            <p>{t("Simulated gross earnings · all time")}</p>
            <small>
              {t(
                "No real funds, payouts, or escrow. Fees and available balance are not calculated.",
              )}
            </small>
          </section>
          <section className="sd-panel sd-summary">
            <h2>{t("Recent activity")}</h2>
            {rows.length ? (
              <ul>
                {rows.slice(0, 3).map((row) => (
                  <li key={row.id}>
                    <span>
                      {row.title} · {row.status}
                    </span>
                    <time dateTime={row.date}>{date(row.date, locale)}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("No recent activity yet.")}</p>
            )}
          </section>
        </div>
      )}
      {section === "completed" && (
        <section className="sd-panel sd-summary">
          <h2>{t("Completed work")}</h2>
          <p>
            {scenario === "empty" ? 0 : dashboardStudent.completedJobs}{" "}
            {t("completed jobs in the design’s summary.")}
          </p>
          <p>
            {t(
              "Individual completed-order records are not included in this design fixture. Order history and eligible reviews await marketplace integration.",
            )}
          </p>
        </section>
      )}
      {section === "profile" && (
        <section className="sd-panel sd-summary">
          <h2>{dashboardStudent.name}</h2>
          <p>{dashboardStudent.course}</p>
          <p>
            {t(
              "Demo profile · skills: illustration, visual identity, infographic design.",
            )}
          </p>
          <p>{t("Profile and portfolio editing await the profile module.")}</p>
        </section>
      )}
      {section === "settings" && (
        <section className="sd-panel sd-summary">
          <h2>{t("Demo preferences")}</h2>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />{" "}
            {t("Show demo notification reminders")}
          </label>
          <p role="status">
            {t("Reminders")} {notifications ? t("enabled") : t("disabled")}{" "}
            {t("for this visit.")}
          </p>
          <p>
            {t(
              "Password, language, and active-session settings await the account module.",
            )}
          </p>
        </section>
      )}
    </>
  );
}
