import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import { proposalLabel, studentName } from "./clientProposalModel.js";

export default function ProposalComparison({ proposals }) {
  if (proposals.length < 2)
    return (
      <p className="client-proposals__compare-help">
        Select two or three proposals to compare their offers side by side.
      </p>
    );
  return (
    <div
      className="client-proposals__table-wrap"
      tabIndex={0}
      role="region"
      aria-label="Proposal comparison; scroll horizontally on smaller screens"
    >
      <table>
        <caption>Selected proposal comparison</caption>
        <thead>
          <tr>
            <th scope="col">Offer details</th>
            {proposals.map((proposal) => (
              <th key={proposal.id} scope="col">
                {studentName(proposal.studentId)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Price", (proposal) => formatEGP(proposal.priceEGP)],
            ["Delivery time", (proposal) => `${proposal.deliveryDays} days`],
            ["Status", (proposal) => proposalLabel(proposal.status)],
            [
              "Submitted",
              (proposal) => formatDate(proposal.submittedAt.slice(0, 10)),
            ],
            ["Approach", (proposal) => proposal.coverMessage],
          ].map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
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
