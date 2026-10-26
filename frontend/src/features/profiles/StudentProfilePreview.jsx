import { useLanguage } from "../../i18n/LanguageContext.js";
import StudentProfilePage from "./StudentProfilePage.jsx";
import { DEFAULT_STUDENT_PROFILE_ID } from "./constants.js";

/** Optional single-page preview for one student (not part of the main router). */
export default function StudentProfilePreview({
  studentId = DEFAULT_STUDENT_PROFILE_ID,
  viewerMode = "visitor",
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="border-b border-border-soft bg-[var(--theme-surface,#fff)] px-5 py-3 text-sm text-ink-secondary md:px-[120px]">
        <p>
          <span className="font-semibold text-miu-black">
            {t("Member 5 preview")}
          </span>
          {" — "}
          {t("Student profile (not wired into the main router)")}
        </p>
      </div>
      <StudentProfilePage
        studentId={studentId}
        viewerMode={viewerMode}
        onContact={() => {
          window.alert(
            "Contact action is a mock integration callback. Messaging is owned by other modules.",
          );
        }}
        onBack={() => {
          window.alert(
            "Back navigation will connect to Find Talent when Member 1/2 routes are integrated.",
          );
        }}
      />
    </div>
  );
}
