import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Grid2X2, Pause, Play } from "lucide-react";
import Dropdown from "../../components/ui/Dropdown.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import HowItWorks from "./HowItWorks.jsx";
import RotatingSearchHint from "./RotatingSearchHint.jsx";
import { useReducedMotion } from "./useLandingMotion.js";
import { formatEGP } from "../../utils/formatEGP.js";
import {
  filterLandingJobs,
  filterLandingStudents,
  landingCategories,
} from "./landingData.js";
import "./landing.css";

const assets = import.meta.glob("../../assets/figma/landing/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const asset = (name) => assets[`../../assets/figma/landing/${name}`];
const icons = {
  accent: "66e2b.svg",
  search: "1966c.svg",
  chevron: "f0601.svg",
  briefcase: "05e24.svg",
  users: "a8d66.svg",
  star: "70201.svg",
  bookmark: "8064d.svg",
  client: "93ac5.svg",
  verified: "483a6.svg",
  badge: "3128d.svg",
  shield: "b3c81.svg",
  graduation: "67528.svg",
};
function Icon({ name }) {
  return <img src={asset(icons[name])} alt="" className="landing-icon" />;
}
function Chips({ values }) {
  return (
    <div className="landing-skills">
      {values.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}
function SectionHeading({ eyebrow, title, children, action }) {
  return (
    <div className="landing-heading">
      <div>
        <p className="landing-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
      {action}
    </div>
  );
}

function PreviewDialog({ preview, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (preview) ref.current.showModal();
  }, [preview]);
  return (
    <dialog
      ref={ref}
      className="landing-dialog"
      aria-labelledby="preview-title"
      onClose={onClose}
    >
      <form method="dialog">
        <button className="landing-button" autoFocus>
          Close preview
        </button>
      </form>
      <p className="landing-eyebrow">Prototype preview</p>
      <h2 id="preview-title">{preview?.title}</h2>
      <p>{preview?.description}</p>
      {preview?.skills && <Chips values={preview.skills} />}
      {preview?.budget && (
        <p>
          <strong>{formatEGP(preview.budget)}</strong> · Design example
          deadline: {preview.deadline}
        </p>
      )}
      <p className="landing-prototype-note">
        Fictional design example. Profiles, applications, contact and policy
        workflows are not available in this preview.
      </p>
      <Link
        className="landing-button primary"
        to="/projects"
        onClick={() => ref.current.close()}
      >
        Explore project catalogue
      </Link>
    </dialog>
  );
}

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);
  const motionEnabled = !reducedMotion && !motionPaused;
  const [mode, setMode] = useState("work");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({ query: "", category: "" });
  const [saved, setSaved] = useState([]);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(null);
  const jobs = filterLandingJobs(
    mode === "work" ? filters.query : "",
    mode === "work" ? filters.category : "",
  );
  const students = filterLandingStudents(
    mode === "hire" ? filters.query : "",
    mode === "hire" ? filters.category : "",
  );
  function changeMode(value) {
    if (value === mode) return;
    setMode(value);
    setQuery("");
    setCategory("");
    setFilters({ query: "", category: "" });
  }
  function clearFilters() {
    setQuery("");
    setCategory("");
    setFilters({ query: "", category: "" });
  }
  function search(event) {
    event.preventDefault();
    setFilters({ query, category });
    document
      .getElementById(mode === "hire" ? "student-talent" : "featured-jobs")
      .scrollIntoView({ block: "start" });
  }
  function selectCategory(value) {
    setCategory(value === category ? "" : value);
    setFilters({ query, category: value === category ? "" : value });
  }
  function toggleSaved(job) {
    const exists = saved.includes(job.id);
    setSaved((current) =>
      exists ? current.filter((id) => id !== job.id) : [...current, job.id],
    );
    setNotice(
      `${job.title} ${exists ? "removed from saved jobs" : "saved for this preview"}.`,
    );
  }
  const showInfo = (title) =>
    setPreview({
      title,
      description:
        "Frontend prototype. Use test details. Identity checks, reviews, support and payments are planned.",
    });

  return (
    <div className="landing" data-motion={motionEnabled ? "on" : "off"}>
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-community">
          <Icon name="accent" />
          Built for the MIU community
        </div>
        <h1 id="landing-title">Find real work. Build your reputation.</h1>
        <p className="landing-intro">
          Connect with trusted MIU clients, turn your skills into experience,
          and grow a portfolio that opens doors.
        </p>
        <div
          className="landing-mode-toggle"
          role="group"
          aria-label="Choose Hire or Work"
        >
          <span
            className="landing-mode-indicator"
            data-mode={mode}
            aria-hidden="true"
          />
          {["hire", "work"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => changeMode(value)}
            >
              {value === "hire" ? "Hire" : "Work"}
            </button>
          ))}
        </div>
        <form
          className="landing-search"
          onSubmit={search}
          role="search"
          aria-label={
            mode === "hire" ? "Search student talent" : "Search featured jobs"
          }
        >
          <Icon name="search" />
          <label className="sr-only" htmlFor="landing-query">
            {mode === "hire"
              ? "Search students by name or skill"
              : "Search by title, skill, or keyword"}
          </label>
          <div className={`landing-search-input ${query ? "has-value" : ""}`}>
            <RotatingSearchHint enabled={motionEnabled && !query} />
            <input
              id="landing-query"
              value={query}
              maxLength={120}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
            />
          </div>
          <Dropdown
            className="landing-category-select"
            label={
              <>
                <Grid2X2 size={17} aria-hidden="true" />
                <span>{category || "All categories"}</span>
              </>
            }
          >
            {(close) => (
              <>
                <p className="landing-category-heading">Explore categories</p>
                {["", ...landingCategories].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className="landing-category-option"
                    aria-pressed={category === value}
                    onClick={() => {
                      setCategory(value);
                      close();
                    }}
                  >
                    <span>{value || "All categories"}</span>
                    {category === value && (
                      <Check size={16} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </>
            )}
          </Dropdown>
          <button className="landing-button primary">Search</button>
        </form>
        <p className="landing-mode-caption" aria-live="polite">
          {mode === "hire"
            ? "Great ideas start with the right people. "
            : "Your next opportunity starts here. "}
          <Link
            to={
              mode === "hire"
                ? "/register?role=client"
                : "/register?role=student"
            }
          >
            {mode === "hire" ? "Join to hire" : "Join to work"} &rarr;
          </Link>
        </p>
        {!reducedMotion && (
          <button
            type="button"
            className="landing-motion-control"
            aria-pressed={motionPaused}
            onClick={() => setMotionPaused(!motionPaused)}
          >
            {motionPaused ? (
              <Play size={13} aria-hidden="true" />
            ) : (
              <Pause size={13} aria-hidden="true" />
            )}
            {motionPaused ? "Resume motion" : "Pause motion"}
          </button>
        )}
      </section>

      <CategoryCarousel
        category={category}
        onSelect={selectCategory}
        motionEnabled={motionEnabled}
      />
      <HowItWorks motionEnabled={motionEnabled} />

      <section
        className="landing-section landing-muted"
        id="featured-jobs"
        aria-label="Featured jobs"
      >
        <div className="landing-container">
          <SectionHeading
            eyebrow="Fresh opportunities"
            title="Featured jobs"
            action={
              <Link className="landing-button" to="/projects">
                Browse all jobs
              </Link>
            }
          >
            Real briefs from MIU departments, clubs, alumni, and trusted
            community partners.
          </SectionHeading>
          <p className="landing-prototype-note">
            Prototype content: fictional jobs and profiles from the design.
            Saved jobs last until you leave this page.
          </p>
          <p role="status" className="sr-only">
            {notice}
          </p>
          {mode === "work" && (filters.query || filters.category) && (
            <p role="status" className="landing-results">
              {jobs.length} featured {jobs.length === 1 ? "job" : "jobs"} found.{" "}
              <button onClick={clearFilters}>Clear filters</button>
            </p>
          )}
          <div className="landing-grid">
            {jobs.map((job) => (
              <article key={job.id} className="landing-card landing-job">
                <div className="landing-card-top">
                  <span className="landing-status">Open</span>
                  <button
                    className="landing-save"
                    aria-label={`${saved.includes(job.id) ? "Unsave" : "Save"} ${job.title}`}
                    aria-pressed={saved.includes(job.id)}
                    onClick={() => toggleSaved(job)}
                  >
                    <Icon name="bookmark" />
                  </button>
                </div>
                <div>
                  <h3>{job.title}</h3>
                  <div className="landing-client">
                    <Icon name="client" />
                    <strong>{job.client}</strong>
                    <Icon name="verified" />
                    <span>★ {job.rating}</span>
                  </div>
                </div>
                <p>{job.description}</p>
                <Chips values={job.skills} />
                <dl className="landing-metadata">
                  <div>
                    <dt>Fixed budget</dt>
                    <dd>{formatEGP(job.budget)}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{job.deadline}</dd>
                  </div>
                  <div>
                    <dt>Applicants</dt>
                    <dd>{job.applicants} students</dd>
                  </div>
                </dl>
                <div className="landing-card-actions">
                  <span>{job.posted}</span>
                  <button
                    className="landing-button primary"
                    onClick={() => setPreview(job)}
                  >
                    View job
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!jobs.length && (
            <div className="landing-empty">
              <h3>No featured jobs match your search</h3>
              <p>
                Try another keyword or category, clear filters, or browse the
                full project catalogue.
              </p>
              <Link className="landing-button" to="/projects">
                Browse all jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        className="landing-section"
        id="student-talent"
        aria-label="Top-rated students"
      >
        <div className="landing-container">
          <SectionHeading
            eyebrow="Student talent, proven"
            title="Top-rated students"
            action={
              <a className="landing-button" href="#student-cards">
                Explore talent
              </a>
            }
          >
            Discover skilled MIU students whose reliable work and thoughtful
            communication earn exceptional reviews.
          </SectionHeading>
          {mode === "hire" && (filters.query || filters.category) && (
            <p role="status" className="landing-results">
              {students.length} {students.length === 1 ? "student" : "students"}{" "}
              found.
              <button onClick={clearFilters}>Clear filters</button>
            </p>
          )}
          <div className="landing-grid" id="student-cards">
            {students.map((student) => (
              <article
                className="landing-card landing-student"
                key={student.id}
              >
                <img
                  className="landing-avatar"
                  src={asset(student.image)}
                  alt={`Fictional profile portrait for ${student.name}`}
                  width="88"
                  height="88"
                  loading="lazy"
                />
                <div>
                  <h3>{student.name}</h3>
                  <p>{student.study}</p>
                </div>
                <p className="landing-rating">
                  <span aria-label="5 stars">★★★★★</span> {student.rating}{" "}
                  <small>({student.reviews})</small>
                </p>
                <Chips values={student.skills} />
                <button
                  className="landing-button"
                  onClick={() =>
                    setPreview({
                      title: student.name,
                      description: student.study,
                      skills: student.skills,
                    })
                  }
                >
                  View profile
                </button>
              </article>
            ))}
          </div>
          {!students.length && (
            <div className="landing-empty">
              <h3>No students match your search</h3>
              <p>Try another skill or category.</p>
              <button className="landing-button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        className="landing-section landing-trust"
        id="trust"
        aria-label="Why MIU Freelance"
      >
        <div className="landing-container">
          <SectionHeading eyebrow="Trust is built in" title="Why MIU Freelance">
            A focused marketplace where shared identity creates better briefs,
            stronger accountability, and work that matters.
          </SectionHeading>
          <div className="landing-grid">
            {[
              [
                "badge",
                "Verified MIU community",
                "Student and client identities are connected to the university community.",
              ],
              [
                "shield",
                "Reputation you can trust",
                "Mutual ratings and completed-work history make good collaboration visible.",
              ],
              [
                "graduation",
                "Experience that compounds",
                "Every project helps students build a portfolio, references, and career momentum.",
              ],
            ].map(([icon, title, description]) => (
              <article className="landing-card landing-trust-point" key={title}>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="landing-prototype-note">
            Planned platform benefits. Identity verification and reviews are
            simulated or illustrative in Phase 1.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <img
                src={asset("f03cc.png")}
                width="80"
                height="60"
                alt="Misr International University anniversary logo"
              />
              <div>
                <p>MIU Freelance</p>
                <small>Real projects. Proven student talent.</small>
              </div>
            </div>
            <nav aria-label="Marketplace footer">
              <h3>Marketplace</h3>
              <Link to="/projects">Browse Jobs</Link>
              <a href="#student-talent">Find Talent</a>
              <a href="#how-it-works">How it Works</a>
              <Link to="/services">Browse Services</Link>
            </nav>
            <nav aria-label="Support footer">
              <h3>Support</h3>
              <a href="#trust">Safety &amp; Trust</a>
              <button onClick={() => showInfo("Help Center")}>
                Help Center
              </button>
              <button onClick={() => showInfo("Contact Us")}>Contact Us</button>
            </nav>
          </div>
          <div className="landing-footer-meta">
            <p>© 2026 Misr International University. All rights reserved.</p>
            <div>
              {["Privacy", "Terms", "Community Guidelines"].map((title) => (
                <button key={title} onClick={() => showInfo(title)}>
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <PreviewDialog preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
