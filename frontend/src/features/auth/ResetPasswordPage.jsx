import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const location = useLocation();
  return (
    <AuthForm
      title="Simulated password reset"
      submitLabel="Reset in-memory password"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        {
          name: "password",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
          hint: "At least 8 characters, including a letter and a number.",
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
        <p role="status">
          Simulated recovery request accepted. No email was sent and no secure
          reset token was created.
        </p>
      )}
      <p>
        Demo only: this form checks no secure token or email ownership. Anyone
        in this demo can reset an active in-memory account by email. This is not
        production recovery.
      </p>
      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </AuthForm>
  );
}
