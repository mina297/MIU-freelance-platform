import { useLanguage } from "../../i18n/LanguageContext.js";
import {
  Bookmark,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { budgetOptions } from "./catalogueModel.js";

export default function FilterPanel({
  budget,
  setBudget,
  skillId,
  setSkillId,
  savedOnly,
  setSavedOnly,
  clearFilters,
  savedCount,
}) {
  const { t } = useLanguage();

  return (
    <aside
      aria-label={t("Project filters")}
      className="h-fit rounded-2xl border-2 border-[color:var(--theme-border,#c9bac1)] bg-[color:var(--theme-accent-surface,#faf7f9)] p-5 shadow-[0_5px_18px_rgba(62,39,43,0.08)] lg:sticky lg:top-6"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--theme-border,#d8cbd2)] pb-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-[color:var(--theme-text,#2a2427)]">
          <SlidersHorizontal
            size={17}
            className="text-[var(--theme-accent,var(--color-miu-red))]"
            aria-hidden="true"
          />{" "}
          {t("Refine results")}
        </h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-semibold text-[var(--theme-accent,var(--color-miu-red))] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
        >
          {t("Reset")}
        </button>
      </div>
      <div className="mt-5">
        <label
          htmlFor="project-budget"
          className="mb-2 block text-sm font-semibold text-[color:var(--theme-text,#3a3235)]"
        >
          {t("Budget")}
        </label>
        <div className="relative">
          <select
            id="project-budget"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[color:var(--theme-border,#a994a0)] bg-[var(--theme-surface,#fff)] px-3.5 pe-9 text-sm text-[color:var(--theme-text,#4c4548)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            {budgetOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[color:var(--theme-muted-text,#8d8487)]"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-5">
        <label
          htmlFor="project-skill"
          className="mb-2 block text-sm font-semibold text-[color:var(--theme-text,#3a3235)]"
        >
          {t("Required skill")}
        </label>
        <div className="relative">
          <select
            id="project-skill"
            value={skillId}
            onChange={(event) => setSkillId(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[color:var(--theme-border,#a994a0)] bg-[var(--theme-surface,#fff)] px-3.5 pe-9 text-sm text-[color:var(--theme-text,#4c4548)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            <option value="">{t("All skills")}</option>
            {marketplaceData.skills.map(({ id, label }) => (
              <option key={id} value={id}>
                {t(label)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[color:var(--theme-muted-text,#8d8487)]"
            aria-hidden="true"
          />
        </div>
      </div>
      <label className="mt-6 flex cursor-pointer items-center justify-between gap-3 border-t border-[color:var(--theme-border,#d8cbd2)] pt-5 text-sm font-semibold text-[color:var(--theme-text,#3a3235)]">
        <span className="flex items-center gap-2">
          <Bookmark
            size={16}
            className="text-[var(--theme-accent,var(--color-miu-red))]"
            aria-hidden="true"
          />{" "}
          {t("Saved projects")}{" "}
          <span className="text-xs font-normal text-[color:var(--theme-muted-text,#9a9294)]">
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
      <div className="mt-6 rounded-xl border border-[color:var(--theme-border,#dbb5c1)] bg-[color:var(--theme-accent-surface,#f8e7ed)] p-4 text-xs leading-5 text-[color:var(--theme-muted-text,#795860)]">
        <Sparkles
          size={17}
          className="mb-2 text-[var(--theme-accent,var(--color-miu-red))]"
          aria-hidden="true"
        />
        <strong className="mb-1 block text-[color:var(--theme-accent,#57333e)]">
          {t("Look beyond the budget")}
        </strong>
        {t(
          "Choose a clear scope, the right skills, and a deadline you can confidently meet.",
        )}
      </div>
    </aside>
  );
}
