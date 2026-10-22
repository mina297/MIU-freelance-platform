/**
 * Builds a 5-star visual model for ratings.
 * @param {number} average
 * @returns {{ filled: number, empty: number, label: string }}
 */
export function getStarDisplay(average) {
  const safeAverage = Number.isFinite(average) ? Math.max(0, Math.min(5, average)) : 0;
  const filled = Math.round(safeAverage);
  return {
    filled,
    empty: 5 - filled,
    label: safeAverage.toFixed(1),
  };
}

/**
 * Accessible label for a rating summary.
 * @param {number} average
 * @param {number} count
 */
export function getRatingAriaLabel(average, count) {
  const safeAverage = Number.isFinite(average) ? average.toFixed(1) : "0.0";
  const safeCount = Number.isFinite(count) ? count : 0;
  return `Rated ${safeAverage} out of 5 from ${safeCount} reviews`;
}

/**
 * Builds a rating summary from a full review list.
 * @param {Array<{ rating?: number }>} reviewList
 * @returns {{ average: number, count: number, distribution: { stars: number, count: number }[] }}
 */
export function buildRatingSummary(reviewList = []) {
  const ratings = reviewList
    .map((review) => Number(review?.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  const count = ratings.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratings.filter((rating) => rating === stars).length,
  }));

  if (count === 0) {
    return { average: 0, count: 0, distribution };
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = Math.round((total / count) * 10) / 10;
  return { average, count, distribution };
}

/**
 * Folds simulated submissions into a fixture rating summary without
 * collapsing a Figma sample list (e.g. 4 cards) into a smaller count
 * when the fixture already advertises a larger review total.
 *
 * @param {{ average?: number, count?: number, distribution?: { stars: number, count: number }[] } | null | undefined} baseSummary
 * @param {Array<{ rating?: number }>} submittedReviews
 */
export function mergeSubmittedIntoRatingSummary(baseSummary, submittedReviews = []) {
  if (!submittedReviews.length) {
    return (
      baseSummary ?? {
        average: 0,
        count: 0,
        distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
      }
    );
  }

  const baseCount = Number(baseSummary?.count) || 0;
  const baseAverage = Number(baseSummary?.average) || 0;
  const added = submittedReviews
    .map((review) => Number(review?.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  if (!added.length) {
    return baseSummary;
  }

  const count = baseCount + added.length;
  const total = baseAverage * baseCount + added.reduce((sum, rating) => sum + rating, 0);
  const average = Math.round((total / count) * 10) / 10;

  const distributionMap = new Map(
    (baseSummary?.distribution ?? [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }))).map(
      (entry) => [entry.stars, entry.count],
    ),
  );
  for (const rating of added) {
    distributionMap.set(rating, (distributionMap.get(rating) || 0) + 1);
  }

  return {
    average,
    count,
    distribution: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: distributionMap.get(stars) || 0,
    })),
  };
}
