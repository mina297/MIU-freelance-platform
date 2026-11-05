import { matchRoutes } from "react-router-dom";
import { routeConfig } from "../../app/routeConfig.js";
import { getRouteAccess, isActiveUser } from "../../features/auth/session.js";

export const NAVIGATION_STORAGE_KEY = "miu.navigation-layout";
export function readNavigationLayout(storage) {
  try {
    return storage?.getItem(NAVIGATION_STORAGE_KEY) === "side" ? "side" : "top";
  } catch {
    return "top";
  }
}
export function saveNavigationLayout(storage, value) {
  if (!["top", "side"].includes(value)) return false;
  try {
    storage?.setItem(NAVIGATION_STORAGE_KEY, value);
    return Boolean(storage);
  } catch {
    return false;
  }
}
export function usesApplicationNavigation(session, pathname) {
  if (session.status !== "authenticated" || !isActiveUser(session.user))
    return false;
  const route = matchRoutes(routeConfig, pathname)?.at(-1)?.route;
  if (!route || getRouteAccess(session, route) !== "allowed") return false;
  return (
    route.access !== "public" ||
    [
      "/projects",
      "/services",
      "/freelancers",
      "/recommendations",
      "/help",
      "/support/contact",
      "/students",
      "/clients",
    ].some((path) => pathname === path || pathname.startsWith(`${path}/`))
  );
}
const publicWork = ["/projects", "/services", "/freelancers"];
export function navigationItems(session) {
  const priority = [
    `/${session.user?.role}/dashboard`,
    `/${session.user?.role}/orders`,
    session.user?.role === "student"
      ? "/student/proposals"
      : "/client/projects",
    session.user?.role === "student" ? "/student/services" : "/services",
    "/projects",
    "/admin",
  ];
  return routeConfig
    .filter(
      (route) =>
        route.path !== "*" &&
        !route.path.includes(":") &&
        route.showInNavigation !== false &&
        (route.access !== "public" || publicWork.includes(route.path)) &&
        getRouteAccess(session, route) === "allowed",
    )
    .sort(
      (a, b) =>
        (priority.includes(a.path) ? priority.indexOf(a.path) : 99) -
        (priority.includes(b.path) ? priority.indexOf(b.path) : 99),
    )
    .map((route) => ({ to: route.path, label: route.path === "/client/projects/new" ? "Post a project" : route.path.endsWith("/dashboard") ? "Overview" : route.path.endsWith("/orders") ? "Orders" : route.title }));
}
