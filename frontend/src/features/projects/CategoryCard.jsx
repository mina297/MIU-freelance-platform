import { useLanguage } from "../../i18n/LanguageContext.js";
import { Check } from "lucide-react";
import { openProjects } from "./catalogueModel.js";

export default function CategoryCard({ category, selected, onSelect }) {
  const { t } = useLanguage();

  const Icon = category.icon;
  const count = openProjects.filter(
    (project) => !category.id || project.categoryId === category.id,
  ).length;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(category.id)}
      className={`group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl border-2 p-4 text-start transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-21px_rgba(85,28,39,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red sm:min-h-[164px] sm:p-5 motion-reduce:transform-none motion-reduce:transition-none ${selected ? "border-miu-red bg-[linear-gradient(135deg,var(--theme-surface,#fff),var(--theme-accent-surface,#fce9ee))] shadow-[0_5px_16px_rgba(126,24,42,0.12)]" : "border-[color:var(--theme-border,#c9bac1)] bg-[var(--theme-surface,#fff)] shadow-[0_3px_10px_rgba(62,39,43,0.06)]"}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -end-6 -top-7 size-24 rounded-full border-[18px] transition ${selected ? "border-[color:var(--theme-accent-surface,#f7dce1)]" : "border-[color:var(--theme-hover,#f8f5f4)] group-hover:border-[color:var(--theme-accent-surface,#fae9ec)]"}`}
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
        <span className="text-sm font-bold leading-tight text-[color:var(--theme-text,#2b2427)] sm:text-base">
          <span className="sm:hidden">{t(category.shortLabel)}</span>
          <span className="hidden sm:inline">{t(category.label)}</span>
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${selected ? "bg-[color:var(--theme-accent-surface,#f9e3e7)] text-[var(--theme-accent,var(--color-miu-red))]" : "bg-[color:var(--theme-subtle-surface,#f6f3f2)] text-[color:var(--theme-muted-text,#8d8586)]"}`}
        >
          {count}
        </span>
      </span>
      <span className="relative mt-2 hidden text-xs leading-5 text-[color:var(--theme-muted-text,#70666b)] sm:block">
        {category.detail}
      </span>
    </button>
  );
}
