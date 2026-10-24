import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const location = useLocation();
  return (
    <AuthForm
      title="Reset password"
      submitLabel="Reset password"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        {
          name: "password",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
          hint: "8+ characters, with a letter and a number.",
        },
        {
          name: "confirmPassword",
          label: "Confirm password",
          type: "password",
          autoComplete: "new-password",
        },
      ]}
      onSubmit={resetPassword}
    >
      {location.state?.recoveryRequested && (
        <p role="status">Request accepted. No email was sent.</p>
      )}
      <p>
        Prototype reset: email ownership and reset tokens are not checked. Use
        test accounts only.
      </p>
      <p>
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthForm>
  );
}
