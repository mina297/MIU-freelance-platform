import { useReducer } from "react";
import { mockUsers } from "../data/fixtures/users.js";
import { INITIAL_SESSION, sessionReducer } from "../features/auth/session.js";
import { AuthContext } from "./AuthContext.js";

export default function AuthProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, INITIAL_SESSION);
  return (
    <AuthContext.Provider
      value={{
        session,
        startDemoSession: (userId) =>
          dispatch({
            type: "start",
            user: mockUsers.find((user) => user.id === userId),
          }),
        logout: () => dispatch({ type: "logout" }),
        expireSession: () => dispatch({ type: "expire" }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
