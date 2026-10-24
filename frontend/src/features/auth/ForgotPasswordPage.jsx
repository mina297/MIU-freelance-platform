import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  return (
    <AuthForm
      title="Forgot password"
      submitLabel="Continue"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
      ]}
      onSubmit={(values) => {
        const result = forgotPassword(values.email);
        if (result.ok)
          navigate("/reset-password", { state: { recoveryRequested: true } });
        return result;
      }}
    >
      <p>Prototype recovery. No email or reset link is sent.</p>
      <p>
        <Link to="/reset-password">Open reset form</Link>
      </p>
      <p>
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthForm>
  );
}
