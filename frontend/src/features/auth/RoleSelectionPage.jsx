import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link } from "react-router-dom";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";
import "./roleSelection.css";

export default function RoleSelectionPage() {
  const { t } = useLanguage();

  return (
    <section className="role-selection" aria-labelledby="role-selection-title">
      <header>
        <p className="role-selection-eyebrow">{t("Join MIU Freelance")}</p>
        <h1 id="role-selection-title">{t("Choose your account role")}</h1>
      </header>
      <div className="role-selection-cards">
        {PUBLIC_REGISTRATION_ROLES.map((role) => (
          <Link
            key={role}
            to={`/register?role=${role}`}
            className="registration-role-card"
          >
            <h2>{role === ROLES.STUDENT ? t("Student") : t("Client")}</h2>
            <p>
              {role === ROLES.STUDENT
                ? t("Find work. Share your skills.")
                : t("Hire talent. Bring ideas to life.")}
            </p>
          </Link>
        ))}
      </div>
      <footer className="role-selection-footer">
        <p>
          {t("Already have an account?")}{" "}
          <Link to="/login">{t("Sign in")}</Link>
        </p>
        <p className="role-selection-note">{t("Prototype registration")}</p>
      </footer>
    </section>
  );
}
