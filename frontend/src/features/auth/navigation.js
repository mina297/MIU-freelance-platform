import { matchPath } from "react-router-dom";
import { getRouteAccess, ROLES } from "./session.js";
import { getLoginDestination as getWorkspacePath } from "./localAuthStore.js";

export function getRegistrationDestination(user) {
  return [ROLES.STUDENT, ROLES.CLIENT].includes(user.role) ? "/profile" : "/";
}

export function getLoginDestination(user, requested, routes) {
  if ([ROLES.STUDENT, ROLES.CLIENT].includes(user.role)) return "/profile";
  const workspace = getWorkspacePath(user);
  const fallback = routes.some((route) => route.path === workspace)
    ? workspace
    : "/";
  if (
    typeof requested !== "string" ||
    !requested.startsWith("/") ||
    requested.startsWith("//") ||
    requested.includes("\\") ||
    [...requested].some(
      (character) =>
        character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127,
    )
  )
    return fallback;
  try {
    const url = new URL(requested, "https://miu.invalid");
    if (url.origin !== "https://miu.invalid") return fallback;
    const route = routes.find(
      (item) =>
        item.path !== "*" &&
        matchPath({ path: item.path, end: true }, url.pathname),
    );
    if (
      !route ||
      route.layout === "auth" ||
      route.message ||
      getRouteAccess({ status: "authenticated", user }, route) !== "allowed"
    )
      return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
