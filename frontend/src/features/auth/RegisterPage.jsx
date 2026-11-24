import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";
import AuthForm from "./AuthForm.jsx";
import RoleSelectionPage from "./RoleSelectionPage.jsx";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { publicDestinations } from "../../app/publicDestinations.js";
import { GOOGLE_PREVIEW_PROFILES } from "./mockAuth.js";
import { getRegistrationDestination } from "./navigation.js";

const termsLinks = {
  "{terms}": ["Terms of Service", publicDestinations.terms],
  "{agreement}": [
    "User Agreement",
    `${publicDestinations.terms}#user-agreement`,
  ],
  "{privacy}": ["Privacy Policy", publicDestinations.privacy],
};

export default function RegisterPage() {
  const { t } = useLanguage();

  const { register, registerGoogle, registrationSettings } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const role = params.get("role");
  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) return <RoleSelectionPage />;
  const googleSignup = params.get("method") === "google";
  const profile = GOOGLE_PREVIEW_PROFILES[role];
  const terms = t(
    "Yes, I understand and agree to the {terms}, including the {agreement} and {privacy}.",
  ).split(/(\{terms\}|\{agreement\}|\{privacy\})/);
  return (
    <AuthForm
      key={`${role}-${googleSignup ? "google" : "email"}`}
      wide
      pillSubmit
      title={
        googleSignup
          ? t(
              role === ROLES.STUDENT
                ? "Sign up to find work you love"
                : "Sign up to find the talent you need",
            )
          : t("Join as a {value0}", {
              value0: role === ROLES.STUDENT ? "student" : "client",
            })
      }
      submitLabel={t(googleSignup ? "Create my account" : "Create account")}
      focusTitle={googleSignup}
      intro={
        googleSignup && (
          <div className="auth-google-completion">
            <div className="auth-google-identity">
              <span className="auth-google-avatar" aria-hidden="true">
                {profile.firstName[0]}
              </span>
              <div>
                <strong>{t(`${profile.firstName} ${profile.lastName}`)}</strong>
                <bdi>{profile.email}</bdi>
              </div>
            </div>
            <p className="auth-hint">
              {t(
                "Google sign-up preview: fictional account. No Google connection is made.",
              )}
            </p>
          </div>
        )
      }
      initialValues={{
        country: "Egypt",
        emailSubscription: true,
        acceptTerms: false,
      }}
      afterSubmit={
        !googleSignup && (
          <GoogleAuthButton
            label="Sign up with Google"
            onClick={() => setParams({ role, method: "google" })}
          />
        )
      }
      fields={[
        { name: "firstName", label: "First name", autoComplete: "given-name" },
        { name: "lastName", label: "Last name", autoComplete: "family-name" },
        {
          name: "email",
          label: role === ROLES.STUDENT ? "University Email" : "Email",
          type: "email",
          autoComplete: "email",
          hint:
            role === ROLES.STUDENT
              ? "Use your university email ending in @miuegypt.edu.eg."
              : undefined,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "new-password",
          revealPassword: true,
          hint: "8+ characters, with a letter and a number.",
        },
        {
          name: "country",
          label: "Country",
          options: registrationSettings.countries.map((country) => ({
            value: country,
            label: country,
          })),
        },
        {
          name: "emailSubscription",
          label: "Send me helpful emails to find rewarding work and job leads.",
          type: "checkbox",
          required: false,
        },
        {
          name: "acceptTerms",
          label: terms.map((part) => {
            const link = termsLinks[part];
            return link ? (
              <Link
                key={part}
                to={link[1]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(link[0])}
              </Link>
            ) : (
              part
            );
          }),
          type: "checkbox",
          hint: "Required for this prototype. Policy links open in a new tab.",
        },
      ].filter(
        (field) =>
          !googleSignup ||
          ["country", "emailSubscription", "acceptTerms"].includes(field.name),
      )}
      onSubmit={(values) => {
        const result = (googleSignup ? registerGoogle : register)({
          ...values,
          role,
        });
        if (result.ok)
          navigate(getRegistrationDestination(result.user), { replace: true });
        return result;
      }}
    >
      {googleSignup && (
        <Link to={`/register?role=${role}`}>{t("Use email instead")}</Link>
      )}
      <p>
        {t("Already a member?")}{" "}
        <Link to={`/login?role=${role}`}>{t("Sign in")}</Link>
      </p>
    </AuthForm>
  );
}
