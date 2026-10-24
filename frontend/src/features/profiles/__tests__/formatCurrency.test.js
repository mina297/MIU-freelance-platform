import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatEGP } from "../utils/formatCurrency.js";

describe("formatEGP", () => {
  it("formats amounts in Egyptian pounds", () => {
    const label = formatEGP(3200);
    assert.match(label, /3[,.]?200/);
    assert.match(label, /EGP|ج\.م/);
  });
});
