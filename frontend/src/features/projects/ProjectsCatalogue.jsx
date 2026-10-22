import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
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
  Sparkles,
  X,
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
  marketplaceData.participants.clients.map(({ id, displayName }) => [
    id,
    displayName,
  ]),
);
const categories = [
  {
    id: "",
    label: "All opportunities",
    shortLabel: "All",
    icon: LayoutGrid,
    tone: "bg-[#f9e5e9] text-[#9b2035]",
    detail: "Your next chapter starts here",
  },
  {
    id: "web_development",
    label: "Development",
    shortLabel: "Web & code",
    icon: Code2,
    tone: "bg-[#edf0fa] text-[#535d91]",
    detail: "Build thoughtful digital experiences",
  },
  {
    id: "graphic_design",
    label: "Graphic Design",
    shortLabel: "Design",
    icon: Palette,
    tone: "bg-[#f5eddd] text-[#8c6728]",
    detail: "Give bold ideas a visual identity",
  },
  {
    id: "writing",
    label: "Writing & Content",
    shortLabel: "Writing",
    icon: PenLine,
    tone: "bg-[#e7f0eb] text-[#3e7357]",
    detail: "Turn good stories into great content",
  },
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

function CategoryCard({ category, selected, onSelect }) {
  const Icon = category.icon;
  const count = openProjects.filter(
    (project) => !category.id || project.categoryId === category.id,
  ).length;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(category.id)}
      className={`group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-21px_rgba(85,28,39,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red sm:min-h-[164px] sm:p-5 motion-reduce:transform-none motion-reduce:transition-none ${selected ? "border-miu-red bg-[linear-gradient(135deg,#fff,#fce9ee)] shadow-[0_5px_16px_rgba(126,24,42,0.12)]" : "border-[#c9bac1] bg-white shadow-[0_3px_10px_rgba(62,39,43,0.06)]"}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-7 size-24 rounded-full border-[18px] transition ${selected ? "border-[#f7dce1]" : "border-[#f8f5f4] group-hover:border-[#fae9ec]"}`}
      />
      <span
        className={`relative grid size-9 place-items-center rounded-xl ${selected ? "bg-miu-red text-white" : category.tone}`}
      >
        {selected ? (
          <Check size={19} aria-hidden="true" />
        ) : (
          <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
        )}
      </span>
      <span className="relative flex items-end justify-between gap-2">
        <span className="text-sm font-bold leading-tight text-[#2b2427] sm:text-base">
          <span className="sm:hidden">{category.shortLabel}</span>
          <span className="hidden sm:inline">{category.label}</span>
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${selected ? "bg-[#f9e3e7] text-miu-red" : "bg-[#f6f3f2] text-[#8d8586]"}`}
        >
          {count}
        </span>
      </span>
      <span className="relative mt-2 hidden text-xs leading-5 text-[#70666b] sm:block">
        {category.detail}
      </span>
    </button>
  );
}

function FilterPanel({
  budget,
  setBudget,
  skillId,
  setSkillId,
  savedOnly,
  setSavedOnly,
  clearFilters,
  savedCount,
}) {
  return (
    <aside
      aria-label="Project filters"
      className="h-fit rounded-2xl border-2 border-[#c9bac1] bg-[#faf7f9] p-5 shadow-[0_5px_18px_rgba(62,39,43,0.08)] lg:sticky lg:top-6"
    >
      <div className="flex items-center justify-between border-b border-[#d8cbd2] pb-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-[#2a2427]">
          <SlidersHorizontal
            size={17}
            className="text-miu-red"
            aria-hidden="true"
          />{" "}
          Refine results
        </h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-semibold text-miu-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
        >
          Reset
        </button>
      </div>
      <div className="mt-5">
        <label
          htmlFor="project-budget"
          className="mb-2 block text-sm font-semibold text-[#3a3235]"
        >
          Budget
        </label>
        <div className="relative">
          <select
            id="project-budget"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#a994a0] bg-white px-3.5 pr-9 text-sm text-[#4c4548] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            {budgetOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d8487]"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-5">
        <label
          htmlFor="project-skill"
          className="mb-2 block text-sm font-semibold text-[#3a3235]"
        >
          Required skill
        </label>
        <div className="relative">
          <select
            id="project-skill"
            value={skillId}
            onChange={(event) => setSkillId(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#a994a0] bg-white px-3.5 pr-9 text-sm text-[#4c4548] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            <option value="">All skills</option>
            {marketplaceData.skills.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d8487]"
            aria-hidden="true"
          />
        </div>
      </div>
      <label className="mt-6 flex cursor-pointer items-center justify-between gap-3 border-t border-[#d8cbd2] pt-5 text-sm font-semibold text-[#3a3235]">
        <span className="flex items-center gap-2">
          <Bookmark size={16} className="text-miu-red" aria-hidden="true" />{" "}
          Saved projects{" "}
          <span className="text-xs font-normal text-[#9a9294]">
            ({savedCount})
          </span>
        </span>
        <input
          type="checkbox"
          checked={savedOnly}
          onChange={(event) => setSavedOnly(event.target.checked)}
          className="size-4 accent-miu-red"
        />
      </label>
      <div className="mt-6 rounded-xl border border-[#dbb5c1] bg-[#f8e7ed] p-4 text-xs leading-5 text-[#795860]">
        <Sparkles size={17} className="mb-2 text-miu-red" aria-hidden="true" />
        <strong className="mb-1 block text-[#57333e]">
          Look beyond the budget
        </strong>
        Choose a clear scope, the right skills, and a deadline you can
        confidently meet.
      </div>
    </aside>
  );
}

function ProjectCard({ project, featured, saved, onToggleSaved }) {
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

export default function ProjectsCatalogue() {
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
    const matches = findProjects({
      query,
      categoryId,
      skillId,
      status: PROJECT_STATUS.OPEN,
    });
    return matches
      .filter((project) => matchesBudget(project.budgetEGP, budget))
      .filter((project) => !savedOnly || savedIds.includes(project.id))
      .sort((a, b) => {
        if (sort === "budget_low") return a.budgetEGP - b.budgetEGP;
        if (sort === "budget_high") return b.budgetEGP - a.budgetEGP;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [query, categoryId, skillId, budget, sort, savedOnly, savedIds]);

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
    const projectTitle = openProjects.find(({ id }) => id === projectId)?.title ?? "Project";
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
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fdf2f3] px-3 py-1.5 text-xs font-semibold text-[#a52234]">
            <span
              className="size-1.5 rounded-full bg-miu-red"
              aria-hidden="true"
            />{" "}
            Phase 1 preview
          </span>
        </div>
      </header>

      <main>
        <section
          id="discover"
          className="relative isolate overflow-hidden bg-[#321721] text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,#873647_0%,transparent_42%),linear-gradient(112deg,#321721_0%,#4e1b2a_57%,#6f2334_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-[470px] rounded-full border-[80px] border-white/[0.055]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 right-[26%] size-52 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 pb-28 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:pb-32">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffb9c4]">
                <span className="h-px w-7 bg-[#e998a6]" /> The project
                marketplace
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.07] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
                Your skills.
                <br />
                <span className="font-display italic font-bold text-[#ffd7de]">
                  Their next big idea.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#f2dfe4]">
                Discover client projects worth building. Explore opportunities,
                find your fit, and take the next step in your freelance journey.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#f1cfd6]">
                <span className="flex items-center gap-2">
                  <Check size={15} aria-hidden="true" /> EGP budgets
                </span>
                <span className="flex items-center gap-2">
                  <Check size={15} aria-hidden="true" /> Project-based work
                </span>
                <span className="flex items-center gap-2">
                  <Check size={15} aria-hidden="true" /> Student opportunities
                </span>
              </div>
            </div>
            <div
              className="relative hidden h-[350px] lg:block"
              aria-hidden="true"
            >
              <div className="absolute right-0 top-6 xl:right-7 h-[250px] w-[330px] rotate-[8deg] rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm" />
              <div className="absolute right-3 top-2 xl:right-10 h-[268px] w-[345px] -rotate-[7deg] rounded-3xl border border-white/20 bg-[#f7dce1]/20 shadow-2xl backdrop-blur-sm" />
              <div className="absolute right-5 top-6 w-[min(355px,100%)] xl:right-16 rounded-3xl border border-[#f1dfe1] bg-white p-6 text-[#251f22] shadow-[0_28px_65px_rgba(18,8,12,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#fcecef] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-miu-red">
                    Project brief
                  </span>
                  <BriefcaseBusiness size={20} className="text-[#b23a4c]" />
                </div>
                <h2 className="mt-5 text-[21px] font-bold leading-snug tracking-[-0.03em]">
                  {heroProject.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#72686d]">
                  {heroProject.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {heroProject.requiredSkillIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-lg bg-[#f6f1f0] px-2.5 py-1.5 text-xs text-[#655a60]"
                    >
                      {skillNames.get(id)}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-[#f0e8e9] pt-4">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#a0969a]">
                      Project budget
                    </span>
                    <strong className="mt-1 block text-xl">
                      {formatEGP(heroProject.budgetEGP)}
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#927681]">
                    Sample brief
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

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
