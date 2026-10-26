import { useLanguage } from "../i18n/LanguageContext.js";
import AppLayout from "./AppLayout.jsx";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { t } = useLanguage();

  const { pathname } = useLocation();
  if (pathname === "/admin") return <Outlet />;
  return <AppLayout title={t("Administration")} />;
}
