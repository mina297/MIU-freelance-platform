import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  ContactRound,
  PenLine,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useLanguage } from "../../i18n/LanguageContext.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./profileSetup.css";
import ResumeUpload from "./ResumeUpload.jsx";
import ProfileSetupProgress from "./ProfileSetupProgress.jsx";
import Modal from "../../components/ui/Modal.jsx";
import {
  getProfileSetupDraft,
  saveProfileSetupDraft,
  canContinueProfileSetup,
} from "./profileSetupDraft.js";

const methods = [
  {
    id: "resume",
    Icon: FileUp,
    title: "Upload your resume",
    description: "Start with the experience you already have.",
    planned: false,
  },
  {
    id: "linkedin",
    Icon: ContactRound,
    title: "Import from LinkedIn",
    description: "Bring your professional story into your profile.",
    planned: false,
  },
  {
    id: "manual",
    Icon: PenLine,
    title: "Fill out manually",
    description: "Make it yours, one detail at a time.",
    planned: false,
  },
];

// Responsive presentation only; this does not infer touch support or device type.
const resumeMediaQuery = "(max-width: 700px)";
function subscribeToResumeLayout(callback) {
  const media = window.matchMedia(resumeMediaQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getCompactResumeLayout = () =>
  window.matchMedia(resumeMediaQuery).matches;
const getServerResumeLayout = () => false;

export default function ProfileSetupPage() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [initialDraft] = useState(() => getProfileSetupDraft(session));
  const [method, setMethod] = useState(initialDraft?.method ?? "");
  const [resume, setResume] = useState(initialDraft?.resume ?? null);
  const [resumeError, setResumeError] = useState(
    initialDraft?.resumeError ?? "",
  );
  const compactResume = useSyncExternalStore(
    subscribeToResumeLayout,
    getCompactResumeLayout,
    getServerResumeLayout,
  );
  const [resumeSheetOpen, setResumeSheetOpen] = useState(false);
  const fileMethod = method === "resume" || method === "linkedin";
  const heading = useRef(null);
  const student = session.user.role === "student";

  useLayoutEffect(() => {
    if (!initialDraft) heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: initialDraft?.scrollY ?? 0, behavior: "instant" });
    const rememberScroll = () =>
      saveProfileSetupDraft(session, { scrollY: window.scrollY });
    window.addEventListener("scroll", rememberScroll, { passive: true });
    return () => {
      rememberScroll();
      window.removeEventListener("scroll", rememberScroll);
    };
  }, [session, initialDraft]);

  useEffect(() => {
    saveProfileSetupDraft(session, { method, resume, resumeError });
  }, [session, method, resume, resumeError]);

  return (
    <div className="profile-setup">
      <a className="profile-setup__skip" href="#profile-setup-main">
        {t("Skip to content")}
      </a>
      <header className="profile-setup__header">
        <Link
          to="/"
          className="profile-setup__home"
          aria-label={t("MIU Freelance home")}
        >
          <img src={logo} alt="" width="130" height="76" />
        </Link>
        <h1 ref={heading} tabIndex={-1}>
          {t("Let's build your profile")}
        </h1>
        <p className="profile-setup__subtitle">
          {t("Please complete all required fields carefully.")}
        </p>
      </header>

      <main
        id="profile-setup-main"
        className="profile-setup__main"
        tabIndex={-1}
      >
        <ProfileSetupProgress currentStep={1} />

        <section
          className="profile-setup__panel"
          aria-labelledby="profile-method-heading"
        >
          <div className="profile-setup__panel-heading">
            <span className="profile-setup__section-icon">
              <UserRound size={23} aria-hidden="true" />
            </span>
            <div>
              <h2>{t("Your profile, your way")}</h2>
            </div>
            <span className="profile-setup__badge">
              {t("Step {current} of {total}", { current: 1, total: 4 })}
            </span>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (canContinueProfileSetup({ method, resume })) {
                saveProfileSetupDraft(session, { method, resume, resumeError });
                navigate("/profile/setup/work");
              }
            }}
          >
            <fieldset>
              <legend id="profile-method-heading">
                {t("How would you like to start building your profile?")}
              </legend>
              <p className="profile-setup__description">
                {t(
                  student
                    ? "Show clients what you do best. Add your skills, experience, and a little of your personality."
                    : "Introduce yourself and your organization so students can get to know who they'll work with.",
                )}
              </p>
              <div className="profile-setup__methods">
                {methods.map(({ id, Icon, title, description, planned }) => (
                  <label
                    key={id}
                    className={`profile-setup__method ${method === id ? "is-selected" : ""} ${planned ? "is-planned" : ""}`}
                    onClick={() => {
                      if (
                        (id === "resume" || id === "linkedin") &&
                        compactResume
                      )
                        setResumeSheetOpen(true);
                    }}
                  >
                    <input
                      type="radio"
                      name="profile-method"
                      value={id}
                      checked={method === id}
                      disabled={planned}
                      onChange={() => {
                        setMethod(id);
                        setResume(null);
                        setResumeError("");
                        if (id === "manual") setResumeSheetOpen(false);
                      }}
                      aria-controls={
                        id === method && fileMethod
                          ? "profile-resume-panel"
                          : undefined
                      }
                      aria-describedby={`method-${id}-description`}
                    />
                    <span className="profile-setup__method-top">
                      <span className="profile-setup__method-icon">
                        <Icon size={27} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <span className="profile-setup__radio" aria-hidden="true">
                        {method === id && <Check size={13} strokeWidth={3} />}
                      </span>
                    </span>
                    <strong>{t(title)}</strong>
                    <span
                      id={`method-${id}-description`}
                      className="profile-setup__method-description"
                    >
                      {t(description)}
                    </span>
                    {planned && (
                      <span className="profile-setup__method-tag">
                        {t("Coming soon")}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
            {fileMethod && (
              <div id="profile-resume-panel">
                {compactResume ? (
                  (resume || resumeError) && (
                    <div className="profile-resume__mobile-summary">
                      {resume && (
                        <p>
                          <bdi>{resume.name}</bdi>
                        </p>
                      )}
                      {resume && (
                        <button
                          type="button"
                          onClick={() => setResumeSheetOpen(true)}
                        >
                          {t("Change file")}
                        </button>
                      )}
                      {resumeError && (
                        <p className="profile-resume__error" role="status">
                          {t(resumeError)}
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <ResumeUpload
                    source={method}
                    value={resume}
                    onChange={setResume}
                    error={resumeError}
                    onError={setResumeError}
                  />
                )}
              </div>
            )}
            <footer className="profile-setup__actions">
              <Link to="/" className="profile-setup__later">
                <ArrowLeft size={17} aria-hidden="true" />
                {t("I'll do this later")}
              </Link>
              <span className="profile-setup__time">
                {t("A few minutes now. More opportunities ahead.")}
              </span>
              <button
                type="submit"
                disabled={!canContinueProfileSetup({ method, resume })}
              >
                {t("Next")}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </footer>
          </form>
        </section>
        <p className="profile-setup__disclosure">
          {t(
            "Phase 1 prototype. Use fictional details. Accounts reset on refresh; profile edits stay in this tab's session storage.",
          )}
        </p>
      </main>
      {compactResume && fileMethod && (
        <Modal
          open={resumeSheetOpen}
          onClose={() => {
            setResumeSheetOpen(false);
            setMethod("");
            setResume(null);
            setResumeError("");
          }}
          title={t(
            method === "linkedin" ? "Upload LinkedIn profile" : "Upload resume",
          )}
          className="profile-resume-sheet"
          closeOnBackdrop
        >
          {resumeSheetOpen && (
            <ResumeUpload
              source={method}
              compact
              value={resume}
              error={resumeError}
              onError={setResumeError}
              onChange={(file) => {
                setResume(file);
                if (file) setResumeSheetOpen(false);
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
