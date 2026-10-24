import { useId } from "react";
import { formatEGP } from "../../utils/formatEGP.js";

export default function ServicePackageComparison({ packages }) {
  const id = useId();
  if (!packages.length)
    return (
      <p className="service-details__notice">
        No valid packages are available for this service. Prices and delivery
        estimates are unavailable.
      </p>
    );
  return (
    <div
      className="service-comparison"
      role="region"
      aria-label="Service package comparison, scroll horizontally if needed"
      tabIndex={0}
    >
      <table>
        <caption>
          Compare package scope, EGP price and estimated delivery. This is a
          read-only preview.
        </caption>
        <thead>
          <tr>
            <th scope="col">Package information</th>
            {packages.map((pack, index) => (
              <th id={`${id}-${index}`} scope="col" key={pack.id}>
                {pack.name}
                {index === 0 && (
                  <span className="service-details__badge">
                    Starting package
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th id={`${id}-scope`} scope="row">
              Scope
            </th>
            {packages.map((pack, index) => (
              <td key={pack.id} headers={`${id}-scope ${id}-${index}`}>
                {pack.description}
              </td>
            ))}
          </tr>
          <tr>
            <th id={`${id}-features`} scope="row">
              Included deliverables
            </th>
            {packages.map((pack, index) => (
              <td key={pack.id} headers={`${id}-features ${id}-${index}`}>
                <ul>
                  {pack.includedFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th id={`${id}-delivery`} scope="row">
              Delivery estimate
            </th>
            {packages.map((pack, index) => (
              <td key={pack.id} headers={`${id}-delivery ${id}-${index}`}>
                {pack.deliveryDays} days
              </td>
            ))}
          </tr>
          <tr>
            <th id={`${id}-price`} scope="row">
              Package price
            </th>
            {packages.map((pack, index) => (
              <td
                className="service-comparison__price"
                key={pack.id}
                headers={`${id}-price ${id}-${index}`}
              >
                {formatEGP(pack.priceEGP)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
