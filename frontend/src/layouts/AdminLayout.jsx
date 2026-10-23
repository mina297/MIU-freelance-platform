import AppLayout from "./AppLayout.jsx";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { pathname } = useLocation();
  if (pathname === "/admin") return <Outlet />;
  return <AppLayout title="Administration" />;
}
