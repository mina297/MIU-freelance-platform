import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateSupportForm } from "../utils/validateSupport.js";

describe("validateSupportForm", () => {
  it("flags missing required fields", () => {
    const errors = validateSupportForm({
      name: "",
      email: "bad",
      topic: "",
      subject: "Hi",
      message: "Too short",
    });
    assert.ok(errors.name);
    assert.ok(errors.email);
    assert.ok(errors.topic);
    assert.ok(errors.subject);
    assert.ok(errors.message);
  });

  it("accepts a complete request", () => {
    const errors = validateSupportForm({
      name: "Ahmed Farouk",
      email: "ahmed.demo@example.com",
      topic: "orders",
      subject: "Deliverable question",
      message:
        "I need clarification about the simulated order status shown on my client profile.",
    });
    assert.deepEqual(errors, {});
  });
});
