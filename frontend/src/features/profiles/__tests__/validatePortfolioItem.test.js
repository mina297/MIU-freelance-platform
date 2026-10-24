import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validatePortfolioItem } from "../utils/validatePortfolioItem.js";

describe("validatePortfolioItem", () => {
  it("requires title, category, and summary", () => {
    const errors = validatePortfolioItem({
      title: "ab",
      category: "",
      summary: "too short",
    });
    assert.ok(errors.title);
    assert.ok(errors.category);
    assert.ok(errors.summary);
  });

  it("accepts a valid item", () => {
    const errors = validatePortfolioItem({
      title: "Club landing section",
      category: "Web Development",
      summary:
        "A responsive landing section with clear CTAs for club recruitment.",
      monthLabel: "MAY 2026",
    });
    assert.deepEqual(errors, {});
  });
});
