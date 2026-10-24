import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * @param {{
 *   items: Array<{ id: string, question: string, answer: string }>,
 * }} props
 */
export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  if (!items.length) {
    return (
      <p className="text-sm text-[#4b5563]">No FAQ items match your search.</p>
    );
  }

  return (
    <ul className="divide-y divide-[#e5e7eb] overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-miu-black hover:bg-[#f8f8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red sm:px-5"
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-[#4b5563] transition ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {open ? (
              <div className="px-4 pb-4 text-sm leading-relaxed text-[#4b5563] sm:px-5">
                {item.answer}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
