import { matchPath } from "react-router-dom";
import { getRouteAccess } from "./session.js";

export function getLoginDestination(user, requested, routes) {
  const fallback =
    routes.find(
      (route) =>
        ["app", "admin"].includes(route.layout) &&
        route.roles?.length === 1 &&
        route.roles[0] === user.role,
    )?.path || "/";
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
