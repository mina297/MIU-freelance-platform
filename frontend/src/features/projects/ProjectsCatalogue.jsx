import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  Code2,
  LayoutGrid,
  Palette,
  PenLine,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { findProjects } from "../marketplace/selectors.js";

const openProjects = marketplaceData.projects.filter(
  (project) => project.status === PROJECT_STATUS.OPEN,
);
const categoryNames = new Map(
  marketplaceData.categories.map(({ id, label }) => [id, label]),
);
const skillNames = new Map(
  marketplaceData.skills.map(({ id, label }) => [id, label]),
);
const clientNames = new Map(
  marketplaceData.participants.clients.map(({ id, displayName }) => [id, displayName]),
);
const categoryOptions = [
  { id: "", label: "All projects", icon: LayoutGrid },
  { id: "web_development", label: "Development", icon: Code2 },
  { id: "graphic_design", label: "Design", icon: Palette },
  { id: "writing", label: "Writing", icon: PenLine },
];
const budgetOptions = [
  { value: "all", label: "Any budget" },
  { value: "under3000", label: "Under EGP 3,000" },
  { value: "3000to6000", label: "EGP 3,000–6,000" },
  { value: "over6000", label: "Over EGP 6,000" },
];

function matchesBudget(amount, budget) {
  if (budget === "under3000") return amount < 3000;
  if (budget === "3000to6000") return amount >= 3000 && amount <= 6000;
  if (budget === "over6000") return amount > 6000;
  return true;
}

function CategoryRail({ categoryId, onChange }) {
  return (
    <nav aria-label="Project categories" className="relative mt-9">
      <div aria-hidden="true" className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-[#ddd8d3] sm:block" />
      <div className="grid grid-cols-4 gap-2">
        {categoryOptions.map(({ id, label, icon: Icon }) => {
          const selected = categoryId === id;
          const count = openProjects.filter(
            (project) => !id || project.categoryId === id,
          ).length;
          return (
            <button
              key={id || "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className="relative flex min-w-0 flex-col items-center gap-2 rounded-lg px-1 py-1 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            >
              <span className={`grid size-10 place-items-center rounded-full border-2 bg-[#f7f6f4] transition-colors ${selected ? "border-miu-red text-miu-red shadow-[0_0_0_4px_#f7e3e6]" : "border-[#ddd8d3] text-[#8b8580] hover:border-[#c97984] hover:text-miu-red"}`}>
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className={`text-[11px] font-semibold leading-tight sm:text-sm ${selected ? "text-miu-red" : "text-[#aaa49f]"}`}>{label}</span>
              <span className="text-[10px] text-[#aaa49f]">{count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Field({ label, id, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#292522]">{label}</label>
      {children}
    </div>
  );
}

function ProjectRow({ project, index, saved, onToggleSaved }) {
  const clientName = clientNames.get(project.clientId) ?? "Demo client";
  return (
    <article className="grid gap-4 border-b border-[#e9e5e0] px-5 py-7 transition-colors last:border-b-0 hover:bg-[#fffdfb] sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-5 sm:px-8 lg:grid-cols-[42px_minmax(0,1fr)_195px] lg:gap-6">
      <div className="hidden size-10 place-items-center rounded-full border border-[#e6d9d9] bg-white text-xs font-bold text-miu-red sm:grid" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-miu-red">
            {categoryNames.get(project.categoryId)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef7f1] px-2.5 py-1 text-[11px] font-semibold text-[#237247]">
            <span className="size-1.5 rounded-full bg-[#269253]" aria-hidden="true" /> Open
          </span>
        </div>
        <h3 className="mt-2 text-[19px] font-bold leading-snug tracking-[-0.025em] text-[#24201e] sm:text-[21px]">
          {project.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716b66]">{project.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-medium text-[#89827c]">By {clientName}</span>
          <span className="text-[#c9c2bd]" aria-hidden="true">·</span>
          <span className="text-xs text-[#89827c]">Posted {formatDate(project.createdAt)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.requiredSkillIds.map((id) => (
            <span key={id} className="rounded-md border border-[#e7e2dc] bg-[#f9f8f6] px-2.5 py-1 text-xs font-medium text-[#65605b]">
              {skillNames.get(id)}
            </span>
          ))}
        </div>
        <details className="group mt-5">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-miu-red hover:text-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
            View brief <ArrowRight size={16} aria-hidden="true" className="transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-3 rounded-lg border border-[#eee5e3] bg-[#faf8f6] p-4 text-sm leading-6 text-[#625b55]">
            <p><strong className="text-[#302a26]">Scope:</strong> {project.description}</p>
            <p className="mt-1"><strong className="text-[#302a26]">Deadline:</strong> {formatDate(project.deadline)}</p>
            <p className="mt-2 text-xs text-[#8f8780]">This is a demo brief. Full details and proposals are planned for a later screen.</p>
          </div>
        </details>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-[#eee9e5] pt-4 lg:flex-col lg:items-end lg:justify-start lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className="lg:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b928b]">Budget</p>
          <p className="mt-1 text-lg font-bold tracking-[-0.03em] text-[#29221f]">{formatEGP(project.budgetEGP)}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#77706a]"><CalendarDays size={14} aria-hidden="true" /> Due {formatDate(project.deadline)}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleSaved(project.id)}
          aria-pressed={saved}
          aria-label={`${saved ? "Remove" : "Save"} ${project.title} ${saved ? "from" : "to"} saved projects`}
          title="Saved only during this preview"
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${saved ? "border-[#e8bec4] bg-[#fdf2f3] text-miu-red" : "border-[#e2dcd6] bg-white text-[#6d625e] hover:border-miu-red hover:text-miu-red"}`}
        >
          {saved ? <Check size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}

export default function ProjectsCatalogue() {
  const [searchDraft, setSearchDraft] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [skillId, setSkillId] = useState("");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("newest");
  const [savedIds, setSavedIds] = useState([]);

  const results = useMemo(() => {
    const matches = findProjects({
      query,
      categoryId,
      skillId,
      status: PROJECT_STATUS.OPEN,
    });
    return matches.filter((project) => matchesBudget(project.budgetEGP, budget)).sort((a, b) => {
      if (sort === "budget_low") return a.budgetEGP - b.budgetEGP;
      if (sort === "budget_high") return b.budgetEGP - a.budgetEGP;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [query, categoryId, skillId, budget, sort]);

  function clearFilters() {
    setSearchDraft("");
    setQuery("");
    setCategoryId("");
    setSkillId("");
    setBudget("all");
    setSort("newest");
  }

  function toggleSaved(projectId) {
    setSavedIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
  }

  const activeFilters = [
    query && { label: `Search: ${query}`, clear: () => { setSearchDraft(""); setQuery(""); } },
    categoryId && { label: categoryNames.get(categoryId), clear: () => setCategoryId("") },
    skillId && { label: skillNames.get(skillId), clear: () => setSkillId("") },
    budget !== "all" && { label: budgetOptions.find(({ value }) => value === budget)?.label, clear: () => setBudget("all") },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f6f4] font-sans text-[#292522]">
      <header className="border-b border-[#ebe8e4] bg-white">
        <div className="mx-auto max-w-4xl px-5 pb-7 pt-5 text-center">
          <img src={miuLogo} alt="Misr International University" className="mx-auto h-[54px] w-auto object-contain" />
          <div className="mx-auto mt-5 h-0.5 w-10 rounded-full bg-miu-red" aria-hidden="true" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-miu-red">MIU freelance platform</p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.035em] text-[#1e1c1a] sm:text-[32px]">
            Explore student opportunities
          </h1>
          <p className="mt-2 text-sm text-[#746e69]">Discover a project that fits your skills and ambitions.</p>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-8 sm:px-6">
        <CategoryRail categoryId={categoryId} onChange={setCategoryId} />

        <section aria-labelledby="catalogue-heading" className="mt-9 overflow-hidden rounded-[15px] border border-[#e3dfda] border-l-[4px] border-l-miu-red bg-white shadow-[0_10px_27px_-18px_rgba(43,32,28,0.22)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebe7e2] bg-[linear-gradient(110deg,#fff8f8_0%,#fff_55%)] px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-miu-red text-white shadow-[0_4px_9px_rgba(185,28,43,0.16)]"><SlidersHorizontal size={19} aria-hidden="true" /></span>
              <div>
                <h2 id="catalogue-heading" className="text-[17px] font-bold tracking-[-0.02em] text-[#a51425]">Find your next project</h2>
                <p className="text-xs text-[#837c76]">Browse and refine available opportunities</p>
              </div>
            </div>
            <span className="rounded-full bg-miu-red px-3 py-1.5 text-xs font-semibold text-white">{results.length} open {results.length === 1 ? "project" : "projects"}</span>
          </div>

          <form role="search" onSubmit={(event) => { event.preventDefault(); setQuery(searchDraft.trim()); }} className="grid gap-4 border-b border-[#ebe7e2] px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Field label="Search projects" id="project-search">
              <div className="flex h-[50px] items-center rounded-lg border border-[#dfdad4] bg-[#f8f7f5] pl-3.5 focus-within:border-miu-red focus-within:ring-2 focus-within:ring-[#f5dce0]">
                <Search size={18} aria-hidden="true" className="shrink-0 text-[#8d8781]" />
                <input id="project-search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Title or keyword" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#302b27] outline-none placeholder:text-[#a29b94]" />
                <button type="submit" className="mr-1 rounded-md bg-miu-red px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">Search</button>
              </div>
            </Field>
            <Field label="Required skill" id="project-skill">
              <div className="relative">
                <select id="project-skill" value={skillId} onChange={(event) => setSkillId(event.target.value)} className="h-[50px] w-full appearance-none rounded-lg border border-[#dfdad4] bg-[#f8f7f5] px-3.5 pr-9 text-sm text-[#302b27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
                  <option value="">All skills</option>
                  {marketplaceData.skills.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d8781]" />
              </div>
            </Field>
            <Field label="Budget range" id="project-budget">
              <div className="relative">
                <select id="project-budget" value={budget} onChange={(event) => setBudget(event.target.value)} className="h-[50px] w-full appearance-none rounded-lg border border-[#dfdad4] bg-[#f8f7f5] px-3.5 pr-9 text-sm text-[#302b27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
                  {budgetOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d8781]" />
              </div>
            </Field>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebe7e2] px-5 py-4 sm:px-8">
            <p role="status" className="text-sm text-[#77706a]"><strong className="text-[#28231f]">{results.length}</strong> matching {results.length === 1 ? "opportunity" : "opportunities"} <span className="hidden sm:inline">· EGP budgets</span></p>
            <div className="flex items-center gap-2">
              <label htmlFor="project-sort" className="text-xs font-medium text-[#8b837d]">Sort by</label>
              <select id="project-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-md border border-[#e2ddd7] bg-white px-2.5 py-2 text-xs font-semibold text-[#37302b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
                <option value="newest">Newest first</option>
                <option value="budget_low">Budget: low to high</option>
                <option value="budget_high">Budget: high to low</option>
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div aria-label="Active filters" className="flex flex-wrap items-center gap-2 border-b border-[#ebe7e2] bg-[#fdfbf9] px-5 py-3 sm:px-8">
              {activeFilters.map((filter) => (
                <button key={filter.label} type="button" onClick={filter.clear} className="rounded-full border border-[#e6c9cd] bg-[#fff4f5] px-3 py-1 text-xs font-medium text-[#9d2434] hover:bg-[#fce8eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
                  {filter.label} <span aria-hidden="true">×</span><span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button type="button" onClick={clearFilters} className="px-2 py-1 text-xs font-semibold text-[#746d67] hover:text-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">Clear all</button>
            </div>
          )}

          {results.length > 0 ? (
            <div>{results.map((project, index) => <ProjectRow key={project.id} project={project} index={index} saved={savedIds.includes(project.id)} onToggleSaved={toggleSaved} />)}</div>
          ) : (
            <div className="px-5 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-[#efd9dc] bg-[#fff4f5] text-miu-red"><Search size={24} aria-hidden="true" /></span>
              <h3 className="mt-4 text-lg font-bold">No projects match these filters</h3>
              <p className="mt-2 text-sm text-[#7e7770]">Try a different keyword or clear your filters to browse everything.</p>
              <button type="button" onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-miu-red px-4 py-2.5 text-sm font-semibold text-miu-red hover:bg-[#fff4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"><RotateCcw size={15} aria-hidden="true" /> Clear filters</button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ebe7e2] bg-[#faf9f7] px-5 py-4 text-xs text-[#8b837d] sm:px-8">
            <span>Phase 1 prototype · Listings and saved projects are fictional.</span>
            {savedIds.length > 0 && <span role="status">{savedIds.length} saved in this preview only</span>}
          </div>
        </section>
        <p className="mt-7 text-center text-xs text-[#aaa39d]">MIU Freelance Platform · Student project prototype</p>
      </main>
    </div>
  );
}
