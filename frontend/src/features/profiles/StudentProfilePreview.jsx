import StudentProfilePage from "./StudentProfilePage.jsx";
import { DEFAULT_STUDENT_PROFILE_ID } from "./constants.js";

/** Optional single-page preview for one student (not part of the main router). */
export default function StudentProfilePreview({
  studentId = DEFAULT_STUDENT_PROFILE_ID,
  viewerMode = "visitor",
}) {
  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      <div className="border-b border-[#e5e7eb] bg-white px-5 py-3 text-sm text-[#4b5563] md:px-[120px]">
        <p>
          <span className="font-semibold text-miu-black">Member 5 preview</span>
          {" — "}
          Student profile (not wired into the main router)
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
