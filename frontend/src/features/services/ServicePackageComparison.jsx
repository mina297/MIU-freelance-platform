import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId } from "react";
import { formatEGP } from "../../utils/formatEGP.js";

export default function ServicePackageComparison({ packages }) {
  const { t, locale } = useLanguage();

  const id = useId();
  if (!packages.length)
    return (
      <p className="service-details__notice">
        {t(
          "No valid packages are available for this service. Prices and delivery estimates are unavailable.",
        )}
      </p>
    );
  return (
    <div
      className="service-comparison"
      role="region"
      aria-label={t(
        "Service package comparison, scroll horizontally if needed",
      )}
      tabIndex={0}
    >
      <table>
        <caption>
          {t(
            "Compare package scope, EGP price and estimated delivery. This is a read-only preview.",
          )}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t("Package information")}</th>
            {packages.map((pack, index) => (
              <th id={`${id}-${index}`} scope="col" key={pack.id}>
                {pack.name}
                {index === 0 && (
                  <span className="service-details__badge">
                    {t("Starting package")}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th id={`${id}-scope`} scope="row">
              {t("Scope")}
            </th>
            {packages.map((pack, index) => (
              <td key={pack.id} headers={`${id}-scope ${id}-${index}`}>
                {pack.description}
              </td>
            ))}
          </tr>
          <tr>
            <th id={`${id}-features`} scope="row">
              {t("Included deliverables")}
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
              {t("Delivery estimate")}
            </th>
            {packages.map((pack, index) => (
              <td key={pack.id} headers={`${id}-delivery ${id}-${index}`}>
                {pack.deliveryDays} {t("days")}
              </td>
            ))}
          </tr>
          <tr>
            <th id={`${id}-price`} scope="row">
              {t("Package price")}
            </th>
            {packages.map((pack, index) => (
              <td
                className="service-comparison__price"
                key={pack.id}
                headers={`${id}-price ${id}-${index}`}
              >
                {formatEGP(pack.priceEGP, locale)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
