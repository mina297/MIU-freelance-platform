import { Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import ProjectsCatalogue from "../features/projects/ProjectsCatalogue.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";
import LoginPage from "../features/auth/LoginPage.jsx";
import RoleSelectionPage from "../features/auth/RoleSelectionPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/ResetPasswordPage.jsx";

const layouts = {
  standalone: <Outlet />,
  public: <AppLayout title="Public" />,
  auth: <AuthLayout />,
  app: <AppLayout />,
  admin: <AdminLayout />,
};

const featurePages = {
  "/projects": <ProjectsCatalogue />,
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
