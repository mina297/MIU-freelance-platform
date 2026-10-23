import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getProjectById } from "../marketplace/selectors.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import ProposalForm from "./ProposalForm.jsx";

export default function ProposalEntry() {
  const { projectId } = useParams();
  const { session } = useAuth();
  const heading = useRef(null);
  const project = getProjectById(projectId);
  const isOpen = project?.status === PROJECT_STATUS.OPEN;
  const verified = session.user?.verificationStatus === "approved";

  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [projectId]);

  return (
    <main className="min-h-screen bg-[#eee9ed] px-5 py-12 text-[#292127] sm:px-8">
      <section className="mx-auto max-w-6xl rounded-2xl border-2 border-[#c9bac1] bg-white p-6 shadow-lg sm:p-10">
        <p className="text-sm font-semibold text-miu-red">Phase 1 preview</p>
        <h1 ref={heading} tabIndex={-1} className="mt-4 text-3xl font-bold">
          {!project
            ? "Project not found"
            : !isOpen
              ? "Proposals are closed"
              : "Prepare your proposal"}
        </h1>
        {project && (
          <h2 className="mt-4 text-xl font-semibold">{project.title}</h2>
        )}
        <p className="mt-4 leading-7">
          {!project
            ? "This project is unavailable. Browse the catalogue for another opportunity."
            : !isOpen
              ? "This project is not accepting proposals."
              : !verified
                ? "Student verification is required before submitting a proposal. The verification workflow is still planned in this preview."
                : "Prepare your offer below. Submission is not available in this preview yet."}
        </p>
        <Link
          to={project ? `/projects/${project.id}` : "/projects"}
          className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-miu-red px-4 font-semibold text-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
        >
          {project ? "Back to project" : "Browse projects"}
        </Link>
        {isOpen && <ProposalForm project={project} />}
      </section>
    </main>
  );
}
