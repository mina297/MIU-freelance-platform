import { ShieldCheck } from "lucide-react";

/**
 * MIU community verification callout.
 * @param {{ title?: string, description: string }} props
 */
export default function CommunityCard({
  title = "Part of the MIU community",
  description,
}) {
  return (
    <aside
      className="flex w-full flex-col gap-3 overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-6"
      aria-labelledby="community-heading"
    >
      <ShieldCheck
        className="size-6 text-[var(--theme-accent,var(--color-miu-red))]"
        aria-hidden="true"
      />
      <h2
        id="community-heading"
        className="text-base font-semibold leading-normal text-miu-black"
      >
        {title}
      </h2>
      <p className="text-sm leading-[1.6] text-ink-secondary">{description}</p>
    </aside>
  );
}
