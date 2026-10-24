import { useMemo, useState, useSyncExternalStore } from "react";
import { mergeProjects, projectStore } from "./projectStore.js";
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { findProjects } from "../marketplace/selectors.js";
import {
  budgetOptions,
  categories,
  categoryNames,
  matchesBudget,
  openProjects as fixtureOpenProjects,
  skillNames,
} from "./catalogueModel.js";
import CategoryCard from "./CategoryCard.jsx";
import FilterPanel from "./FilterPanel.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectsHero from "./ProjectsHero.jsx";

export default function ProjectsCatalogue({ onOpenProject, onCreateProject }) {
  const demoProjects = useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const openProjects = useMemo(
    () =>
      mergeProjects(fixtureOpenProjects, demoProjects).filter(
        (project) => project.status === PROJECT_STATUS.OPEN,
      ),
    [demoProjects],
  );
  const [searchDraft, setSearchDraft] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [skillId, setSkillId] = useState("");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("newest");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");

  const results = useMemo(() => {
    const matches = findProjects(
      {
        query,
        categoryId,
        skillId,
        status: PROJECT_STATUS.OPEN,
      },
      { projects: openProjects },
    );
    return matches
      .filter((project) => matchesBudget(project.budgetEGP, budget))
      .filter((project) => !savedOnly || savedIds.includes(project.id))
      .sort((a, b) => {
        if (sort === "budget_low") return a.budgetEGP - b.budgetEGP;
        if (sort === "budget_high") return b.budgetEGP - a.budgetEGP;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [
    query,
    categoryId,
    skillId,
    budget,
    sort,
    savedOnly,
    savedIds,
    openProjects,
  ]);

  function clearFilters() {
    setSearchDraft("");
    setQuery("");
    setCategoryId("");
    setSkillId("");
    setBudget("all");
    setSort("newest");
    setSavedOnly(false);
  }

  function toggleSaved(projectId) {
    const projectTitle =
      openProjects.find(({ id }) => id === projectId)?.title ?? "Project";
    setSaveNotice(
      savedIds.includes(projectId)
        ? `${projectTitle} removed from your saved list.`
        : `${projectTitle} saved for this preview.`,
    );
    setSavedIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
  }

  const activeFilters = [
    query && {
      key: "query",
      label: `“${query}”`,
      clear: () => {
        setSearchDraft("");
        setQuery("");
      },
    },
    categoryId && {
      key: "category",
      label: categoryNames.get(categoryId),
      clear: () => setCategoryId(""),
    },
    skillId && {
      key: "skill",
      label: skillNames.get(skillId),
      clear: () => setSkillId(""),
    },
    budget !== "all" && {
      key: "budget",
      label: budgetOptions.find(({ value }) => value === budget)?.label,
      clear: () => setBudget("all"),
    },
    savedOnly && {
      key: "saved",
      label: "Saved only",
      clear: () => setSavedOnly(false),
    },
  ].filter(Boolean);
  const heroProject = openProjects[0];

  return (
    <div className="min-h-screen bg-[#eee9ed] font-sans text-[#262126]">
      <a
        href="#project-results"
        className="sr-only z-50 rounded-lg bg-white p-3 text-miu-red focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to projects
      </a>
      <p role="status" className="sr-only">
        {saveNotice}
      </p>
      <header className="border-b border-[#cdbfc5] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-5">
            <img
              src={miuLogo}
              alt="Misr International University"
              className="h-12 w-auto max-w-[150px] object-contain"
            />
            <span
              className="hidden h-7 w-px bg-[#e7e0e1] sm:block"
              aria-hidden="true"
            />
            <span className="hidden text-sm font-bold text-[#3e3036] sm:block">
              Freelance<span className="text-miu-red">.</span>
            </span>
          </div>
          <nav
            aria-label="Catalogue navigation"
            className="hidden items-center gap-7 text-sm font-semibold text-[#67515c] md:flex"
          >
            <a
              href="#discover"
              className="py-3 hover:text-miu-red focus-visible:outline-2 focus-visible:outline-miu-red"
            >
              Discover
            </a>
            <a
              href="#project-results"
              onClick={() => setSavedOnly(false)}
              className={`border-b-2 py-3 focus-visible:outline-2 focus-visible:outline-miu-red ${savedOnly ? "border-transparent hover:text-miu-red" : "border-miu-red text-miu-red"}`}
            >
              Projects
            </a>
            <a
              href="#project-results"
              onClick={() => setSavedOnly(true)}
              className={`flex items-center gap-2 border-b-2 py-3 hover:text-miu-red focus-visible:outline-2 focus-visible:outline-miu-red ${savedOnly ? "border-miu-red text-miu-red" : "border-transparent"}`}
            >
              <Bookmark size={15} aria-hidden="true" /> Saved{" "}
              <span className="rounded-full bg-[#f8edf0] px-2 py-0.5 text-xs text-miu-red">
                {savedIds.length}
              </span>
            </a>
          </nav>
          {onCreateProject ? (
            <button
              type="button"
              onClick={onCreateProject}
              className="min-h-11 shrink-0 rounded-lg border border-miu-red bg-miu-red px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            >
              Post a project
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fdf2f3] px-3 py-1.5 text-xs font-semibold text-[#a52234]">
              <span
                className="size-1.5 rounded-full bg-miu-red"
                aria-hidden="true"
              />{" "}
              Phase 1 preview
            </span>
          )}
        </div>
      </header>

      <main>
        <ProjectsHero project={heroProject} />

        <div className="relative z-10 mx-auto -mt-10 max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(searchDraft.trim());
            }}
            className="flex flex-col gap-3 rounded-2xl border-2 border-[#b78c9e] focus-within:ring-2 focus-within:ring-[#b91c2b]/40 focus-within:ring-offset-2 bg-white p-3 shadow-[0_22px_50px_-29px_rgba(72,20,34,0.48)] sm:flex-row sm:items-center"
          >
            <span className="hidden size-12 shrink-0 place-items-center rounded-xl bg-[#fdf1f3] text-miu-red sm:grid">
              <Search size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 px-1">
              <label
                htmlFor="project-search"
                className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-[#a24453]"
              >
                Discover projects
              </label>
              <input
                id="project-search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Search project titles or keywords..."
                className="w-full bg-transparent py-1 text-sm text-[#2f272b] outline-none placeholder:text-[#a99fa3]"
              />
            </div>
            {searchDraft && (
              <button
                type="button"
                onClick={() => {
                  setSearchDraft("");
                  setQuery("");
                }}
                aria-label="Clear search"
                className="self-end grid size-11 place-items-center rounded-lg text-[#796b72] hover:bg-[#faf3f4] focus-visible:outline-2 focus-visible:outline-miu-red sm:self-auto"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-miu-red px-7 text-sm font-bold text-white transition-colors hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            >
              Find projects <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="mx-auto max-w-[1280px] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-miu-red">
                Browse by discipline
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#2b2227] sm:text-3xl">
                Find your kind of work
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#797075]">
              Explore opportunities shaped around your interests and skills.
            </p>
          </div>
          <div
            aria-label="Project categories"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id || "all"}
                category={category}
                selected={categoryId === category.id}
                onSelect={setCategoryId}
              />
            ))}
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-6">
              <button
                type="button"
                aria-expanded={filtersOpen}
                aria-controls="catalogue-filters"
                onClick={() => setFiltersOpen((value) => !value)}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-[#bca3af] bg-white px-4 text-sm font-semibold text-[#6f3d50] lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={17} aria-hidden="true" />
                  Refine results{" "}
                  {activeFilters.length > 0 && `(${activeFilters.length})`}
                </span>
                <ChevronDown
                  size={17}
                  className={filtersOpen ? "rotate-180" : ""}
                  aria-hidden="true"
                />
              </button>
              <div
                id="catalogue-filters"
                className={`${filtersOpen ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}
              >
                <FilterPanel
                  budget={budget}
                  setBudget={setBudget}
                  skillId={skillId}
                  setSkillId={setSkillId}
                  savedOnly={savedOnly}
                  setSavedOnly={setSavedOnly}
                  clearFilters={clearFilters}
                  savedCount={savedIds.length}
                />
              </div>
            </div>
            <section
              id="project-results"
              aria-labelledby="results-heading"
              className="min-w-0 scroll-mt-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-miu-red">
                    Fresh opportunities
                  </p>
                  <h2
                    id="results-heading"
                    className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#2b2227] sm:text-[34px]"
                  >
                    Projects to explore
                  </h2>
                  <p role="status" className="mt-1 text-sm text-[#80777c]">
                    {results.length}{" "}
                    {results.length === 1 ? "project" : "projects"} found
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="project-sort"
                    className="mr-2 text-xs font-medium text-[#837a7f]"
                  >
                    Sort by
                  </label>
                  <select
                    id="project-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="rounded-xl border border-[#ab95a1] bg-white px-3 py-2.5 text-sm font-semibold text-[#40363b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  >
                    <option value="newest">Newest first</option>
                    <option value="budget_low">Budget: low to high</option>
                    <option value="budget_high">Budget: high to low</option>
                  </select>
                </div>
              </div>
              {activeFilters.length > 0 && (
                <div
                  aria-label="Active filters"
                  className="mt-5 flex flex-wrap items-center gap-2"
                >
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={filter.clear}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#c58e9f] bg-[#fbeaf0] px-3 py-1.5 text-xs font-semibold text-[#a52c3d] hover:bg-[#fce9ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                    >
                      {filter.label}
                      <X size={13} aria-hidden="true" />
                      <span className="sr-only">Remove filter</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-2 py-1.5 text-xs font-semibold text-[#80767b] hover:text-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  >
                    Clear all
                  </button>
                </div>
              )}
              {results.length ? (
                <div className="mt-6 space-y-4">
                  {results.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      featured={
                        index === 0 &&
                        sort === "newest" &&
                        activeFilters.length === 0
                      }
                      saved={savedIds.includes(project.id)}
                      onToggleSaved={toggleSaved}
                      onOpenProject={onOpenProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-[#bda0ad] bg-[#faf7f9] px-6 py-16 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#fdf2f3] text-miu-red">
                    <Search size={28} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">
                    No matching projects
                  </h3>
                  <p className="mt-2 text-sm text-[#7d7379]">
                    {savedOnly
                      ? "Save a project or turn off the saved filter to see more."
                      : "Try another keyword or adjust your filters."}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-miu-red px-5 py-3 text-sm font-semibold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  >
                    <RotateCcw size={16} aria-hidden="true" /> Clear filters
                  </button>
                </div>
              )}
              <p className="mt-5 text-xs leading-5 text-[#968c91]">
                Fictional Phase 1 listings. Saved projects stay only while this
                preview is open.
              </p>
            </section>
          </div>
        </div>
      </main>
      <footer className="border-t border-[#cdbfc5] bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-7 text-xs text-[#75616b] sm:px-8 lg:px-10">
          <span className="text-sm font-bold text-[#4a2939]">
            MIU Freelance<span className="text-miu-red">.</span>
          </span>
          <span>Student talent. Thoughtful work.</span>
          <a
            href="#discover"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-miu-red hover:underline focus-visible:outline-2 focus-visible:outline-miu-red"
          >
            Back to discovery <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
