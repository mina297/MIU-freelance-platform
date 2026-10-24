import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <AuthForm
      title="Sign in"
      submitLabel="Sign in"
      afterSubmit={
        <p className="text-sm">
          <Link
            className="underline focus-visible:outline-2"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
        </p>
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
        },
      ]}
      onSubmit={(values) => {
        const result = login(values);
        if (result.ok) navigate("/", { replace: true });
        return result;
      }}
    >
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthForm>
  );
}
