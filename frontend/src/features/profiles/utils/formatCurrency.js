/**
 * Centralized EGP formatting for Member 5 surfaces.
 * @param {number} amount
 * @returns {string}
 */
export function formatEGP(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(safe);
}
