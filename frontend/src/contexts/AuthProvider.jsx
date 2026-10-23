import { useReducer, useState } from "react";
import { mockUsers } from "../data/fixtures/users.js";
import { INITIAL_SESSION, sessionReducer } from "../features/auth/session.js";
import { AuthContext } from "./AuthContext.js";
import { createMockAuthStore } from "../features/auth/mockAuth.js";

export default function AuthProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, INITIAL_SESSION);
  const [accounts] = useState(() => createMockAuthStore(mockUsers));
  return (
    <AuthContext.Provider
      value={{
        session,
        startDemoSession: (userId) =>
          dispatch({
            type: "start",
            user: accounts.findUser(userId),
          }),
        register: (values) => accounts.register(values),
        login: (values) => {
          const result = accounts.login(values);
          // Failed attempts must not preserve a previous privileged session.
          dispatch(
            result.ok
              ? { type: "start", user: result.user }
              : { type: "logout" },
          );
          return result;
        },
        forgotPassword: (email) => accounts.forgotPassword(email),
        resetPassword: (values) => accounts.resetPassword(values),
        logout: () => dispatch({ type: "logout" }),
        expireSession: () => dispatch({ type: "expire" }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
