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
import ProjectCreate from "../features/projects/ProjectCreate.jsx";
import ClientProjects from "../features/projects/ClientProjects.jsx";
import ProposalEntry from "../features/proposals/ProposalEntry.jsx";
import ClientProposals from "../features/proposals/ClientProposals.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";
import LoginPage from "../features/auth/LoginPage.jsx";
import RoleSelectionPage from "../features/auth/RoleSelectionPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/ResetPasswordPage.jsx";
import PublicWebsite from "./PublicWebsite.jsx";
import { publicDestinations } from "./publicDestinations.js";
import LandingPage from "../features/public/LandingPage.jsx";
import AboutPage from "../features/public/AboutPage.jsx";
import HowItWorksPage from "../features/public/HowItWorksPage.jsx";
import HowItWorksSection from "../features/public/components/HowItWorksSection.jsx";
import TermsPage from "../features/public/TermsPage.jsx";
import PrivacyPage from "../features/public/PrivacyPage.jsx";
import LoadingDemoPage from "../features/public/LoadingDemoPage.jsx";
import ErrorDemoPage from "../features/public/ErrorDemoPage.jsx";

const layouts = {
  standalone: <Outlet />,
  public: <PublicWebsite />,
  auth: <AuthLayout />,
  app: <AppLayout />,
  admin: <AdminLayout />,
};

function ProjectsCatalogueRoute() {
  const navigate = useNavigate();
  return (
    <ProjectsCatalogue
      onOpenProject={(projectId) => navigate(`/projects/${projectId}`)}
      onCreateProject={() => navigate("/client/projects/new")}
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
  "/": (
    <LandingPage
      destinations={publicDestinations}
      getProjectHref={(id) => `/projects/${id}`}
      howItWorks={<HowItWorksSection />}
    />
  ),
  "/about": <AboutPage destinations={publicDestinations} />,
  "/how-it-works": (
    <HowItWorksPage
      destinations={publicDestinations}
      howItWorks={<HowItWorksSection />}
    />
  ),
  "/terms": <TermsPage destinations={publicDestinations} />,
  "/privacy": <PrivacyPage destinations={publicDestinations} />,
  "/loading-demo": <LoadingDemoPage />,
  "/error-demo": <ErrorDemoPage />,
  "/projects/:projectId/propose": <ProposalEntry />,
  "/projects": <ProjectsCatalogueRoute />,
  "/client/projects/new": <ProjectCreate />,
  "/client/projects": <ClientProjects />,
  "/client/projects/:projectId/proposals": <ClientProposals />,
  "/client/projects/:projectId/edit": <ProjectCreate />,
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
