import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FilePenLine, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { projectStore } from "./projectStore.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import "./project-create.css";
import ProjectActions from "./ProjectActions.jsx";

export default function ClientProjects() {
  const { t, locale } = useLanguage();

  const { session } = useAuth();
  const records = useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getWorkspaceSnapshot,
    projectStore.getWorkspaceSnapshot,
  );
  const projects = records
    .filter((project) => project.clientId === session.user.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <main className="project-create">
      <header className="project-create__header">
        <Link to="/projects">{t("MIU Freelance.")}</Link>
        <Link to="/client/projects/new">
          <Plus size={16} aria-hidden="true" /> {t("Create a project")}
        </Link>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {t("YOUR CLIENT WORKSPACE")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {t("Your ideas.")}
            <br />
            <em>{t("Taking shape.")}</em>
          </h1>
          <p>
            {t(
              "Revisit a draft, refine an open brief, and keep your projects moving.",
            )}
          </p>
        </div>
      </section>
      <div className="project-create__container project-create__project-list">
        <div>
          <h2 className="text-2xl font-bold">
            {t("My projects")}{" "}
            <span className="text-base font-normal">({projects.length})</span>
          </h2>
          <p className="mt-2 text-sm text-[color:var(--theme-muted-text,#685963)]">
            {t(
              "Fictional demo records only. Saved drafts and changes reset on refresh.",
            )}
          </p>
        </div>
        {!projects.length ? (
          <section className="project-create__panel project-create__brief">
            <FilePenLine aria-hidden="true" />
            <h3>{t("No projects yet")}</h3>
            <p>
              {t(
                "Start a brief and save it as a draft whenever you need a break.",
              )}
            </p>
            <div className="project-create__success-links">
              <Link to="/client/projects/new">
                {t("Create your first project")}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : (
          projects.map((record) => {
            const draft = record.status === "draft";
            return (
              <article
                key={record.id}
                className="project-create__panel project-create__brief"
              >
                <div className="project-create__list-meta">
                  <span className="project-create__eyebrow">
                    {draft
                      ? t("PRIVATE DRAFT")
                      : record.status.replaceAll("_", " ")}
                  </span>
                  <span>
                    {t("Updated")}{" "}
                    {formatDate(record.updatedAt.slice(0, 10), locale)}
                  </span>
                </div>
                <h3>
                  {draft
                    ? record.values.title.trim() || "Untitled project"
                    : record.title}
                </h3>
                <p className="project-create__prose">
                  {draft
                    ? t(
                        "Only you can access this draft. Complete the brief before publishing.",
                      )
                    : `${formatEGP(record.budgetEGP, locale)} · Deadline ${formatDate(record.deadline, locale)}`}
                </p>
                <div className="project-create__success-links">
                  {["draft", "open"].includes(record.status) && (
                    <Link to={`/client/projects/${record.id}/edit`}>
                      {draft ? t("Continue draft") : t("Edit project")}{" "}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                  {!draft && (
                    <Link to={`/client/projects/${record.id}/proposals`}>
                      {t("Review proposals")}
                    </Link>
                  )}
                  {!draft && (
                    <Link to={`/projects/${record.id}`}>
                      {t("View project")}
                    </Link>
                  )}
                </div>
                <ProjectActions project={record} session={session} />
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
