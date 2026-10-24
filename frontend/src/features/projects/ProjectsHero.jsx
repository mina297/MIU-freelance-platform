import { BriefcaseBusiness, Check } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import { skillNames } from "./catalogueModel.js";

export default function ProjectsHero({ project }) {
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
            <span className="h-px w-7 bg-[#e998a6]" /> The project marketplace
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.07] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
            Your skills.
            <br />
            <span className="font-display italic font-bold text-[#ffd7de]">
              Their next big idea.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#f2dfe4]">
            Discover client projects worth building. Explore opportunities, find
            your fit, and take the next step in your freelance journey.
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
        {project && (
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
                {project.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#72686d]">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.requiredSkillIds.map((id) => (
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
                    {formatEGP(project.budgetEGP)}
                  </strong>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#927681]">
                  Sample brief
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
