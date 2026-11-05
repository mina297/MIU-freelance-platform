import { useLanguage } from "../i18n/LanguageContext.js";
import AppLayout from "./AppLayout.jsx";


export default function AdminLayout() {
  const { t } = useLanguage();

  return <AppLayout title={t("Administration")} />;
}
