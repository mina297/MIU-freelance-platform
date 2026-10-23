import { useEffect } from "react";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import ProjectsCatalogue from "../features/projects/ProjectsCatalogue.jsx";
import ProjectDetails from "../features/projects/ProjectDetails.jsx";
import ProposalEntry from "../features/proposals/ProposalEntry.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";
import LoginPage from "../features/auth/LoginPage.jsx";
import RoleSelectionPage from "../features/auth/RoleSelectionPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/ResetPasswordPage.jsx";
import AIQualityDashboard from "../features/ai-quality/AIQualityDashboard.jsx";

const layouts = {
  standalone: <Outlet />,
  public: <AppLayout title="Public" />,
  auth: <AuthLayout />,
  app: <AppLayout />,
  admin: <AdminLayout />,
};

function ProjectsCatalogueRoute() {
  const navigate = useNavigate();
  return (
    <ProjectsCatalogue
      onOpenProject={(projectId) => navigate(`/projects/${projectId}`)}
    />
  );
}

function ProjectDetailsRoute() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("project-details-heading")?.focus();
  }, [projectId]);

  return (
    <ProjectDetails
      projectId={projectId}
      onPropose={() => navigate(`/projects/${projectId}/propose`)}
      onBack={() => navigate("/projects")}
    />
  );
}

const featurePages = {
  "/AIQuality": <AIQualityDashboard />,
  "/committee/ai-quality": <AIQualityDashboard />,
  "/projects/:projectId/propose": <ProposalEntry />,
  "/projects": <ProjectsCatalogueRoute />,
  "/projects/:projectId": <ProjectDetailsRoute />,
  "/login": <LoginPage />,
  "/register/role": <RoleSelectionPage />,
  "/register": <RegisterPage />,
  "/forgot-password": <ForgotPasswordPage />,
  "/reset-password": <ResetPasswordPage />,
};

export default function AppRouter() {
  return (
    <Routes>
      {Object.entries(layouts).map(([layout, element]) => (
        <Route key={layout} element={element}>
          {routeConfig
            .filter((route) => route.layout === layout)
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute route={route}>
                    {featurePages[route.path] ?? (
                      <section className="space-y-3">
                        <h1 className="text-2xl font-bold">{route.title}</h1>
                        <p>
                          {route.message ??
                            "Planned feature — routing placeholder only. This screen does not implement the feature workflow."}
                        </p>
                      </section>
                    )}
                  </ProtectedRoute>
                }
              />
            ))}
        </Route>
      ))}
    </Routes>
  );
}
