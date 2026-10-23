import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { routeConfig } from "../../app/routeConfig.js";
import { getLoginDestination } from "./navigation.js";
import AuthForm from "./AuthForm.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in to demo"
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
        },
      ]}
      onSubmit={(values) => {
        const result = login(values);
        if (result.ok)
          navigate(
            getLoginDestination(result.user, location.state?.from, routeConfig),
            { replace: true },
          );
        return result;
      }}
    >
      {location.state?.registered && (
        <p role="status">Demo account created. Log in before refreshing.</p>
      )}
      <p>
        Registered accounts can log in here. Existing fixture accounts remain
        available in the simulated session selector above.
      </p>
      <p>
        <Link to="/register/role">Create a student or client account</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </AuthForm>
  );
}
