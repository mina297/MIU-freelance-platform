import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";
import AuthForm from "./AuthForm.jsx";
import RoleSelectionPage from "./RoleSelectionPage.jsx";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { publicDestinations } from "../../app/publicDestinations.js";

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

  const { register, registrationSettings } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role");
  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) return <RoleSelectionPage />;
  const terms = t(
    "Yes, I understand and agree to the {terms}, including the {agreement} and {privacy}.",
  ).split(/(\{terms\}|\{agreement\}|\{privacy\})/);
  return (
    <AuthForm
      key={role}
      wide
      pillSubmit
      title={t("Join as a {value0}", {
        value0: role === ROLES.STUDENT ? "student" : "client",
      })}
      submitLabel={t("Create account")}
      initialValues={{
        country: "Egypt",
        emailSubscription: true,
        acceptTerms: false,
      }}
      afterSubmit={<GoogleAuthButton label="Sign up with Google" />}
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
      ]}
      onSubmit={(values) => {
        const result = register({ ...values, role });
        if (result.ok) navigate("/", { replace: true });
        return result;
      }}
    >
      <p>
        {t("Already a member?")}{" "}
        <Link to={`/login?role=${role}`}>{t("Sign in")}</Link>
      </p>
    </AuthForm>
  );
}
