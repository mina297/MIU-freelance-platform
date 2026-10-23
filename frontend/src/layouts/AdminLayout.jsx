import AppLayout from "./AppLayout.jsx";
import { Outlet, useMatch } from "react-router-dom";

export default function AdminLayout() {
  const verification = useMatch("/committee/verification");
  if (verification) return <Outlet />;
  return <AppLayout title="Administration" />;
}
