/** Presentation only: no records, page-size rules, slicing, or selected state. */
export function getPaginationItems(page, pageCount) {
  if (
    !Number.isSafeInteger(pageCount) ||
    pageCount < 1 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > pageCount
  )
    return [];
  if (pageCount <= 5)
    return Array.from({ length: pageCount }, (_, index) => index + 1);

  const numbers = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 2) {
    numbers.add(2);
    numbers.add(3);
  }
  if (page >= pageCount - 1) {
    numbers.add(pageCount - 2);
    numbers.add(pageCount - 1);
  }
  const sorted = [...numbers]
    .filter((number) => number >= 1 && number <= pageCount)
    .sort((a, b) => a - b);
  const result = [];
  for (const number of sorted) {
    const previous = result.at(-1);
    if (typeof previous === "number" && number - previous === 2)
      result.push(previous + 1);
    else if (typeof previous === "number" && number - previous > 2)
      result.push(`gap-${number}`);
    result.push(number);
  }
  return result;
}
