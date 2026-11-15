export {
  applications,
  activeJobs,
  dashboardStudent,
} from "../dashboardFixtures.js";

// Select the same fictional records without changing their values or ownership.
import { applications, activeJobs } from "../dashboardFixtures.js";
export function selectStudentRecords(scenario) {
  return {
    rows: scenario === "empty" ? [] : applications,
    jobs: scenario === "empty" ? [] : activeJobs,
  };
}
