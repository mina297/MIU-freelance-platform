import AppLayout from "./AppLayout.jsx";
import { Outlet, useMatch } from "react-router-dom";

export default function AdminLayout() {
  const finance = useMatch("/committee/finance");
  if (finance) return <Outlet />;
  return <AppLayout title="Administration" />;
}
