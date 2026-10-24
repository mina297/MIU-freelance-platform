import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveExternalLink } from "../utils/safeExternalUrl.js";

describe("resolveExternalLink", () => {
  it("accepts https URLs", () => {
    const result = resolveExternalLink("https://github.com/demo-user");
    assert.equal(result.isSafe, true);
    assert.equal(result.href, "https://github.com/demo-user");
  });

  it("normalizes host-style paths to https", () => {
    const result = resolveExternalLink("github.com/demo-user");
    assert.equal(result.isSafe, true);
    assert.match(result.href, /^https:\/\/github\.com\/demo-user$/);
  });

  it("blocks .example demo domains", () => {
    const result = resolveExternalLink("https://nour-design.example");
    assert.equal(result.isSafe, false);
    assert.equal(result.isDemoOnly, true);
    assert.equal(result.href, null);
  });

  it("rejects javascript: URLs", () => {
    const result = resolveExternalLink("javascript:alert(1)");
    assert.equal(result.isSafe, false);
    assert.equal(result.href, null);
  });
});
