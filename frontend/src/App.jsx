import ProjectsCatalogue from "./features/projects/ProjectsCatalogue.jsx";
import StudentDashboard from "./features/dashboards/StudentDashboard.jsx";
import DevDashboardSwitcher from "./components/navigation/DevDashboardSwitcher.jsx";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Minimal Phase 1 routing; Member 1 owns the eventual shared session provider.
export default function App() {
  return (
    <BrowserRouter>
      {import.meta.env.VITE_ENABLE_DEV_DASHBOARD_SWITCHER !== "false" && (
        <DevDashboardSwitcher />
      )}
      <Routes>
        <Route path="/" element={<ProjectsCatalogue />} />
        <Route path="/projects" element={<ProjectsCatalogue />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="*"
          element={
            <main className="access-message">
              <h1>Page not found</h1>
              <Link to="/projects">Browse projects</Link>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
