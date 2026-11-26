import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { PUBLIC_REGISTRATION_ROLES } from "./session.js";
import { getLoginDestination } from "./localAuthStore.js";

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
      wide
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
      onSubmit={async (values) => {
        const result = await login(values);
        if (result.ok)
          navigate(getLoginDestination(result.user), { replace: true });
        return result;
      }}
    >
      <details>
        <summary>{t("Fictional demo sign-in accounts")}</summary>
        <p>{t("Demo password: MiuDemo2026! — use fictional details only.")}</p>
        <p>admin_001@example.test</p>
        <p>committee_verification_001@example.test</p>
        <p>committee_marketplace_001@example.test</p>
        <p>committee_finance_001@example.test</p>
        <p>committee_support_001@example.test</p>
        <p>committee_ai_quality_001@example.test</p>
      </details>
      <p>
        {t("New here?")}{" "}
        <Link to={role ? `/register?role=${role}` : "/register"}>
          {t("Create an account")}
        </Link>
      </p>
    </AuthForm>
  );
}
