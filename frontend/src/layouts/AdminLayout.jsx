import AppLayout from "./AppLayout.jsx";
import { Outlet, useMatch } from "react-router-dom";

export default function AdminLayout() {
  const support = useMatch("/committee/support");
  if (support) return <Outlet />;
  return <AppLayout title="Administration" />;
}
