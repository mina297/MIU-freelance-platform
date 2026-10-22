import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatClientFeedbackLabel,
  formatCompletedJobsLabel,
  formatLanguagesLabel,
} from "../utils/formatProfileLabels.js";
import {
  getRatingAriaLabel,
  getStarDisplay,
  mergeSubmittedIntoRatingSummary,
} from "../utils/ratingDisplay.js";

describe("formatLanguagesLabel", () => {
  it("joins two languages with an ampersand", () => {
    assert.equal(formatLanguagesLabel(["Arabic", "English"]), "Arabic & English");
  });

  it("handles empty input", () => {
    assert.equal(formatLanguagesLabel([]), "Not specified");
  });
});

describe("formatCompletedJobsLabel", () => {
  it("pluralizes projects", () => {
    assert.equal(formatCompletedJobsLabel(32), "32 projects");
    assert.equal(formatCompletedJobsLabel(1), "1 project");
  });
});

describe("formatClientFeedbackLabel", () => {
  it("matches Figma At a glance copy pattern", () => {
    assert.equal(
      formatClientFeedbackLabel({ average: 4.9, count: 32 }),
      "4.9 from 32 reviews",
    );
  });
});

describe("getStarDisplay", () => {
  it("rounds averages into filled stars", () => {
    assert.deepEqual(getStarDisplay(4.9), {
      filled: 5,
      empty: 0,
      label: "4.9",
    });
  });
});

describe("getRatingAriaLabel", () => {
  it("exposes a clear accessible summary", () => {
    assert.equal(
      getRatingAriaLabel(4.9, 32),
      "Rated 4.9 out of 5 from 32 reviews",
    );
  });
});

describe("mergeSubmittedIntoRatingSummary", () => {
  it("keeps the fixture summary when nothing was submitted", () => {
    const base = {
      average: 4.9,
      count: 32,
      distribution: [
        { stars: 5, count: 29 },
        { stars: 4, count: 3 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    };
    assert.deepEqual(mergeSubmittedIntoRatingSummary(base, []), base);
  });

  it("folds a simulated 5-star review into the fixture totals", () => {
    const next = mergeSubmittedIntoRatingSummary(
      {
        average: 4.9,
        count: 32,
        distribution: [
          { stars: 5, count: 29 },
          { stars: 4, count: 3 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ],
      },
      [{ rating: 5 }],
    );
    assert.equal(next.count, 33);
    assert.equal(next.average, 4.9);
    assert.equal(next.distribution.find((entry) => entry.stars === 5)?.count, 30);
  });
});
