import { formatEGP } from "../utils/formatCurrency.js";
import { ProfileEmptyState } from "./ProfileStates.jsx";

/**
 * @param {{
 *   projects: Array<{
 *     id: string,
 *     title: string,
 *     category: string,
 *     completedAt: string,
 *     amountEGP: number,
 *   }>,
 *   isOwner?: boolean,
 * }} props
 */
export default function CompletedJobsSection({ projects, isOwner = false }) {
  if (!projects.length) {
    return (
      <ProfileEmptyState
        message={
          isOwner
            ? "Completed jobs will appear here after finished orders."
            : "No completed jobs to show yet."
        }
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-xl font-semibold text-miu-black">Completed jobs</h2>
      <ul className="overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] shadow-[var(--shadow-panel)]">
        {projects.map((project, index) => {
          const dateLabel = new Date(project.completedAt).toLocaleDateString(
            "en-GB",
            { day: "numeric", month: "short", year: "numeric" },
          );
          return (
            <li
              key={project.id}
              className={`flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                index > 0 ? "border-t border-border-soft" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-miu-black">{project.title}</p>
                <p className="mt-1 text-sm text-ink-secondary">
                  {project.category} · Completed {dateLabel}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-miu-black">
                {formatEGP(project.amountEGP)}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-ink-secondary">
        Amounts are fictional Phase 1 demo figures in EGP only.
      </p>
    </div>
  );
}
