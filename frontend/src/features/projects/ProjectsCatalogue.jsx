import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarDays, ChevronDown, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { findProjects } from "../marketplace/selectors.js";

const categories = marketplaceData.categories;
const skills = marketplaceData.skills;
const categoryNames = new Map(categories.map(({ id, label }) => [id, label]));
const skillNames = new Map(skills.map(({ id, label }) => [id, label]));
const clientNames = new Map(marketplaceData.participants.clients.map(({ id, displayName }) => [id, displayName]));
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

function FilterContent({ prefix, categoryId, setCategoryId, skillId, setSkillId, budget, setBudget, clearFilters }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#f0e9e8] pb-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-[#fdf2f3] text-miu-red"><SlidersHorizontal size={18} aria-hidden="true" /></span>
          <h2 className="text-base font-semibold tracking-[-0.02em]">Filters</h2>
        </div>
        <button type="button" onClick={clearFilters} className="text-xs font-semibold text-miu-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">Clear all</button>
      </div>
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">Category</legend>
        <div className="space-y-1">
          {[{ id: "", label: "All categories" }, ...categories].map(({ id, label }) => (
            <label key={id || "all"} className="flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2.5 text-sm text-[#4b5563] hover:bg-[#fbf5f5]">
              <span className="flex items-center gap-3">
                <input type="radio" name={`${prefix}-category`} value={id} checked={categoryId === id} onChange={() => setCategoryId(id)} className="size-4 accent-miu-red" />
                <span className={categoryId === id ? "font-semibold text-[#241d20]" : ""}>{label}</span>
              </span>
              <span className="text-xs text-[#a39da0]">{marketplaceData.projects.filter((project) => project.status === PROJECT_STATUS.OPEN && (!id || project.categoryId === id)).length}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6 border-t border-[#f0e9e8] pt-6">
        <legend className="mb-3 text-sm font-semibold">Budget</legend>
        <div className="space-y-1">
          {budgetOptions.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-[#4b5563] hover:bg-[#fbf5f5]">
              <input type="radio" name={`${prefix}-budget`} value={value} checked={budget === value} onChange={() => setBudget(value)} className="size-4 accent-miu-red" />
              <span className={budget === value ? "font-semibold text-[#241d20]" : ""}>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 border-t border-[#f0e9e8] pt-6">
        <label htmlFor={`${prefix}-skill`} className="mb-3 block text-sm font-semibold">Required skill</label>
        <div className="relative">
          <select id={`${prefix}-skill`} value={skillId} onChange={(event) => setSkillId(event.target.value)} className="w-full appearance-none rounded-xl border border-[#e7e2e1] bg-white px-3.5 py-3 pr-9 text-sm text-[#4b5563] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">
            <option value="">All skills</option>
            {skills.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
          <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#868086]" />
        </div>
      </div>
      <p className="mt-7 rounded-2xl bg-[#fbf4f3] p-4 text-xs leading-5 text-[#73696e]"><Sparkles size={16} aria-hidden="true" className="mb-2 text-miu-red" />Fictional opportunities for the Phase 1 frontend demonstration.</p>
    </>
  );
}

function ProjectCard({ project, saved, onToggleSaved }) {
  const clientName = clientNames.get(project.clientId) ?? "Demo client";
  const initials = clientName.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return (
    <article className="rounded-[22px] border border-[#ece6e6] bg-white p-5 shadow-[0_12px_38px_-28px_rgba(53,27,32,0.3)] transition duration-200 hover:-translate-y-0.5 hover:border-[#e6c3c8] hover:shadow-[0_20px_46px_-27px_rgba(95,38,48,0.35)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#fbe8eb] px-3 py-1.5 text-xs font-semibold text-[#a62535]">{categoryNames.get(project.categoryId)}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#edf7f0] px-3 py-1.5 text-xs font-semibold text-[#25734a]"><span className="size-1.5 rounded-full bg-[#32a66a]" /> Open</span>
        </div>
        <button type="button" onClick={() => onToggleSaved(project.id)} aria-label={`${saved ? "Remove" : "Save"} ${project.title} ${saved ? "from" : "to"} saved projects`} aria-pressed={saved} title="Saved projects last only during this preview" className={`grid size-9 place-items-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${saved ? "border-[#efced4] bg-[#fdf2f3] text-miu-red" : "border-[#eee7e7] text-[#8d8589] hover:border-[#e6bcc4] hover:text-miu-red"}`}>
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug tracking-[-0.035em] text-[#211d20] sm:text-[23px]">{project.title}</h3>
      <div className="mt-4 flex items-center gap-2.5 text-sm text-[#686168]">
        <span className="grid size-8 place-items-center rounded-full bg-[#f4e7e3] text-[10px] font-bold tracking-wide text-[#934a4d]" aria-hidden="true">{initials}</span>
        <span>{clientName}</span><span aria-hidden="true" className="text-[#c9c0c3]">·</span><span>Demo client</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#6c676c]">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.requiredSkillIds.map((id) => <span key={id} className="rounded-lg border border-[#eae5e4] bg-[#faf9f8] px-2.5 py-1.5 text-xs font-medium text-[#635e63]">{skillNames.get(id)}</span>)}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[#f0eceb] pt-5">
        <div><span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#958d92]">Project budget</span><strong className="mt-1 block text-lg font-bold tracking-[-0.035em] text-[#201c1f]">{formatEGP(project.budgetEGP)}</strong></div>
        <div><span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#958d92]">Deadline</span><span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#514b51]"><CalendarDays size={15} aria-hidden="true" />{formatDate(project.deadline)}</span></div>
      </div>
      <details className="mt-5 border-t border-[#f0eceb] pt-5">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-miu-red hover:text-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">Quick view <ArrowRight size={16} aria-hidden="true" /></summary>
        <div className="mt-4 rounded-xl border border-[#f0e1e2] bg-[#fff9f8] p-4 text-sm leading-6 text-[#605a5e]">
          <p><strong className="text-[#342b30]">Scope:</strong> {project.description}</p>
          <p className="mt-1"><strong className="text-[#342b30]">Posted:</strong> {formatDate(project.createdAt)}</p>
          <p className="mt-2 text-xs text-[#8b7c82]">This is a preview. Full project details and proposals are planned for a later screen.</p>
        </div>
      </details>
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
    const matches = findProjects({ query, categoryId, skillId, status: PROJECT_STATUS.OPEN });
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
    setSavedIds((current) => current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId]);
  }

  const activeFilters = [
    query && { label: `“${query}”`, clear: () => { setSearchDraft(""); setQuery(""); } },
    categoryId && { label: categoryNames.get(categoryId), clear: () => setCategoryId("") },
    skillId && { label: skillNames.get(skillId), clear: () => setSkillId("") },
    budget !== "all" && { label: budgetOptions.find(({ value }) => value === budget)?.label, clear: () => setBudget("all") },
  ].filter(Boolean);
  const filterProps = { categoryId, setCategoryId, skillId, setSkillId, budget, setBudget, clearFilters };

  return (
    <div className="min-h-screen bg-[#f8f8f9] font-sans text-[#242024]">
      <header className="border-b border-[#f0e9e9] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-8"><img src={miuLogo} alt="Misr International University" className="h-12 w-auto max-w-[150px] object-contain" /><span className="hidden h-7 w-px bg-[#e9e2e3] md:block" aria-hidden="true" /><span className="hidden text-sm font-semibold text-miu-red md:block">Browse projects</span></div>
          <span className="flex items-center gap-2 rounded-full border border-[#f0dce0] bg-[#fff8f9] px-3 py-1.5 text-xs font-semibold text-[#a43a49]"><span className="size-1.5 rounded-full bg-miu-red" /> Phase 1 preview</span>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden border-b border-[#f4e2e5] bg-[#fdf2f3]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 size-[430px] rounded-full border-[74px] border-white/35" />
          <div aria-hidden="true" className="pointer-events-none absolute right-14 top-16 hidden size-44 rounded-full border border-[#efd4d9] lg:block" />
          <div className="relative mx-auto max-w-[1280px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a73041]"><BriefcaseBusiness size={15} aria-hidden="true" /> The project marketplace</div>
            <h1 className="max-w-2xl font-display text-[42px] font-bold leading-[1.13] tracking-[-0.035em] text-[#211c20] sm:text-[55px]">Find work that moves<br className="hidden sm:block" /> you forward<span className="text-miu-red">.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#675e64] sm:text-base">Explore client projects, find work that fits your skills, and discover what you could build next.</p>
            <form onSubmit={(event) => { event.preventDefault(); setQuery(searchDraft.trim()); }} role="search" className="mt-8 flex max-w-[720px] items-center gap-2 rounded-2xl border border-[#eadfe0] bg-white p-2 shadow-[0_16px_38px_-24px_rgba(104,48,58,0.4)]">
              <Search size={20} aria-hidden="true" className="ml-3 shrink-0 text-[#8a8186]" />
              <label htmlFor="project-search" className="sr-only">Search projects</label>
              <input id="project-search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search project titles or keywords" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#282127] outline-none placeholder:text-[#9b9297]" />
              {searchDraft && <button type="button" onClick={() => { setSearchDraft(""); setQuery(""); }} aria-label="Clear search" className="rounded-lg p-2 text-[#8a8186] hover:bg-[#f8f2f3] focus-visible:outline-2 focus-visible:outline-miu-red"><X size={17} aria-hidden="true" /></button>}
              <button type="submit" className="rounded-xl bg-miu-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red sm:px-7">Search</button>
            </form>
            <p className="mt-3 text-xs text-[#9c737b]">All listed budgets are in EGP · Fictional demo opportunities</p>
          </div>
        </section>
        <div className="mx-auto grid max-w-[1280px] gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[276px_minmax(0,1fr)] lg:gap-9 lg:px-10 lg:py-12">
          <aside className="hidden h-fit rounded-[22px] border border-[#ece6e6] bg-white p-5 shadow-[0_14px_36px_-31px_rgba(53,27,32,0.3)] lg:sticky lg:top-5 lg:block" aria-label="Project filters"><FilterContent prefix="desktop" {...filterProps} /></aside>
          <section aria-labelledby="project-results-heading" className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><span className="text-xs font-bold uppercase tracking-[0.17em] text-miu-red">Discover opportunities</span><h2 id="project-results-heading" className="mt-1.5 font-display text-[31px] font-bold leading-tight tracking-[-0.035em] sm:text-[36px]">Open projects</h2><p role="status" className="mt-2 text-sm text-[#797178]">{results.length} {results.length === 1 ? "opportunity" : "opportunities"} available</p></div>
              <div className="relative w-full sm:w-auto">
                <label htmlFor="project-sort" className="sr-only">Sort projects</label>
                <select id="project-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="w-full appearance-none rounded-xl border border-[#e6dfe0] bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-[#40383e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"><option value="newest">Newest first</option><option value="budget_low">Budget: low to high</option><option value="budget_high">Budget: high to low</option></select>
                <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8c858a]" />
              </div>
            </div>
            <details className="mt-5 rounded-2xl border border-[#ece6e6] bg-white p-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold focus-visible:outline-2 focus-visible:outline-miu-red"><span className="flex items-center gap-2"><SlidersHorizontal size={17} aria-hidden="true" /> Filters {activeFilters.length ? `(${activeFilters.length})` : ""}</span><ChevronDown size={17} aria-hidden="true" /></summary>
              <div className="mt-5 border-t border-[#f0e9e8] pt-5"><FilterContent prefix="mobile" {...filterProps} /></div>
            </details>
            {activeFilters.length > 0 && <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Active filters">{activeFilters.map((filter) => <button key={filter.label} type="button" onClick={filter.clear} className="inline-flex items-center gap-1.5 rounded-full border border-[#ead7db] bg-[#fff4f5] px-3 py-1.5 text-xs font-medium text-[#a12839] hover:bg-[#fbe9ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red">{filter.label}<X size={13} aria-hidden="true" /><span className="sr-only">Remove filter</span></button>)}<button type="button" onClick={clearFilters} className="px-2 py-1.5 text-xs font-semibold text-[#777078] hover:text-miu-red focus-visible:outline-2 focus-visible:outline-miu-red">Clear all</button></div>}
            <div className="mt-6 space-y-4">
              {results.length > 0 ? results.map((project) => <ProjectCard key={project.id} project={project} saved={savedIds.includes(project.id)} onToggleSaved={toggleSaved} />) : <div className="rounded-[22px] border border-dashed border-[#dfd4d6] bg-white px-6 py-16 text-center"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#fdf2f3] text-miu-red"><Search size={28} aria-hidden="true" /></span><h3 className="mt-5 font-display text-2xl font-bold">No matching projects</h3><p className="mt-2 text-sm text-[#777078]">Try a different search or adjust your filters.</p><button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-miu-red px-5 py-3 text-sm font-semibold text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"><RotateCcw size={16} aria-hidden="true" /> Clear filters</button></div>}
            </div>
            {savedIds.length > 0 && <p role="status" className="mt-5 text-xs text-[#81787e]">{savedIds.length} saved for this preview only; saved projects are not stored.</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
