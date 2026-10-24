import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { proposalStore } from "./proposalStore.js";
import { projectStore } from "../projects/projectStore.js";
import { orderStore } from "../orders/orderStore.js";
import { getProjectById } from "../marketplace/selectors.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import { proposalLabel } from "./clientProposalModel.js";
import { filterStudentProposals } from "./studentProposalModel.js";
import StudentProposalActions from "./StudentProposalActions.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import "../projects/project-create.css";
import "./student-proposals.css";

function ProposalList() {
  const { session } = useAuth();
  const records = useSyncExternalStore(
    proposalStore.subscribe,
    proposalStore.getSnapshot,
    proposalStore.getSnapshot,
  );
  const orders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const [filters, setFilters] = useState({ query: "", status: "all" });
  const [notice, setNotice] = useState("");
  const heading = useRef(null);
  const listHeading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  useEffect(() => {
    if (notice) listHeading.current?.focus();
  }, [notice]);
  const own = records.filter(
    (proposal) => proposal.studentId === session.user.id,
  );
  const visible = filterStudentProposals(
    records,
    session.user.id,
    filters,
    getProjectById,
  );
  return (
    <main className="project-create student-proposals">
      <header className="project-create__header">
        <Link to="/projects">
          <ArrowLeft size={16} aria-hidden="true" /> Marketplace
        </Link>
        <Link to="/student/dashboard">My workspace</Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </p>
          <h1 ref={heading} tabIndex={-1}>
            Your offers.
            <br />
            <em>Your opportunities.</em>
          </h1>
          <p>
            Follow your proposals, refine your approach, and keep your next
            collaboration in sight.
          </p>
          <div className="student-proposals__metrics">
            <span>{own.length} proposals</span>
            <span>
              {own.filter((record) => record.status === "shortlisted").length}{" "}
              shortlisted
            </span>
            <span>
              {own.filter((record) => record.status === "accepted").length}{" "}
              accepted
            </span>
          </div>
        </div>
      </section>
      <div className="project-create__container student-proposals__body">
        <p className="student-proposals__disclosure">
          Fictional proposals and simulated actions. Saved changes reset on
          refresh. No clients are notified.
        </p>
        <p className="student-proposals__notice" role="status">
          {notice}
        </p>
        <section
          aria-label="Filter your proposals"
          className="project-create__panel student-proposals__filters"
        >
          <Input
            label="Search your proposals"
            type="search"
            placeholder="Project title or cover message"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
          />
          <Select
            label="Proposal status"
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            {[
              "all",
              "submitted",
              "shortlisted",
              "accepted",
              "rejected",
              "withdrawn",
            ].map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : proposalLabel(status)}
              </option>
            ))}
          </Select>
        </section>
        <section aria-labelledby="student-proposals-heading">
          <div className="student-proposals__section-heading">
            <h2 id="student-proposals-heading" ref={listHeading} tabIndex={-1}>
              My proposals
            </h2>
            <p>
              {visible.length} of {own.length} shown · Recently updated first
            </p>
          </div>
          {!visible.length ? (
            <div className="project-create__panel project-create__brief">
              <Send aria-hidden="true" />
              <h3>
                {own.length
                  ? "No matching proposals"
                  : "Your first opportunity is waiting"}
              </h3>
              <p>
                {own.length
                  ? "Try a different project name or status."
                  : "Browse open projects and submit a demo proposal to start your list."}
              </p>
              <div className="project-create__success-links">
                {own.length ? (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ query: "", status: "all" })}
                  >
                    Reset filters
                  </Button>
                ) : (
                  <Link to="/projects">
                    Discover projects{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="student-proposals__list">
              {visible.map((proposal) => {
                const project = getProjectById(proposal.projectId);
                const title = project?.title ?? "Project unavailable";
                const order = orders.find(
                  (record) =>
                    record.proposalId === proposal.id &&
                    record.studentId === session.user.id,
                );
                return (
                  <article
                    key={proposal.id}
                    className="project-create__panel student-proposals__card"
                  >
                    <div className="student-proposals__card-main">
                      <div className="student-proposals__card-meta">
                        <span className="project-create__eyebrow">
                          {proposalLabel(proposal.status)}
                        </span>
                        <span>
                          Updated {formatDate(proposal.updatedAt.slice(0, 10))}
                        </span>
                      </div>
                      <h3>{title}</h3>
                      <p className="student-proposals__cover">
                        {proposal.coverMessage}
                      </p>
                      <div className="project-create__success-links">
                        {project && (
                          <Link to={`/projects/${proposal.projectId}`}>
                            View project brief
                          </Link>
                        )}
                        {order && (
                          <Link to={`/orders/${order.id}`}>
                            View demo order{" "}
                            <ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                      <StudentProposalActions
                        proposal={proposal}
                        projectTitle={title}
                        session={session}
                        onWithdraw={() =>
                          setNotice(
                            `Proposal for ${title} withdrawn — simulation. No notification sent.`,
                          )
                        }
                      />
                    </div>
                    <dl className="student-proposals__offer">
                      <div>
                        <dt>Your offer</dt>
                        <dd>{formatEGP(proposal.priceEGP)}</dd>
                      </div>
                      <div>
                        <dt>Delivery estimate</dt>
                        <dd>{proposal.deliveryDays} days</dd>
                      </div>
                      <div>
                        <dt>Submitted</dt>
                        <dd>{formatDate(proposal.submittedAt.slice(0, 10))}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function StudentProposals() {
  const { session } = useAuth();
  return <ProposalList key={session.user.id} />;
}
