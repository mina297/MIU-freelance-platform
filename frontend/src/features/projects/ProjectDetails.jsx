import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FolderOpen,
  Info,
} from "lucide-react";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import { formatDate } from "../../utils/formatDate.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { getProjectById } from "../marketplace/selectors.js";
import { categoryNames, clientNames, skillNames } from "./catalogueModel.js";

function BackButton({ onBack }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-miu-red hover:bg-[#f9e6eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
    >
      <ArrowLeft size={17} aria-hidden="true" /> All projects
    </button>
  );
}

export default function ProjectDetails({ projectId, onBack, onPropose }) {
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eee9ed] px-5 text-center">
        <div className="max-w-md rounded-2xl border-2 border-[#c9bac1] bg-white p-8 shadow-lg">
          <FolderOpen
            size={34}
            aria-hidden="true"
            className="mx-auto text-miu-red"
          />
          <h1
            id="project-details-heading"
            tabIndex={-1}
            className="mt-4 text-2xl font-bold"
          >
            Project not found
          </h1>
          <p className="mt-2 text-sm text-[#6b6066]">
            This project may have been removed from the preview.
          </p>
          <div className="mt-5">
            <BackButton onBack={onBack} />
          </div>
        </div>
      </main>
    );
  }

  const clientName = clientNames.get(project.clientId) ?? "Client";
  const initials = clientName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const isOpen = project.status === PROJECT_STATUS.OPEN;
  const hasDetailedBrief = Boolean(
    project.scope || project.deliverables?.length,
  );

  return (
    <div className="min-h-screen bg-[#eee9ed] font-sans text-[#292127]">
      <header className="border-b border-[#cdbfc5] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <img
            src={miuLogo}
            alt="Misr International University"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
          <span className="rounded-full border border-[#d8b3bf] bg-[#fceff3] px-3 py-1.5 text-xs font-semibold text-miu-red">
            Phase 1 preview
          </span>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#351923] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-40 size-[450px] rounded-full border-[80px] border-white/[0.06]"
          />
          <div className="relative mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 sm:pb-16">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#f5c5d0] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowLeft size={17} aria-hidden="true" /> Browse projects
            </button>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
                {categoryNames.get(project.categoryId)}
              </span>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isOpen ? "bg-[#ddf5e4] text-[#206b40]" : "bg-white/15 text-white"}`}
              >
                {isOpen
                  ? "Open for proposals"
                  : project.status === PROJECT_STATUS.CLOSED
                    ? "Closed — not accepting proposals"
                    : project.status === PROJECT_STATUS.CANCELLED
                      ? "Cancelled — not accepting proposals"
                      : "Not accepting proposals"}
              </span>
            </div>
            <h1
              id="project-details-heading"
              tabIndex={-1}
              className="mt-5 max-w-3xl text-4xl font-bold leading-[1.14] tracking-[-0.045em] sm:text-5xl"
            >
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#eedde2]">
              {project.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#e4c8d0]">
              <span className="flex items-center gap-2">
                <Clock3 size={16} aria-hidden="true" /> Posted{" "}
                {formatDate(project.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays size={16} aria-hidden="true" /> Due{" "}
                {formatDate(project.deadline)}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1180px] gap-7 px-5 py-9 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            <section
              aria-labelledby="overview-heading"
              className="rounded-2xl border-2 border-[#c9bac1] bg-white p-6 shadow-[0_5px_18px_rgba(57,34,40,0.08)] sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f7e4ea] text-miu-red">
                  <BriefcaseBusiness size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-miu-red">
                    The opportunity
                  </p>
                  <h2 id="overview-heading" className="text-xl font-bold">
                    Project overview
                  </h2>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#342a2f]">
                  Scope of work
                </h3>
                <p className="mt-2 text-base leading-8 text-[#594f54]">
                  {project.scope || project.description}
                </p>
              </div>
              {project.deliverables?.length > 0 && (
                <div className="mt-7 border-t border-[#d9cbd2] pt-6">
                  <h3 className="text-sm font-bold text-[#342a2f]">
                    Expected deliverables
                  </h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {project.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex gap-3 rounded-xl border border-[#dac8d0] bg-[#fbf7f9] p-4 text-sm font-medium leading-6 text-[#554650]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-miu-red"
                        />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!hasDetailedBrief && (
                <p className="mt-3 text-sm text-[#796a71]">
                  No additional brief has been provided in this preview.
                </p>
              )}
              <div className="mt-7 border-t border-[#d9cbd2] pt-6">
                <h3 className="text-sm font-bold text-[#342a2f]">
                  Skills needed
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.requiredSkillIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-lg border border-[#cdbac3] bg-[#f6eef2] px-3 py-2 text-sm font-medium text-[#634757]"
                    >
                      {skillNames.get(id) ?? id}
                    </span>
                  ))}
                </div>
              </div>
            </section>
            <section
              aria-labelledby="timeline-heading"
              className="rounded-2xl border-2 border-[#c9bac1] bg-white p-6 shadow-[0_5px_18px_rgba(57,34,40,0.08)] sm:p-8"
            >
              <h2 id="timeline-heading" className="text-xl font-bold">
                Project timeline
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#d4c3cb] bg-[#faf7f9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#785d6b]">
                    Published
                  </p>
                  <p className="mt-2 font-bold">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div className="rounded-xl border border-[#d4c3cb] bg-[#faf7f9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#785d6b]">
                    Delivery deadline
                  </p>
                  <p className="mt-2 font-bold">
                    {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside
            className="space-y-5 lg:sticky lg:top-6"
            aria-label="Project summary"
          >
            <div className="overflow-hidden rounded-2xl border-2 border-[#b96a80] bg-white shadow-[0_8px_24px_rgba(68,26,40,0.11)]">
              <div className="bg-[#f5e5eb] px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8e465c]">
                  Project budget
                </p>
                <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#341e2a]">
                  {formatEGP(project.budgetEGP)}
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="flex items-center gap-2 text-sm text-[#62545c]">
                  <CalendarDays size={17} aria-hidden="true" /> Deadline:{" "}
                  <strong className="text-[#342a2f]">
                    {formatDate(project.deadline)}
                  </strong>
                </p>
                <div className="mt-5 rounded-xl border border-[#dfc4ce] bg-[#fff7f9] p-4 text-sm leading-6 text-[#694c5b]">
                  <Info
                    size={18}
                    className="mb-2 text-miu-red"
                    aria-hidden="true"
                  />{" "}
                  {isOpen
                    ? "Verified students can submit a simulated proposal on the next screen. No client is contacted in this preview."
                    : "This project is not accepting proposals."}
                </div>
                {isOpen && onPropose && (
                  <button
                    type="button"
                    onClick={onPropose}
                    className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-miu-red px-4 text-sm font-bold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  >
                    Submit proposal
                  </button>
                )}
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-miu-red px-4 text-sm font-bold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                >
                  Explore more projects{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-[#c9bac1] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#8d596b]">
                About the client
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span
                  className="grid size-11 place-items-center rounded-full bg-[#f3e2e8] text-xs font-bold text-[#9b4c62]"
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <div>
                  <p className="font-bold">{clientName}</p>
                  <p className="text-xs text-[#7e6c75]">Fictional client</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
