import { useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { findProjects } from "../marketplace/selectors.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatEGP } from "../../utils/formatEGP.js";

const categories = marketplaceData.categories;
const skills = marketplaceData.skills;
const categoryName = new Map(categories.map(({ id, label }) => [id, label]));
const skillName = new Map(skills.map(({ id, label }) => [id, label]));
const clientName = new Map(marketplaceData.participants.clients.map(({ id, displayName }) => [id, displayName]));

function ProjectCard({ project }) {
  return (
    <article className="rounded-2xl border border-[#e7e3e1] bg-white p-6 shadow-[0_16px_35px_-30px_#44323a] transition hover:border-[#cba5ad] hover:shadow-[0_22px_40px_-28px_#67343e] sm:p-7">
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-[#fbecef] px-3 py-1.5 text-[#a22535]">{categoryName.get(project.categoryId)}</span>
        <span className="rounded-full bg-[#edf6ef] px-3 py-1.5 text-[#276c43]">Open for proposals</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold leading-snug text-[#282027]">{project.title}</h3>
      <p className="mt-3 leading-7 text-[#6c666a]">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.requiredSkillIds.map((id) => <span key={id} className="rounded-lg border border-[#e8e5e3] bg-[#faf9f7] px-2.5 py-1 text-xs font-medium text-[#625b60]">{skillName.get(id)}</span>)}
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-[#eeebea] pt-5">
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          <div><span className="block text-xs uppercase tracking-wider text-[#969096]">Budget</span><strong className="mt-1 block text-lg text-[#282027]">{formatEGP(project.budgetEGP)}</strong></div>
          <div><span className="block text-xs uppercase tracking-wider text-[#969096]">Deadline</span><span className="mt-1 flex items-center gap-1.5 font-medium text-[#554e54]"><CalendarDays size={15} aria-hidden="true" />{formatDate(project.deadline)}</span></div>
          <div><span className="block text-xs uppercase tracking-wider text-[#969096]">Client</span><span className="mt-1 block font-medium text-[#554e54]">{clientName.get(project.clientId)}</span></div>
        </div>
        <details className="w-full sm:w-auto">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl border border-[#b91c2b] px-4 py-2.5 text-sm font-semibold text-[#a6192a] hover:bg-[#fdf2f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b91c2b]">Quick view <ArrowUpRight size={16} aria-hidden="true" /></summary>
          <p className="mt-3 max-w-sm rounded-lg bg-[#faf7f6] p-3 text-sm leading-6 text-[#625b60]">{project.description} Full details and proposals are planned for the next Member 2 screen.</p>
        </details>
      </div>
    </article>
  );
}

export default function ProjectsCatalogue() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [skillId, setSkillId] = useState("");
  const [sort, setSort] = useState("newest");

  const results = useMemo(() => {
    const matches = findProjects({ query, categoryId, skillId, status: PROJECT_STATUS.OPEN });
    return [...matches].sort((a, b) => {
      if (sort === "budget_low") return a.budgetEGP - b.budgetEGP;
      if (sort === "budget_high") return b.budgetEGP - a.budgetEGP;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [query, categoryId, skillId, sort]);

  function clearFilters() { setQuery(""); setCategoryId(""); setSkillId(""); setSort("newest"); }

  return (
    <div className="min-h-screen bg-[#f8f7f5] font-sans text-[#282027]">
      <header className="border-b border-[#e8e3e1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b91c2b] text-white"><BriefcaseBusiness size={21} aria-hidden="true" /></span><div><span className="block text-sm font-bold">MIU Freelance</span><span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#a34c59]">Marketplace preview</span></div></div>
          <span className="hidden rounded-full bg-[#fff2f4] px-3 py-1.5 text-xs font-semibold text-[#9d3544] sm:inline">Phase 1 demo</span>
        </div>
      </header>
      <main>
        <section className="bg-[#30212a] text-white">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efa8b5]">Student opportunities</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Find a project worth building.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#e1d2d8] sm:text-lg">Explore client projects and find work that fits your skills. All budgets are in Egyptian pounds.</p>
            <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 text-[#282027] shadow-xl shadow-black/10">
              <Search className="ml-3 shrink-0 text-[#928a90]" size={20} aria-hidden="true" />
              <label className="sr-only" htmlFor="project-search">Search projects</label>
              <input id="project-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or keywords" className="min-w-0 flex-1 px-1 py-2 text-sm outline-none placeholder:text-[#928a90]" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="rounded-lg p-2 hover:bg-[#f5f1f2] focus-visible:outline-2 focus-visible:outline-[#b91c2b]"><X size={18} /></button>}
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
          <aside className="self-start rounded-2xl border border-[#e7e3e1] bg-white p-5 lg:sticky lg:top-5">
            <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={17} aria-hidden="true" /> Filters</h2><button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#a6192a] hover:underline focus-visible:outline-2 focus-visible:outline-[#b91c2b]">Clear all</button></div>
            <div className="mt-6 space-y-5">
              <div><label htmlFor="project-category" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#746d73]">Category</label><select id="project-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="w-full rounded-xl border border-[#ded9d7] bg-white px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#b91c2b]"><option value="">All categories</option>{categories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select></div>
              <div><label htmlFor="project-skill" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#746d73]">Skill</label><select id="project-skill" value={skillId} onChange={(event) => setSkillId(event.target.value)} className="w-full rounded-xl border border-[#ded9d7] bg-white px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#b91c2b]"><option value="">All skills</option>{skills.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select></div>
            </div>
            <p className="mt-6 border-t border-[#eeebea] pt-5 text-xs leading-5 text-[#898288]">Fictional projects for the Phase 1 frontend demonstration.</p>
          </aside>
          <section aria-labelledby="project-results-heading">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#a6192a]">Browse opportunities</p><h2 id="project-results-heading" className="mt-1 font-display text-3xl font-bold">Open projects</h2><p role="status" className="mt-2 text-sm text-[#777078]">{results.length} {results.length === 1 ? "project" : "projects"} found</p></div><div><label htmlFor="project-sort" className="mr-2 text-sm font-medium">Sort by</label><select id="project-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-[#ded9d7] bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-[#b91c2b]"><option value="newest">Newest first</option><option value="budget_low">Budget: low to high</option><option value="budget_high">Budget: high to low</option></select></div></div>
            {results.length ? <div className="space-y-5">{results.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="rounded-2xl border border-dashed border-[#d6d0cf] bg-white px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf2f3] text-[#a6192a]"><Search size={24} aria-hidden="true" /></span><h3 className="mt-5 font-display text-2xl font-bold">No matching projects</h3><p className="mt-2 text-sm text-[#777078]">Try a different keyword, category, or skill.</p><button type="button" onClick={clearFilters} className="mt-6 rounded-xl bg-[#b91c2b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8f1420] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b91c2b]">Clear filters</button></div>}
          </section>
        </div>
      </main>
    </div>
  );
}
