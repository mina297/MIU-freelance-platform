import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";

const layouts = {
  public: <AppLayout title="Public" />,
  auth: <AuthLayout />,
  app: <AppLayout />,
  admin: <AdminLayout />,
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
                    <section className="space-y-3">
                      <h1 className="text-2xl font-bold">{route.title}</h1>
                      <p>
                        {route.message ??
                          "Planned feature — routing placeholder only. This screen does not implement the feature workflow."}
                      </p>
                    </section>
                  </ProtectedRoute>
                }
              />
            ))}
        </Route>
      ))}
    </Routes>
  );
}
