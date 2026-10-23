import { Link } from "react-router-dom";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";

export default function RoleSelectionPage() {
  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl border p-6">
      <h1 className="text-2xl font-bold">Choose your account role</h1>
      <p>
        Simulated registration is available for students and clients only.
        Committee accounts are provisioned by the Super Admin.
      </p>
      <div className="flex flex-wrap gap-4">
        {PUBLIC_REGISTRATION_ROLES.map((role) => (
          <Link
            key={role}
            to={`/register?role=${role}`}
            className="rounded border p-3 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            {role === ROLES.STUDENT ? "Student" : "Client"}
          </Link>
        ))}
      </div>
      <Link to="/login" className="underline">
        Back to login
      </Link>
    </section>
  );
}
