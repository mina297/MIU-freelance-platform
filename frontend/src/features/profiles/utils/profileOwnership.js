import { isActiveUser } from "../../auth/session.js";

export function ownsProfile(session, profileId, role) {
  return (
    session?.status === "authenticated" &&
    isActiveUser(session.user) &&
    ["student", "client"].includes(role) &&
    session.user.role === role &&
    session.user.id === profileId
  );
}
