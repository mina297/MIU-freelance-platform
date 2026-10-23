import ProjectsCatalogue from "./features/projects/ProjectsCatalogue.jsx";
import StudentDashboard from "./features/dashboards/StudentDashboard.jsx";
import ClientDashboard from "./features/dashboards/ClientDashboard.jsx";
import DevDashboardSwitcher from "./components/navigation/DevDashboardSwitcher.jsx";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Phase 1 preview routes; shared session integration remains with Member 1.
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
        <Route path="/client/dashboard" element={<ClientDashboard />} />
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
