import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import AuthForm from "./AuthForm.jsx";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  return (
    <AuthForm
      title="Forgot password"
      submitLabel="Simulate recovery request"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
      ]}
      onSubmit={(values) => forgotPassword(values.email)}
    >
      <p>No email is sent and no secure recovery token is created.</p>
      <p>
        <Link to="/reset-password">Open simulated reset form</Link>
      </p>
      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </AuthForm>
  );
}
