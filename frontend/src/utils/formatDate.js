const dateFormatter = new Intl.DateTimeFormat("en-EG", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Format an ISO date or date-time without shifting its calendar day. */
export function formatDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) {
    throw new TypeError("Date must be an ISO date or date-time string");
  }

  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value.slice(0, 10)) {
    throw new RangeError("Invalid ISO date");
  }

  return dateFormatter.format(date);
}
