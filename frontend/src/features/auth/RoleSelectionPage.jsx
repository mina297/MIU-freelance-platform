import { Link } from "react-router-dom";
import { PUBLIC_REGISTRATION_ROLES, ROLES } from "./session.js";

export default function RoleSelectionPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold">Choose your account role</h1>
      <p>
        Simulated registration is available for students and clients only.
        Committee accounts are provisioned by the Super Admin.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {PUBLIC_REGISTRATION_ROLES.map((role) => (
          <Link
            key={role}
            to={`/register?role=${role}`}
            className="space-y-3 rounded-xl border border-gray-300 p-6 transition-colors hover:border-miu-red hover:bg-miu-red-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            <h2 className="text-xl font-semibold">
              {role === ROLES.STUDENT ? "Student" : "Client"}
            </h2>
            <p className="text-sm text-gray-700">
              {role === ROLES.STUDENT
                ? "Offer your skills, submit proposals, and publish freelance services."
                : "Post projects, discover student talent, and order services."}
            </p>
            <span className="block font-medium text-miu-red">
              Continue as {role === ROLES.STUDENT ? "Student" : "Client"} →
            </span>
          </Link>
        ))}
      </div>
      <Link to="/login" className="underline">
        Back to login
      </Link>
    </section>
  );
}
