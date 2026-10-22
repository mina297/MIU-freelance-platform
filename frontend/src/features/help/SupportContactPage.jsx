import SupportRequestForm from "./components/SupportRequestForm.jsx";

/**
 * Contact Support page.
 * Expected route: `/support/contact`
 *
 * @param {{
 *   onBack?: () => void,
 *   onSuccess?: (ticket: object) => void,
 * }} props
 */
export default function SupportContactPage({ onBack, onSuccess }) {
  return (
    <div className="w-full bg-[#f8f8f9]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-miu-red"
          >
            ← Back to Help Center
          </button>
        ) : null}
        <SupportRequestForm onCancel={onBack} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
