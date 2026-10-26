import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import {
  applications,
  activeJobs,
  dashboardStudent,
} from "./dashboardFixtures.js";
import { formatEGP } from "../../utils/formatEGP.js";
import "./dashboard.css";

const files = {
  logo: "f03cc.png",
  avatar: "97bc9.png",
  overview: "dc7a0.svg",
  applications: "c85b1.svg",
  active: "30502.svg",
  completed: "38c88.svg",
  profile: "3c294.svg",
  settings: "487ed.svg",
  shield: "e607e.svg",
  chevron: "bce8b.svg",
  bell: "82805.svg",
  search: "b30b4.svg",
  send: "05c93.svg",
  briefcase: "8cb64.svg",
  check: "9baa1.svg",
  star: "03247.svg",
  more: "5a082.svg",
  arrow: "9e83f.svg",
};
function asset(name) {
  return new URL(`../../assets/figma/dashboard/${files[name]}`, import.meta.url)
    .href;
}
function Icon({ name }) {
  return <img className="sd-icon" src={asset(name)} alt="" />;
}
const navigation = [
  ["overview", "Overview"],
  ["applications", "My Applications"],
  ["active", "Active Jobs"],
  ["completed", "Completed Jobs"],
  ["profile", "Profile"],
  ["settings", "Settings"],
];
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Cairo",
});
function date(value) {
  return dateFormatter.format(new Date(`${value}T12:00:00Z`));
}
function Badge({ status }) {
  return (
    <span
      className={`sd-badge sd-${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}
function Empty({ children }) {
  return (
    <div className="sd-empty">
      <p>{children}</p>
      <Link to="/projects">Browse Jobs →</Link>
    </div>
  );
}

function ApplicationsTable({ rows, openDetail }) {
  return (
    <section className="sd-panel sd-applications">
      <div className="sd-panel-heading">
        <h2>My Applications</h2>
        <p>
          {rows.length} sent this month •{" "}
          {rows.filter((row) => row.status === "Pending").length} awaiting a
          response
        </p>
      </div>
      {rows.length ? (
        <>
          <div className="sd-table-head">
            <span>Job</span>
            <span>Client</span>
            <span>Proposed price</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>
          {rows.map((row) => (
            <article className="sd-table-row" key={row.id}>
              <h3>{row.title}</h3>
              <div className="sd-cell">
                <small>Client</small>
                {row.client}
              </div>
              <div className="sd-cell sd-price">
                <small>Proposed price</small>
                {formatEGP(row.price)}
              </div>
              <div className="sd-status">
                <Badge status={row.status} />
              </div>
              <div className="sd-cell">
                <small>Date</small>
                {date(row.date)}
              </div>
              <button
                className="sd-more"
                onClick={() =>
                  openDetail({
                    title: row.title,
                    body: `${row.client} · ${formatEGP(row.price)} · ${row.status}. Proposal editing and withdrawal await the marketplace module.`,
                  })
                }
                aria-label={`View application: ${row.title}`}
              >
                <Icon name="more" />
              </button>
            </article>
          ))}
          <p className="sd-table-footer">
            Showing all {rows.length} applications • October 2026
          </p>
        </>
      ) : (
        <Empty>No applications yet. Your next opportunity starts here.</Empty>
      )}
    </section>
  );
}

function ActiveJobs({ jobs, openDetail, showAll }) {
  return (
    <section>
      <div className="sd-section-heading">
        <div>
          <h2>Active Jobs</h2>
          <p>
            {jobs.length} projects in progress
            {jobs.length > 0 ? " • both on track" : ""}
          </p>
        </div>
        {showAll && <button onClick={showAll}>View all →</button>}
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
                  <span>On track</span>
                </div>
                <div>
                  <h3>{application.title}</h3>
                  <p>{application.client}</p>
                </div>
                <dl>
                  <div>
                    <dt>Agreed price</dt>
                    <dd>{formatEGP(application.price)}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{date(job.deadline)}</dd>
                  </div>
                </dl>
                <div className="sd-progress">
                  <div>
                    <span>Project progress</span>
                    <strong>{job.progress}%</strong>
                  </div>
                  <progress
                    max="100"
                    value={job.progress}
                    aria-label={`${application.title} progress`}
                  />
                  <strong>{job.milestone}</strong>
                  <p>{job.next}</p>
                </div>
                <button
                  className="sd-button sd-secondary"
                  onClick={() =>
                    openDetail({
                      title: application.title,
                      body: `${job.milestone}. ${job.next} Deadline: ${date(job.deadline)}. This preview shows mock project progress. Messaging, delivery, and escrow actions await the order workspace.`,
                    })
                  }
                >
                  <Icon name="arrow" />
                  View job
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty>No active projects or service orders yet.</Empty>
      )}
    </section>
  );
}

function DetailDialog({ detail, close }) {
  const ref = useRef(null);
  const opener = useRef(document.activeElement);
  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = opener.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previouslyFocused?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="sd-dialog"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="sd-dialog-title"
    >
      <h2 id="sd-dialog-title">{detail.title}</h2>
      <p>{detail.body}</p>
      <button autoFocus className="sd-button sd-primary" onClick={close}>
        Close
      </button>
    </dialog>
  );
}

export default function StudentDashboard() {
  const [params, setParams] = useSearchParams();
  const section = navigation.some(([key]) => key === params.get("section"))
    ? params.get("section")
    : "overview";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [notifications, setNotifications] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(timer);
  }, [scenario]);
  const rows = scenario === "empty" ? [] : applications;
  const jobs = scenario === "empty" ? [] : activeJobs;
  const label = navigation.find(([key]) => key === section)[1];
  function navigate(key) {
    setParams(key === "overview" ? {} : { section: key });
    setMenuOpen(false);
  }
  function showHelp() {
    setDetail({
      title: "Help & support",
      body: "This is a frontend demonstration with fictional records. Support tickets and disputes are planned in the support module; no message will be sent from this preview.",
    });
  }
  return (
    <div className="student-dashboard">
      <a className="sd-skip" href="#student-main">
        Skip to dashboard content
      </a>
      <aside className="sd-sidebar">
        <Link to="/projects" className="sd-brand">
          <img src={asset("logo")} alt="MIU anniversary logo" />
          <span>
            <b>MIU Freelance</b>
            <small>The MIU community at work</small>
          </span>
        </Link>
        <button
          className="sd-menu"
          aria-label="Toggle student navigation"
          aria-controls="student-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <img
          className="sd-mobile-avatar"
          src={asset("avatar")}
          alt="Fictional student avatar"
        />
        <div
          className={`sd-navigation ${menuOpen ? "sd-open" : ""}`}
          id="student-navigation"
        >
          <p className="sd-caption">STUDENT WORKSPACE</p>
          <nav aria-label="Student workspace">
            {navigation.map(([key, title]) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                aria-current={section === key ? "page" : undefined}
              >
                <Icon name={key} />
                {title}
              </button>
            ))}
            <NavLink to="/student/orders" onClick={() => setMenuOpen(false)}>
              <Icon name="briefcase" />
              Orders
            </NavLink>
          </nav>
          <div className="sd-help">
            <Icon name="shield" />
            <h3>Built on campus trust</h3>
            <p>Real projects. Verified members of the MIU community.</p>
            <button onClick={showHelp}>Visit Help Center →</button>
          </div>
        </div>
      </aside>
      <div className="sd-workspace">
        <header className="sd-topbar">
          <div className="sd-breadcrumb">
            Student dashboard <Icon name="chevron" />
            <strong>{label}</strong>
          </div>
          <div className="sd-account">
            <Link to="/projects">Browse Jobs</Link>
            <button
              aria-label="View notifications"
              onClick={() =>
                setDetail({
                  title: "Notifications",
                  body: "Demo notification: your campus map proposal was accepted. Notifications are fictional and do not update from a server.",
                })
              }
            >
              <Icon name="bell" />
            </button>
            <img
              className="sd-avatar"
              src={asset("avatar")}
              alt="Fictional student avatar"
            />
            <span>
              <b>{dashboardStudent.name}</b>
              <small>{dashboardStudent.course}</small>
            </span>
          </div>
        </header>
        <main id="student-main" className="sd-main">
          <div className="sd-welcome">
            <div>
              <h1>{section === "overview" ? "Welcome back, Nour" : label}</h1>
              <p>Keep your applications and current projects moving forward.</p>
            </div>
            <Link className="sd-button sd-primary" to="/projects">
              <Icon name="search" />
              Browse Jobs
            </Link>
          </div>
          {!loaded ? (
            <section role="status" className="sd-panel sd-loading">
              Loading dashboard…
              <div />
              <div />
            </section>
          ) : scenario === "error" ? (
            <section className="sd-panel sd-empty" role="alert">
              <h2>Dashboard unavailable</h2>
              <p>Simulated load failure. Your data has not changed.</p>
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
                      scenario === "empty"
                        ? "No reviews yet"
                        : "32 client reviews",
                      "star",
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
              {["overview", "applications"].includes(section) && (
                <ApplicationsTable rows={rows} openDetail={setDetail} />
              )}
              {["overview", "active"].includes(section) && (
                <ActiveJobs
                  jobs={jobs}
                  openDetail={setDetail}
                  showAll={
                    section === "overview" ? () => navigate("active") : null
                  }
                />
              )}
              {section === "overview" && (
                <div className="sd-supplement">
                  <section className="sd-panel sd-summary">
                    <h2>Earnings summary</h2>
                    <strong>
                      {formatEGP(
                        scenario === "empty" ? 0 : dashboardStudent.earningsEGP,
                      )}
                    </strong>
                    <p>Simulated gross earnings · all time</p>
                    <small>
                      No real funds, payouts, or escrow. Fees and available
                      balance are not calculated.
                    </small>
                  </section>
                  <section className="sd-panel sd-summary">
                    <h2>Recent activity</h2>
                    {rows.length ? (
                      <ul>
                        {rows.slice(0, 3).map((row) => (
                          <li key={row.id}>
                            <span>
                              {row.title} · {row.status}
                            </span>
                            <time dateTime={row.date}>{date(row.date)}</time>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No recent activity yet.</p>
                    )}
                  </section>
                </div>
              )}
              {section === "completed" && (
                <section className="sd-panel sd-summary">
                  <h2>Completed work</h2>
                  <p>
                    {scenario === "empty" ? 0 : dashboardStudent.completedJobs}{" "}
                    completed jobs in the design’s summary.
                  </p>
                  <p>
                    Individual completed-order records are not included in this
                    design fixture. Order history and eligible reviews await
                    marketplace integration.
                  </p>
                </section>
              )}
              {section === "profile" && (
                <section className="sd-panel sd-summary">
                  <h2>{dashboardStudent.name}</h2>
                  <p>{dashboardStudent.course}</p>
                  <p>
                    Demo profile · skills: illustration, visual identity,
                    infographic design.
                  </p>
                  <p>Profile and portfolio editing await the profile module.</p>
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
                    Password, language, and active-session settings await the
                    account module.
                  </p>
                </section>
              )}
            </>
          )}
          <footer className="sd-footer">
            <span>© 2026 MIU Freelance</span>
            <button onClick={showHelp}>Help & support</button>
          </footer>
          <details className="sd-demo-controls">
            <summary>Frontend demo · fictional data</summary>
            <p>
              Simulated access, progress, ratings, and finances. No backend or
              real identity verification.
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
      {detail && <DetailDialog detail={detail} close={() => setDetail(null)} />}
    </div>
  );
}
