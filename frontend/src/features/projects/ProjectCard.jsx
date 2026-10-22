import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";
import { formatEGP } from "../../utils/formatEGP.js";
import {
  categories,
  categoryNames,
  clientNames,
  skillNames,
} from "./catalogueModel.js";

export default function ProjectCard({
  project,
  featured,
  saved,
  onToggleSaved,
}) {
  const [expanded, setExpanded] = useState(false);
  const clientName = clientNames.get(project.clientId) ?? "Demo client";
  const clientInitials = clientName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  const category = categories.find(({ id }) => id === project.categoryId);
  const CategoryIcon = category?.icon ?? BriefcaseBusiness;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-[0_5px_18px_rgba(57,34,40,0.09)] transition-shadow hover:shadow-[0_18px_45px_-27px_rgba(73,29,41,0.35)] motion-reduce:transition-none ${featured ? "border-[#b45d77]" : "border-[#c9bac1]"}`}
    >
      {featured && (
        <div className="flex items-center justify-between gap-3 border-b border-[#d9a9b9] bg-[#f9e5ed] px-5 py-2.5 text-[11px] font-semibold text-[#9c3144] sm:px-6">
          <span className="flex items-center gap-2 uppercase tracking-[0.13em]">
            <Sparkles size={13} aria-hidden="true" /> Latest opportunity
          </span>
          <span className="hidden sm:inline">
            Explore the brief. Find your fit.
          </span>
        </div>
      )}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_190px]">
        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${category?.tone ?? "bg-[#f9e5e9] text-miu-red"}`}
            >
              <CategoryIcon size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#79656d]">
                {categoryNames.get(project.categoryId)}
              </p>
              <p className="mt-1 text-xs text-[#766e73]">
                Posted {formatDate(project.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSaved(project.id)}
              aria-pressed={saved}
              aria-label={`${saved ? "Remove" : "Save"} ${project.title} ${saved ? "from" : "to"} saved projects`}
              title="Saved only during this preview"
              className={`ml-auto grid size-11 shrink-0 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${saved ? "border-[#b96a80] bg-[#f9e5ed] text-miu-red" : "border-[#bba8b2] bg-white text-[#796b72] hover:border-miu-red hover:text-miu-red"}`}
            >
              <Bookmark
                size={17}
                fill={saved ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>
          <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.025em] text-[#292127] sm:text-[22px]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#71676d]">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.requiredSkillIds.map((id) => (
              <span
                key={id}
                className="rounded-md border border-[#d4c4cc] bg-[#f3edf0] px-2.5 py-1.5 text-xs font-medium text-[#655b61]"
              >
                {skillNames.get(id)}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-[#6f626a]">
            <span
              className="grid size-6 place-items-center rounded-full bg-[#eee5e7] text-[9px] font-bold text-[#955263]"
              aria-hidden="true"
            >
              {clientInitials}
            </span>
            <span className="font-semibold">{clientName}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 border-t border-[#ceb5c1] bg-[#f2e9ee] p-5 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex justify-between gap-4 lg:block">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77666f]">
                Project budget
              </span>
              <strong className="mt-1 block whitespace-nowrap text-xl tracking-[-0.04em] text-[#39222c]">
                {formatEGP(project.budgetEGP)}
              </strong>
            </div>
            <div className="lg:mt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77666f]">
                Deadline
              </span>
              <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[#65565f]">
                <CalendarDays size={13} aria-hidden="true" />
                {formatDate(project.deadline)}
              </span>
            </div>
          </div>
          <div>
            <span className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#28784b]">
              <span
                className="size-1.5 rounded-full bg-[#3bad69]"
                aria-hidden="true"
              />{" "}
              Open for proposals
            </span>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`brief-${project.id}`}
              onClick={() => setExpanded((value) => !value)}
              className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${featured ? "bg-miu-red text-white hover:bg-miu-red-dark" : "border border-[#b5869a] bg-white text-[#703647] hover:border-miu-red hover:bg-[#fff3f5]"}`}
            >
              {expanded ? "Close brief" : "View brief"}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className={expanded ? "rotate-90" : ""}
              />
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div
          id={`brief-${project.id}`}
          className="border-t border-[#d0b8c3] bg-[#f7edf2] p-5 text-sm leading-6 text-[#60525a] sm:p-6"
        >
          <h4 className="font-bold text-[#392731]">What you will work on</h4>
          <p className="mt-1">{project.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p>
              <span className="block text-xs font-semibold text-[#80636f]">
                Skills to bring
              </span>
              {project.requiredSkillIds
                .map((id) => skillNames.get(id))
                .join(", ")}
            </p>
            <p>
              <span className="block text-xs font-semibold text-[#80636f]">
                Delivery deadline
              </span>
              {formatDate(project.deadline)}
            </p>
          </div>
          <p className="mt-4 text-xs text-[#7c6570]">
            Preview only. Proposal submission is not available yet.
          </p>
        </div>
      )}
    </article>
  );
}
