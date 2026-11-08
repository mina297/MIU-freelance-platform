import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { PUBLIC_REGISTRATION_ROLES } from "./session.js";

export default function LoginPage() {
  const { t } = useLanguage();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const selectedRole = params.get("role");
  const role = PUBLIC_REGISTRATION_ROLES.includes(selectedRole)
    ? selectedRole
    : undefined;
  return (
    <AuthForm
      pillSubmit
      title={t("Sign in")}
      submitLabel={t("Sign in")}
      afterSubmit={
        <>
          <p className="text-sm">
            <Link
              className="underline focus-visible:outline-2"
              to="/forgot-password"
            >
              {t("Forgot Password?")}
            </Link>
          </p>
          <GoogleAuthButton label="Sign in with Google" />
        </>
      }
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          autoComplete: "username",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "current-password",
          revealPassword: true,
        },
      ]}
      onSubmit={(values) => {
        const result = login(values);
        if (result.ok) navigate("/", { replace: true });
        return result;
      }}
    >
      <p>
        {t("New here?")}{" "}
        <Link to={role ? `/register?role=${role}` : "/register"}>
          {t("Create an account")}
        </Link>
      </p>
    </AuthForm>
  );
}
