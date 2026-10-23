import { MOCK_PROPOSAL_ATTACHMENTS } from "./mockAttachments.js";

export default function ProposalAttachments({ selectedIds, onChange, error }) {
  return (
    <fieldset aria-describedby="attachment-help attachment-error" className="rounded-xl border-2 border-[#c9bac1] bg-[#faf7f9] p-5">
      <legend className="px-2 font-bold">Sample attachments (optional)</legend>
      <p id="attachment-help" className="text-sm leading-6 text-[#694c5b]">
        Select fictional samples for this demo. No real files are uploaded or stored.
        Uncheck a sample to remove it.
      </p>
      <div className="mt-4 space-y-3">
        {MOCK_PROPOSAL_ATTACHMENTS.map((sample) => (
          <label key={sample.id} className="flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border border-[#ab95a1] bg-white p-4">
            <input
              type="checkbox"
              name="attachmentIds"
              value={sample.id}
              checked={selectedIds.includes(sample.id)}
              onChange={(event) => onChange(event.target.checked
                ? [...selectedIds, sample.id]
                : selectedIds.filter((id) => id !== sample.id))}
              aria-invalid={Boolean(error)}
              aria-describedby="attachment-help attachment-error"
              className="mt-1 size-5 shrink-0 accent-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            />
            <span className="min-w-0 break-words">
              <span className="block font-semibold">{sample.name}</span>
              <span className="mt-1 block text-sm text-[#694c5b]">{sample.description}</span>
            </span>
          </label>
        ))}
      </div>
      <p role="status" className="mt-3 text-sm text-[#694c5b]">
        {selectedIds.length ? `${selectedIds.length} sample attachment(s) selected` : "No sample attachments selected"}
      </p>
      <p id="attachment-error" className="mt-2 text-sm text-[#9b2035]">{error}</p>
    </fieldset>
  );
}
