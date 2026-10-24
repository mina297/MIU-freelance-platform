import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";
import AuthForm from "./AuthForm.jsx";
import RoleSelectionPage from "./RoleSelectionPage.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role");
  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) return <RoleSelectionPage />;
  return (
    <AuthForm
      key={role}
      title={`Join as a ${role === ROLES.STUDENT ? "student" : "client"}`}
      submitLabel="Create account"
      initialValues={{
        role: PUBLIC_REGISTRATION_ROLES.includes(role) ? role : "",
      }}
      fields={[
        { name: "fullName", label: "Full name", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        {
          name: "password",
          label: "Password",
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
      onSubmit={(values) => {
        const result = register({ ...values, role });
        if (result.ok) navigate("/", { replace: true });
        return result;
      }}
    >
      <p>
        <Link to="/register">Change account type</Link>
      </p>
      <p>
        Already a member? <Link to="/login">Sign in</Link>
      </p>
    </AuthForm>
  );
}
