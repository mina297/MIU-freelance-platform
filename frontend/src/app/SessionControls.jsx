import { useState } from "react";
import { mockUsers } from "../data/fixtures/users.js";
import { useAuth } from "../hooks/useAuth.js";

export default function SessionControls() {
  const { session, startDemoSession, logout, expireSession } = useAuth();
  const [selectedId, setSelectedId] = useState(mockUsers[0].id);
  return (
    <section
      aria-label="Prototype session controls"
      className="premium-session-controls my-6 space-y-3 rounded border p-4"
    >
      <h2 className="font-bold">Simulated session controls</h2>
      <p>
        No real authentication. Refresh clears the session. Committee accounts
        here represent provisioned test accounts.
      </p>
      <p role="status">
        {session.user
          ? `${session.user.displayName} (${session.user.role})`
          : `Session: ${session.status}`}
      </p>
      <label className="block" htmlFor="demo-account">
        Test account
      </label>
      <select
        id="demo-account"
        className="max-w-full rounded border p-2"
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value)}
      >
        {mockUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.displayName} — {user.role}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded border p-2"
          onClick={() => startDemoSession(selectedId)}
        >
          Start test session
        </button>
        <button
          className="rounded border p-2"
          onClick={logout}
          disabled={session.status === "anonymous"}
        >
          Log out
        </button>
        <button
          className="rounded border p-2"
          onClick={expireSession}
          disabled={session.status !== "authenticated"}
        >
          Simulate expiry
        </button>
      </div>
    </section>
  );
}
