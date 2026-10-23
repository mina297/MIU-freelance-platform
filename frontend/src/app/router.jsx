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
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";

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
      onBack={() => navigate("/projects")}
    />
  );
}

const featurePages = {
  "/projects": <ProjectsCatalogueRoute />,
  "/projects/:projectId": <ProjectDetailsRoute />,
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
