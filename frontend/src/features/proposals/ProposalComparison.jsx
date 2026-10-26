import { useLanguage } from "../../i18n/LanguageContext.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import { proposalLabel, studentName } from "./clientProposalModel.js";
import { Link } from "react-router-dom";

export default function ProposalComparison({ proposals }) {
  const { t, locale } = useLanguage();

  if (proposals.length < 2)
    return (
      <p className="client-proposals__compare-help">
        {t(
          "Select two or three proposals to compare their offers side by side.",
        )}
      </p>
    );
  return (
    <div
      className="client-proposals__table-wrap"
      tabIndex={0}
      role="region"
      aria-label={t(
        "Proposal comparison; scroll horizontally on smaller screens",
      )}
    >
      <table>
        <caption>{t("Selected proposal comparison")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("Offer details")}</th>
            {proposals.map((proposal) => (
              <th key={proposal.id} scope="col">
                <Link to={`/students/${proposal.studentId}`}>
                  {studentName(proposal.studentId)}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Price", (proposal) => formatEGP(proposal.priceEGP, locale)],
            ["Delivery time", (proposal) => `${proposal.deliveryDays} days`],
            ["Status", (proposal) => proposalLabel(proposal.status)],
            [
              "Submitted",
              (proposal) =>
                formatDate(proposal.submittedAt.slice(0, 10), locale),
            ],
            ["Approach", (proposal) => proposal.coverMessage],
          ].map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{t(label)}</th>
              {proposals.map((proposal) => (
                <td key={proposal.id}>{value(proposal)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
