import { useEffect } from "react";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import StudentDashboard from "../features/dashboards/StudentDashboard.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import ClientDashboard from "../features/dashboards/ClientDashboard.jsx";
import ProjectsCatalogue from "../features/projects/ProjectsCatalogue.jsx";
import ProjectDetails from "../features/projects/ProjectDetails.jsx";
import ProjectCreate from "../features/projects/ProjectCreate.jsx";
import ClientProjects from "../features/projects/ClientProjects.jsx";
import ProposalEntry from "../features/proposals/ProposalEntry.jsx";
import ClientProposals from "../features/proposals/ClientProposals.jsx";
import StudentProposals from "../features/proposals/StudentProposals.jsx";
import StudentProposalEdit from "../features/proposals/StudentProposalEdit.jsx";
import OrderSummary from "../features/orders/OrderSummary.jsx";
import OrdersList from "../features/orders/OrdersList.jsx";
import FreelancersCatalogue from "../features/freelancers/FreelancersCatalogue.jsx";
import {
  StudentProfileRoute,
  ClientProfileRoute,
  ProfileEditRoute,
  NewReviewRoute,
  HelpCenterRoute,
  HelpArticleRoute,
} from "../features/profiles/Member5Routes.jsx";
import SupportContactPage from "../features/help/SupportContactPage.jsx";
import Recommendations from "../features/recommendations/Recommendations.jsx";
import ServicesCatalogue from "../features/services/ServicesCatalogue.jsx";
import ServiceDetails from "../features/services/ServiceDetails.jsx";
import StudentServices from "../features/services/StudentServices.jsx";
import ServiceForm from "../features/services/ServiceForm.jsx";
import ServiceOrder from "../features/services/ServiceOrder.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { routeConfig } from "./routeConfig.js";
import SuperAdminDashboard from "../features/governance/SuperAdminDashboard.jsx";
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
import CheckoutPage from "../features/checkout/CheckoutPage.jsx";
import ClientPaymentsDashboard from "../features/dashboards/ClientPaymentsDashboard.jsx";

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
  "/SuperAdmin": <SuperAdminDashboard />,
  "/admin": <SuperAdminDashboard />,
  "/Checkout": <CheckoutPage />,
  "/checkout/:orderId": <CheckoutPage />,
  "/client/payments/overview": <ClientPaymentsDashboard />,
  "/client/payments": <ClientPaymentsDashboard />,
  "/client/dashboard": <ClientDashboard />,
  "/student/dashboard": <StudentDashboard />,
  "/students/:studentId": <StudentProfileRoute />,
  "/clients/:clientId": <ClientProfileRoute />,
  "/profile/edit": <ProfileEditRoute />,
  "/reviews/new": <NewReviewRoute />,
  "/help": <HelpCenterRoute />,
  "/help/:articleSlug": <HelpArticleRoute />,
  "/support/contact": <SupportContactPage />,
  "/": <LandingPage />,
  "/freelancers": <FreelancersCatalogue />,
  "/recommendations": <Recommendations />,
  "/services": <ServicesCatalogue />,
  "/services/:serviceId": <ServiceDetails />,
  "/services/:serviceId/order": <ServiceOrder />,
  "/student/services": <StudentServices />,
  "/student/services/new": <ServiceForm />,
  "/student/services/:serviceId/edit": <ServiceForm />,
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
  "/student/proposals": <StudentProposals />,
  "/student/proposals/:proposalId/edit": <StudentProposalEdit />,
  "/projects": <ProjectsCatalogueRoute />,
  "/client/projects/new": <ProjectCreate />,
  "/client/projects": <ClientProjects />,
  "/client/projects/:projectId/proposals": <ClientProposals />,
  "/orders/:orderId": <OrderSummary />,
  "/client/orders": <OrdersList role="client" />,
  "/student/orders": <OrdersList role="student" />,
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
                caseSensitive={route.caseSensitive}
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
