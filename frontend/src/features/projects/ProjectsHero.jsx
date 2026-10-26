import { useLanguage } from "../../i18n/LanguageContext.js";
import { BriefcaseBusiness, Check } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import { skillNames } from "./catalogueModel.js";

export default function ProjectsHero({ project }) {
  const { t, locale } = useLanguage();

  return (
    <section
      id="discover"
      className="relative isolate overflow-hidden bg-[#321721] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,#873647_0%,transparent_42%),linear-gradient(112deg,#321721_0%,#4e1b2a_57%,#6f2334_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-28 -top-32 size-[470px] rounded-full border-[80px] border-white/[0.055]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 end-[26%] size-52 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 pb-28 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:pb-32">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffb9c4]">
            <span className="h-px w-7 bg-[color:var(--theme-accent-surface,#e998a6)]" />{" "}
            {t("The project marketplace")}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.07] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
            {t("Your skills.")}
            <br />
            <span className="font-display italic font-bold text-[#ffd7de]">
              {t("Their next big idea.")}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#f2dfe4]">
            {t(
              "Discover client projects worth building. Explore opportunities, find your fit, and take the next step in your freelance journey.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#f1cfd6]">
            <span className="flex items-center gap-2">
              <Check size={15} aria-hidden="true" /> {t("EGP budgets")}
            </span>
            <span className="flex items-center gap-2">
              <Check size={15} aria-hidden="true" /> {t("Project-based work")}
            </span>
            <span className="flex items-center gap-2">
              <Check size={15} aria-hidden="true" />{" "}
              {t("Student opportunities")}
            </span>
          </div>
        </div>
        {project && (
          <div
            className="relative hidden h-[350px] lg:block"
            aria-hidden="true"
          >
            <div className="absolute end-0 top-6 xl:end-7 h-[250px] w-[330px] rotate-[8deg] rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm" />
            <div className="absolute end-3 top-2 xl:end-10 h-[268px] w-[345px] -rotate-[7deg] rounded-3xl border border-white/20 bg-[#f7dce1]/20 shadow-2xl backdrop-blur-sm" />
            <div className="absolute end-5 top-6 w-[min(355px,100%)] xl:end-16 rounded-3xl border border-[color:var(--theme-border,#f1dfe1)] bg-[var(--theme-surface,#fff)] p-6 text-[color:var(--theme-text,#251f22)] shadow-[0_28px_65px_rgba(18,8,12,0.35)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[color:var(--theme-accent-surface,#fcecef)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--theme-accent,var(--color-miu-red))]">
                  {t("Project brief")}
                </span>
                <BriefcaseBusiness
                  size={20}
                  className="text-[color:var(--theme-accent,#b23a4c)]"
                />
              </div>
              <h2 className="mt-5 text-[21px] font-bold leading-snug tracking-[-0.03em]">
                {project.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--theme-muted-text,#72686d)]">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.requiredSkillIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-lg bg-[color:var(--theme-accent-surface,#f6f1f0)] px-2.5 py-1.5 text-xs text-[color:var(--theme-muted-text,#655a60)]"
                  >
                    {skillNames.get(id)}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-[color:var(--theme-border,#f0e8e9)] pt-4">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[color:var(--theme-muted-text,#a0969a)]">
                    {t("Project budget")}
                  </span>
                  <strong className="mt-1 block text-xl">
                    {formatEGP(project.budgetEGP, locale)}
                  </strong>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--theme-muted-text,#927681)]">
                  {t("Sample brief")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
