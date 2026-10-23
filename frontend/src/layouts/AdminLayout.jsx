import AppLayout from "./AppLayout.jsx";
import { Outlet, useMatch } from "react-router-dom";

export default function AdminLayout() {
  const quality = useMatch("/committee/ai-quality");
  if (quality) return <Outlet />;
  return <AppLayout title="Administration" />;
}
