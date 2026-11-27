import { useReducer, useState } from "react";
import { mockUsers } from "../data/fixtures/users.js";
import { INITIAL_SESSION, sessionReducer } from "../features/auth/session.js";
import { AuthContext } from "./AuthContext.js";
import { createLocalAuthStore } from "../features/auth/localAuthStore.js";
import { createRegistrationProfile } from "../features/profiles/registrationProfiles.js";

export default function AuthProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, INITIAL_SESSION);
  const [accounts] = useState(() => createLocalAuthStore(mockUsers));
  const [, refreshAccounts] = useReducer((value) => value + 1, 0);
  const [registrationSettings, setRegistrationSettings] = useState(
    accounts.getRegistrationSettings,
  );
  return (
    <AuthContext.Provider
      value={{
        session,
        listAccounts: () => accounts.listUsers(session),
        accountAudit: accounts.getAudit(session),
        updateAccountStatus: (values) => {
          const result = accounts.updateAccountStatus(session, values);
          if (result.ok) refreshAccounts();
          return result;
        },
        registrationSettings,
        addRegistrationCountry: (values) => {
          const result = accounts.addRegistrationCountry(session, values);
          if (result.ok)
            setRegistrationSettings(accounts.getRegistrationSettings());
          return result;
        },
        startDemoSession: (userId) =>
          dispatch({
            type: "start",
            user: accounts.findUser(userId),
          }),
        register: async (values) => {
          const result = await accounts.register(values);
          if (result.ok) {
            createRegistrationProfile(result.user);
            dispatch({ type: "start", user: result.user });
          }
          return result;
        },
        registerGoogle: async (values) => {
          const result = await accounts.registerGoogle(values);
          if (result.ok) {
            createRegistrationProfile(result.user);
            dispatch({ type: "start", user: result.user });
          }
          return result;
        },
        login: async (values) => {
          const result = await accounts.login(values);
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
