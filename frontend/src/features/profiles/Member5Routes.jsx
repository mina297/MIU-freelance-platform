import { useLanguage } from "../../i18n/LanguageContext.js";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import StudentProfilePage from "./StudentProfilePage.jsx";
import ClientProfilePage from "./ClientProfilePage.jsx";
import ProfileEditPage from "./ProfileEditPage.jsx";
import NewReviewPage from "../reviews/NewReviewPage.jsx";
import HelpCenterPage from "../help/HelpCenterPage.jsx";
import HelpArticlePage from "../help/HelpArticlePage.jsx";
import { ownsProfile } from "./utils/profileOwnership.js";

export function StudentProfileRoute() {
  const { t } = useLanguage();

  const { studentId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return (
    <>
      <p className="px-5 pt-5 text-sm text-[var(--theme-accent,var(--color-miu-red))]">
        {t(
          "Fictional Phase 1 profile. Account badges are simulated. Historical design samples use separate IDs.",
        )}
      </p>
      <StudentProfilePage
        key={`${studentId}:${session.user?.id ?? "visitor"}:${params.get("tab")}`}
        studentId={studentId}
        initialTabId={
          ["portfolio", "reviews", "completed-jobs"].includes(params.get("tab"))
            ? params.get("tab")
            : "about"
        }
        viewerMode={
          ownsProfile(session, studentId, "student") ? "owner" : "visitor"
        }
        simulateDelay={false}
        onBack={() => navigate("/freelancers")}
        onEditProfile={() => navigate("/profile/edit")}
        onLeaveReview={() =>
          navigate(`/reviews/new?studentId=${encodeURIComponent(studentId)}`)
        }
      />
    </>
  );
}
export function ClientProfileRoute() {
  const { t } = useLanguage();

  const { clientId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <p className="px-5 pt-5 text-sm text-[var(--theme-accent,var(--color-miu-red))]">
        {t("Fictional Phase 1 client profile.")}
      </p>
      <ClientProfilePage
        key={`${clientId}:${session.user?.id ?? "visitor"}`}
        clientId={clientId}
        viewerMode={
          ownsProfile(session, clientId, "client") ? "owner" : "visitor"
        }
        simulateDelay={false}
        onBack={() => navigate("/projects")}
        onEditProfile={() => navigate("/profile/edit")}
        onViewStudent={(id) => navigate(`/students/${id}`)}
      />
    </>
  );
}
export function ProfileEditRoute() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const destination = `/${session.user.role === "student" ? "students" : "clients"}/${session.user.id}`;
  return (
    <ProfileEditPage
      profileId={session.user.id}
      role={session.user.role}
      onCancel={() => navigate(destination)}
      onSaved={() => navigate(destination)}
    />
  );
}
export function NewReviewRoute() {
  const { t } = useLanguage();

  const navigate = useNavigate();
  const { session } = useAuth();
  const [params] = useSearchParams();
  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold">{t("Review completed work")}</h1>
      <Link
        to="/client/orders"
        className="inline-flex min-h-11 items-center text-[var(--theme-accent,var(--color-miu-red))] underline"
      >
        {t("My orders")}
      </Link>
      <NewReviewPage
        key={`${session.user.id}:${params.toString()}`}
        studentId={params.get("studentId") || undefined}
        orderId={params.get("orderId") || undefined}
        onBack={() => navigate("/client/orders")}
        onViewReview={(review) =>
          navigate(`/students/${review.targetStudentId}?tab=reviews`)
        }
      />
    </section>
  );
}
export function HelpCenterRoute() {
  const navigate = useNavigate();
  return (
    <HelpCenterPage
      onOpenArticle={(slug) => navigate(`/help/${slug}`)}
      onContactSupport={() => navigate("/support/contact")}
    />
  );
}
export function HelpArticleRoute() {
  const { articleSlug } = useParams();
  const navigate = useNavigate();
  return (
    <HelpArticlePage
      articleSlug={articleSlug}
      onBack={() => navigate("/help")}
      onContactSupport={() => navigate("/support/contact")}
    />
  );
}
