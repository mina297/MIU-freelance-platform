import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#ab95a1] bg-[#faf7f9] px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red";

export default function ProposalForm({ project }) {
  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <form
        key={project.id}
        onSubmit={(event) => event.preventDefault()}
        aria-label="Proposal draft"
        className="overflow-hidden rounded-2xl border-2 border-[#c9bac1] bg-white"
      >
        <div className="border-b border-[#d8b3bf] bg-[#f8e7ed] px-5 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9b2035]">
            Your approach. Your offer.
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Make a thoughtful first impression
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#694c5b]">
            Explain how you will help, what you will deliver, and how long it
            will take.
          </p>
        </div>
        <div className="space-y-7 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="proposal-price" className="text-sm font-bold">
                Your price (EGP)
              </label>
              <input
                id="proposal-price"
                name="priceEGP"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 5500"
                className={inputClass}
                aria-describedby="proposal-price-help"
              />
              <p
                id="proposal-price-help"
                className="mt-2 text-xs leading-5 text-[#71606a]"
              >
                Your total price for the proposed work.
              </p>
            </div>
            <div>
              <label htmlFor="proposal-days" className="text-sm font-bold">
                Delivery time (days)
              </label>
              <input
                id="proposal-days"
                name="deliveryDays"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 14"
                className={inputClass}
                aria-describedby="proposal-days-help"
              />
              <p
                id="proposal-days-help"
                className="mt-2 text-xs leading-5 text-[#71606a]"
              >
                Estimate the time you need to complete the work.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="proposal-cover" className="text-sm font-bold">
              Cover message
            </label>
            <textarea
              id="proposal-cover"
              name="coverMessage"
              rows={8}
              placeholder="Introduce yourself, describe your approach, and explain what you will deliver…"
              className={`${inputClass} min-h-48 resize-y`}
              aria-describedby="proposal-cover-help"
            />
            <p
              id="proposal-cover-help"
              className="mt-2 text-xs leading-5 text-[#71606a]"
            >
              Connect your experience to this brief. Keep your offer clear and
              specific.
            </p>
          </div>
        </div>
        <div className="border-t border-[#c9bac1] bg-[#faf7f9] p-5 sm:p-7">
          <p
            id="proposal-preview-note"
            className="text-sm leading-6 text-[#694c5b]"
          >
            Form preview only. Nothing is submitted or saved; leaving this page
            clears your draft.
          </p>
          <button
            type="submit"
            disabled
            aria-describedby="proposal-preview-note"
            className="mt-4 min-h-12 w-full cursor-not-allowed rounded-xl bg-[#e5d5dc] px-5 font-bold text-[#68515c] sm:w-auto"
          >
            Submission coming next
          </button>
        </div>
      </form>
      <aside
        aria-label="Project brief summary"
        className="overflow-hidden rounded-2xl border-2 border-[#b5869a] bg-[#f5edf1]"
      >
        <div className="bg-[#351923] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ffd7de]">
            The opportunity
          </p>
          <h2 className="mt-3 text-lg font-bold leading-7">{project.title}</h2>
        </div>
        <dl className="space-y-5 p-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[#71606a]">
              Project budget
            </dt>
            <dd className="mt-1 text-2xl font-bold">
              {formatEGP(project.budgetEGP)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[#71606a]">
              Project deadline
            </dt>
            <dd className="mt-1 font-semibold">
              {formatDate(project.deadline)}
            </dd>
          </div>
        </dl>
        <p className="mx-6 mb-6 border-t border-[#c9bac1] pt-5 text-sm leading-6 text-[#694c5b]">
          Make sure your price and timeline reflect everything in the project
          brief.
        </p>
      </aside>
    </div>
  );
}
