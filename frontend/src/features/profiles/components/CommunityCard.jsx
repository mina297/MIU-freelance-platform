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
      className="flex w-full flex-col gap-3 overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white p-6"
      aria-labelledby="community-heading"
    >
      <ShieldCheck className="size-6 text-miu-red" aria-hidden="true" />
      <h2
        id="community-heading"
        className="text-base font-semibold leading-normal text-miu-black"
      >
        {title}
      </h2>
      <p className="text-sm leading-[1.6] text-[#4b5563]">{description}</p>
    </aside>
  );
}
