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
      title={`Create a ${role === ROLES.STUDENT ? "student" : "client"} account`}
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
          hint: "At least 8 characters, including a letter and a number.",
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
        if (result.ok)
          navigate("/login", { replace: true, state: { registered: true } });
        return result;
      }}
    >
      <p>
        Registration does not verify your identity. Verification remains a
        separate planned flow.
      </p>
      <p>
        <Link to="/register">Choose a different role</Link>
      </p>
      <p>
        <Link to="/login">Already have a demo account?</Link>
      </p>
    </AuthForm>
  );
}
