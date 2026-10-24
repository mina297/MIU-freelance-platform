import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatSupportTopicLabel,
  formatTicketStatusLabel,
  formatTicketSubmittedAt,
} from "../utils/ticketLabels.js";

describe("formatSupportTopicLabel", () => {
  it("maps known topics", () => {
    assert.equal(formatSupportTopicLabel("orders"), "Orders & deliverables");
  });

  it("falls back safely", () => {
    assert.equal(formatSupportTopicLabel(""), "General");
    assert.equal(formatSupportTopicLabel("custom"), "custom");
  });
});

describe("formatTicketStatusLabel", () => {
  it("formats submitted status", () => {
    assert.equal(formatTicketStatusLabel("submitted"), "Submitted");
  });
});

describe("formatTicketSubmittedAt", () => {
  it("handles missing dates", () => {
    assert.equal(formatTicketSubmittedAt(""), "Date unavailable");
  });

  it("formats a valid ISO timestamp", () => {
    const label = formatTicketSubmittedAt("2026-10-22T12:00:00.000Z");
    assert.match(label, /2026/);
  });
});
