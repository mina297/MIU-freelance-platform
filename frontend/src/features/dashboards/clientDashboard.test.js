import test from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "../../utils/formatDate.js";
import {
  clientJobs,
  clientMetrics,
  selectClientJobs,
} from "./clientDashboardModel.js";

test("dashboard dates follow Figma without changing the default date format", () => {
  assert.equal(formatDate("2026-10-08", "en-GB"), "08 Oct 2026");
  assert.equal(formatDate("2026-10-08"), "Oct 8, 2026");
});

test("client metrics count only open-job applicants and preserve the design aggregate", () => {
  assert.deepEqual(clientMetrics(clientJobs), {
    open: 2,
    applicants: 3,
    active: 1,
    completed: 18,
  });
  assert.deepEqual(clientMetrics([], true), {
    open: 0,
    applicants: 0,
    active: 0,
    completed: 0,
  });
});

test("completion updates the active and completed summaries together without altering fixtures", () => {
  const completed = clientJobs.map((job) =>
    job.id === "client_launch" ? { ...job, status: "Completed" } : job,
  );
  assert.equal(clientMetrics(completed).active, 0);
  assert.equal(clientMetrics(completed).completed, 19);
  assert.equal(
    clientJobs.find((job) => job.id === "client_launch").status,
    "In progress",
  );
});

test("client search combines normalized text and status and handles empty results", () => {
  assert.equal(selectClientJobs(clientJobs, "  ROBOTICS ", "Open").length, 2);
  assert.equal(selectClientJobs(clientJobs, "Robotics", "Completed").length, 0);
  assert.deepEqual(selectClientJobs([], "", "All"), []);
  assert.deepEqual(
    selectClientJobs(clientJobs, "competition").map((job) => job.id),
    ["client_launch"],
  );
});
