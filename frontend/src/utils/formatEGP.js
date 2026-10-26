const options = {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

/** Format a finite EGP amount. Invalid data must be handled by its caller. */
export function formatEGP(amount, locale = "en-EG") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError("EGP amount must be a finite number");
  }

  return new Intl.NumberFormat(locale, options).format(amount);
}
