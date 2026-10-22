import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateReviewForm } from "../utils/validateReview.js";

describe("validateReviewForm", () => {
  it("requires order, rating, and sufficient body text", () => {
    const errors = validateReviewForm({ rating: 0, body: "short", orderId: "" });
    assert.ok(errors.orderId);
    assert.ok(errors.rating);
    assert.ok(errors.body);
  });

  it("accepts a valid payload", () => {
    const errors = validateReviewForm({
      rating: 5,
      body: "Excellent collaboration and clear handoff files throughout.",
      orderId: "order_005",
    });
    assert.deepEqual(errors, {});
  });
});
