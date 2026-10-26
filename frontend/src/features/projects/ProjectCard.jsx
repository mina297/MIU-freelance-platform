import { useLanguage } from "../../i18n/LanguageContext.js";
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
  onOpenProject,
}) {
  const { t, locale } = useLanguage();

  const [expanded, setExpanded] = useState(false);
  const clientName = clientNames.get(project.clientId) ?? "Client";
  const clientInitials = clientName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  const category = categories.find(({ id }) => id === project.categoryId);
  const CategoryIcon = category?.icon ?? BriefcaseBusiness;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border-2 bg-[var(--theme-surface,#fff)] shadow-[0_5px_18px_rgba(57,34,40,0.09)] transition-shadow hover:shadow-[0_18px_45px_-27px_rgba(73,29,41,0.35)] motion-reduce:transition-none ${featured ? "border-[color:var(--theme-border,#b45d77)]" : "border-[color:var(--theme-divider,#c9bac1)]"}`}
    >
      {featured && (
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--theme-divider,#d9a9b9)] bg-[color:var(--theme-accent-surface,#f9e5ed)] px-5 py-2.5 text-[11px] font-semibold text-[color:var(--theme-accent,#9c3144)] sm:px-6">
          <span className="flex items-center gap-2 uppercase tracking-[0.13em]">
            <Sparkles size={13} aria-hidden="true" /> {t("Latest opportunity")}
          </span>
          <span className="hidden sm:inline">
            {t("Explore the brief. Find your fit.")}
          </span>
        </div>
      )}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_190px]">
        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${category?.tone ?? "bg-[color:var(--theme-accent-surface,#f9e5e9)] text-[var(--theme-accent,var(--color-miu-red))]"}`}
            >
              <CategoryIcon size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--theme-muted-text,#79656d)]">
                {categoryNames.get(project.categoryId)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--theme-muted-text,#766e73)]">
                {t("Posted")} {formatDate(project.createdAt, locale)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSaved(project.id)}
              aria-pressed={saved}
              aria-label={t(
                saved
                  ? "Remove {title} from saved projects"
                  : "Save {title} to saved projects",
                { title: project.title },
              )}
              title={t("Saved only during this preview")}
              className={`ms-auto grid size-11 shrink-0 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${saved ? "border-[color:var(--theme-border,#b96a80)] bg-[color:var(--theme-accent-surface,#f9e5ed)] text-[var(--theme-accent,var(--color-miu-red))]" : "border-[color:var(--theme-border,#bba8b2)] bg-[var(--theme-surface,#fff)] text-[color:var(--theme-muted-text,#796b72)] hover:border-miu-red hover:text-[var(--theme-accent,var(--color-miu-red))]"}`}
            >
              <Bookmark
                size={17}
                fill={saved ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>
          <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.025em] text-[color:var(--theme-text,#292127)] sm:text-[22px]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--theme-muted-text,#71676d)]">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.requiredSkillIds.map((id) => (
              <span
                key={id}
                className="rounded-md border border-[color:var(--theme-border,#d4c4cc)] bg-[color:var(--theme-subtle-surface,#f3edf0)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--theme-muted-text,#655b61)]"
              >
                {skillNames.get(id)}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-[color:var(--theme-muted-text,#6f626a)]">
            <span
              className="grid size-6 place-items-center rounded-full bg-[color:var(--theme-subtle-surface,#eee5e7)] text-[9px] font-bold text-[color:var(--theme-accent,#955263)]"
              aria-hidden="true"
            >
              {clientInitials}
            </span>
            <span className="font-semibold">{clientName}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 border-t border-[color:var(--theme-border,#ceb5c1)] bg-[color:var(--theme-accent-surface,#f2e9ee)] p-5 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex justify-between gap-4 lg:block">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--theme-muted-text,#77666f)]">
                {t("Project budget")}
              </span>
              <strong className="mt-1 block whitespace-nowrap text-xl tracking-[-0.04em] text-[color:var(--theme-accent,#39222c)]">
                {formatEGP(project.budgetEGP, locale)}
              </strong>
            </div>
            <div className="lg:mt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--theme-muted-text,#77666f)]">
                {t("Deadline")}
              </span>
              <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[color:var(--theme-muted-text,#65565f)]">
                <CalendarDays size={13} aria-hidden="true" />
                {formatDate(project.deadline, locale)}
              </span>
            </div>
          </div>
          <div>
            <span className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-[color:var(--theme-success-text,#28784b)]">
              <span
                className="size-1.5 rounded-full bg-[#3bad69]"
                aria-hidden="true"
              />{" "}
              {t("Open for proposals")}
            </span>
            <button
              type="button"
              aria-expanded={onOpenProject ? undefined : expanded}
              aria-controls={onOpenProject ? undefined : `brief-${project.id}`}
              onClick={() =>
                onOpenProject
                  ? onOpenProject(project.id)
                  : setExpanded((value) => !value)
              }
              className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${featured ? "bg-miu-red text-white hover:bg-miu-red-dark" : "border border-[color:var(--theme-border,#b5869a)] bg-[var(--theme-surface,#fff)] text-[color:var(--theme-accent,#703647)] hover:border-miu-red hover:bg-[color:var(--theme-accent-surface,#fff3f5)]"}`}
            >
              {onOpenProject
                ? t("View project")
                : expanded
                  ? t("Close brief")
                  : t("View brief")}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className={expanded ? "rotate-90" : ""}
              />
            </button>
          </div>
        </div>
      </div>
      {!onOpenProject && expanded && (
        <div
          id={`brief-${project.id}`}
          className="border-t border-[color:var(--theme-border,#d0b8c3)] bg-[color:var(--theme-accent-surface,#f7edf2)] p-5 text-sm leading-6 text-[color:var(--theme-muted-text,#60525a)] sm:p-6"
        >
          <h4 className="font-bold text-[color:var(--theme-text,#392731)]">
            {t("What you will work on")}
          </h4>
          <p className="mt-1">{project.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p>
              <span className="block text-xs font-semibold text-[color:var(--theme-muted-text,#80636f)]">
                {t("Skills to bring")}
              </span>
              {project.requiredSkillIds
                .map((id) => skillNames.get(id))
                .join(", ")}
            </p>
            <p>
              <span className="block text-xs font-semibold text-[color:var(--theme-muted-text,#80636f)]">
                {t("Delivery deadline")}
              </span>
              {formatDate(project.deadline, locale)}
            </p>
          </div>
          <p className="mt-4 text-xs text-[color:var(--theme-muted-text,#7c6570)]">
            {t("Preview only. Proposal submission is not available yet.")}
          </p>
        </div>
      )}
    </article>
  );
}
