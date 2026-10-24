import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bookmark, Scale } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getProjectById } from "../marketplace/selectors.js";
import { projectStore } from "../projects/projectStore.js";
import { proposalStore } from "./proposalStore.js";
import {
  filterClientProposals,
  proposalLabel,
  studentName,
} from "./clientProposalModel.js";
import { MOCK_PROPOSAL_ATTACHMENTS } from "./mockAttachments.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import ProposalComparison from "./ProposalComparison.jsx";
import ProposalDecisionActions from "./ProposalDecisionActions.jsx";
import { orderStore } from "../orders/orderStore.js";
import { clientEligibility } from "../projects/projectCreation.js";
import "../projects/project-create.css";
import "./client-proposals.css";

function ReviewWorkspace({ project, proposals }) {
  const { session } = useAuth();
  const [filters, setFilters] = useState({
    query: "",
    status: "all",
    sort: "newest",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const heading = useRef(null);
  const orders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const linkedOrder = orders.find(
    (order) =>
      order.sourceType === "project" &&
      order.sourceId === project.id &&
      order.clientId === session.user.id,
  );
  const resultsHeading = useRef(null);
  const restoreResultsFocus = useRef(false);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  useEffect(() => {
    if (restoreResultsFocus.current) {
      resultsHeading.current?.focus();
      restoreResultsFocus.current = false;
    }
  }, [notice]);
  const visible = filterClientProposals(proposals, filters);
  const selected = selectedIds
    .map((id) => proposals.find((proposal) => proposal.id === id))
    .filter(Boolean);
  const setFilter = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  function toggleCompare(proposal, checked) {
    if (checked && selectedIds.length >= 3) return;
    setSelectedIds((current) =>
      checked
        ? [...current, proposal.id]
        : current.filter((id) => id !== proposal.id),
    );
    setNotice(
      `${studentName(proposal.studentId)} ${checked ? "added to" : "removed from"} comparison.`,
    );
  }
  function shortlist(proposal) {
    const result = proposalStore.shortlist(
      proposal.id,
      session,
      proposal.status !== "shortlisted",
    );
    setError(result.ok ? "" : result.error);
    if (
      result.ok &&
      filters.status !== "all" &&
      filters.status !== result.proposal.status
    )
      restoreResultsFocus.current = true;
    setNotice(
      result.ok
        ? `${studentName(proposal.studentId)} ${result.proposal.status === "shortlisted" ? "shortlisted" : "removed from shortlist"} — simulation. No notification sent.`
        : "",
    );
  }
  return (
    <main className="project-create client-proposals">
      <header className="project-create__header">
        <Link to="/client/projects">
          <ArrowLeft size={16} aria-hidden="true" /> My projects
        </Link>
        <Link to={`/projects/${project.id}`}>
          View project <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            THE RIGHT PEOPLE. THE RIGHT APPROACH.
          </p>
          <h1 ref={heading} tabIndex={-1}>
            Meet the talent.
            <br />
            <em>Find your next collaborator.</em>
          </h1>
          <p>{project.title}</p>
          <div className="client-proposals__hero-facts">
            <span>{formatEGP(project.budgetEGP)} project budget</span>
            <span>{proposals.length} proposals received</span>
            <span>
              {
                proposals.filter(
                  (proposal) => proposal.status === "shortlisted",
                ).length
              }{" "}
              shortlisted
            </span>
          </div>
        </div>
      </section>
      <div className="project-create__container client-proposals__body">
        <p className="client-proposals__disclosure">
          Fictional proposals and simulated decisions. Accepting an offer
          creates a demo order awaiting payment. No real hiring, notification,
          payment or escrow funding occurs. Changes reset on refresh.
        </p>
        <p role="status" className="client-proposals__notice">
          {notice}
        </p>
        {error && (
          <p role="alert" className="project-create__alert">
            {error}
          </p>
        )}
        {linkedOrder && (
          <div className="project-create__panel project-create__brief">
            <h2 className="text-xl font-bold">Project order linked</h2>
            <p className="mt-3">
              A fictional order is linked to this project. Open its summary to
              review the agreed terms.
            </p>
            <div className="project-create__success-links">
              <Link to={`/orders/${linkedOrder.id}`}>View demo order</Link>
            </div>
          </div>
        )}
        {project.status === "open" && clientEligibility(session, true) && (
          <p className="project-create__alert">
            An approved demo client session is required to accept an offer. You
            can still review, shortlist or reject proposals.
          </p>
        )}
        {project.status !== "open" && (
          <p className="project-create__alert">
            This project is not open. Proposals can be reviewed and compared,
            but shortlisting is unavailable.
          </p>
        )}
        <section
          className="project-create__panel client-proposals__filters"
          aria-label="Filter and sort proposals"
        >
          <Input
            label="Search proposals"
            type="search"
            value={filters.query}
            onChange={setFilter("query")}
            placeholder="Student name or cover message"
          />
          <Select
            label="Proposal status"
            value={filters.status}
            onChange={setFilter("status")}
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
          <Select
            label="Sort proposals"
            value={filters.sort}
            onChange={setFilter("sort")}
          >
            <option value="newest">Newest first</option>
            <option value="price">Lowest price</option>
            <option value="delivery">Shortest delivery</option>
          </Select>
        </section>
        <section
          aria-labelledby="proposal-comparison-heading"
          className="project-create__panel client-proposals__comparison"
        >
          <div className="client-proposals__section-heading">
            <div>
              <p className="project-create__eyebrow">A CLEARER PERSPECTIVE</p>
              <h2 id="proposal-comparison-heading">
                <Scale aria-hidden="true" size={22} /> Compare offers (
                {selected.length}/3)
              </h2>
            </div>
            {selected.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedIds([]);
                  setNotice("Comparison selection cleared.");
                }}
              >
                Clear comparison
              </Button>
            )}
          </div>
          <ProposalComparison proposals={selected} />
        </section>
        <section aria-labelledby="incoming-proposals-heading">
          <div className="client-proposals__section-heading">
            <h2
              id="incoming-proposals-heading"
              ref={resultsHeading}
              tabIndex={-1}
            >
              Incoming proposals
            </h2>
            <p>
              {visible.length} of {proposals.length} shown
            </p>
          </div>
          {!visible.length ? (
            <div className="project-create__panel project-create__brief">
              <h3>
                {proposals.length
                  ? "No matching proposals"
                  : "Your next collaborator is still on the way"}
              </h3>
              <p>
                {proposals.length
                  ? "Try a different search or status filter."
                  : "New demo submissions will appear here. You can return after a student submits a proposal."}
              </p>
              {proposals.length > 0 && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() =>
                    setFilters({ query: "", status: "all", sort: "newest" })
                  }
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="client-proposals__cards">
              {visible.map((proposal) => {
                const name = studentName(proposal.studentId);
                const compared = selectedIds.includes(proposal.id);
                const canShortlist =
                  project.status === "open" &&
                  ["submitted", "shortlisted"].includes(proposal.status);
                return (
                  <article
                    key={proposal.id}
                    className="project-create__panel client-proposals__card"
                  >
                    <div className="client-proposals__card-main">
                      <div className="client-proposals__identity">
                        <span
                          className="client-proposals__avatar"
                          aria-hidden="true"
                        >
                          {name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <div>
                          <h3>{name}</h3>
                          <Link
                            to={`/students/${proposal.studentId}`}
                            className="text-sm text-miu-red underline"
                          >
                            View student profile
                          </Link>
                          <p>
                            Submitted{" "}
                            {formatDate(proposal.submittedAt.slice(0, 10))}
                          </p>
                        </div>
                        <span className="client-proposals__badge">
                          {proposalLabel(proposal.status)}
                        </span>
                      </div>
                      <p className="client-proposals__cover">
                        {proposal.coverMessage}
                      </p>
                      {proposal.attachmentIds.length > 0 && (
                        <div className="client-proposals__attachments">
                          <h4>Fictional sample attachments</h4>
                          <ul>
                            {proposal.attachmentIds.map((id) => (
                              <li key={id}>
                                {MOCK_PROPOSAL_ATTACHMENTS.find(
                                  (sample) => sample.id === id,
                                )?.name ?? "Unavailable sample metadata"}
                              </li>
                            ))}
                          </ul>
                          <p>Metadata only; no files to download.</p>
                        </div>
                      )}
                      <p className="client-proposals__profile-note">
                        Student profiles are not available in this preview.
                      </p>
                      <Checkbox
                        label={`Compare proposal from ${name}`}
                        checked={compared}
                        disabled={!compared && selectedIds.length >= 3}
                        onChange={(event) =>
                          toggleCompare(proposal, event.target.checked)
                        }
                      />
                    </div>
                    <div className="client-proposals__offer">
                      <span className="project-create__eyebrow">
                        PROPOSED PRICE
                      </span>
                      <strong>{formatEGP(proposal.priceEGP)}</strong>
                      <span className="client-proposals__delivery">
                        {proposal.deliveryDays} days delivery
                      </span>
                      <Button
                        variant={
                          proposal.status === "shortlisted"
                            ? "primary"
                            : "outline"
                        }
                        disabled={!canShortlist}
                        onClick={() => shortlist(proposal)}
                      >
                        <Bookmark size={16} aria-hidden="true" />
                        {proposal.status === "shortlisted"
                          ? "Remove shortlist"
                          : "Shortlist"}
                      </Button>
                      <ProposalDecisionActions
                        proposal={proposal}
                        project={project}
                        session={session}
                        onResult={(result) => {
                          restoreResultsFocus.current = true;
                          setError("");
                          setNotice(
                            result.proposal.status === "accepted"
                              ? "Proposal accepted — simulation. One demo order awaits payment; no money moved."
                              : "Proposal rejected — simulation. No notification sent.",
                          );
                        }}
                      />
                    </div>
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

export default function ClientProposals() {
  const { projectId } = useParams();
  const { session } = useAuth();
  const allProposals = useSyncExternalStore(
    proposalStore.subscribe,
    proposalStore.getSnapshot,
    proposalStore.getSnapshot,
  );
  useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const project = getProjectById(projectId);
  if (!project || project.clientId !== session.user.id)
    return (
      <main className="project-create">
        <div className="project-create__container project-create__brief">
          <h1 className="text-3xl font-bold">Proposals unavailable</h1>
          <p className="mt-4">
            This project is unavailable or does not belong to your account.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center text-miu-red underline"
            to="/client/projects"
          >
            Return to My projects
          </Link>
        </div>
      </main>
    );
  return (
    <ReviewWorkspace
      key={`${session.user.id}:${projectId}`}
      project={project}
      proposals={allProposals.filter(
        (proposal) => proposal.projectId === projectId,
      )}
    />
  );
}
