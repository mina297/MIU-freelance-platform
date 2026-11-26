import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectStudentRecords } from "./studentDashboardModel.js";
import "../dashboard.css";
import DashboardLayout from "../shared/DashboardLayout.jsx";
import { useDashboardSection } from "../shared/useDashboardSection.js";
import { DetailDialog } from "../shared/DashboardUi.jsx";
import { Icon } from "./StudentDashboardUi.jsx";
import { StudentSectionViews } from "./StudentDashboardPanels.jsx";
import { studentDashboardNavigation as navigation } from "./studentDashboardNavigation.js";

export default function StudentDashboard() {
  const { t } = useLanguage();

  const { activeSection: section, navigate } = useDashboardSection(
    navigation.map(([id, label]) => ({ id, label })),
    "overview",
  );
  const [scenario, setScenario] = useState("sample");
  const [loaded, setLoaded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [notifications, setNotifications] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(timer);
  }, [scenario]);
  const { rows, jobs } = selectStudentRecords(scenario);
  const label = navigation.find(([key]) => key === section)[1];
  function showHelp() {
    setDetail({
      title: "Help & support",
      body: "This is a frontend demonstration with fictional records. Support tickets and disputes are planned in the support module; no message will be sent from this preview.",
    });
  }
  return (
    <DashboardLayout
      contentOnly
      title="Student dashboard"
      variant="student"
      navItems={navigation.map(([id, label]) => ({
        id,
        label,
        icon: <Icon name={id} />,
      }))}
      defaultSection="overview"
      mainId="student-main"
      navLabel="Student workspace"
      caption="STUDENT WORKSPACE"
      overlays={
        <>
          {detail && (
            <DetailDialog detail={detail} close={() => setDetail(null)} />
          )}
        </>
      }
    >
      <div className="sd-welcome">
        <div>
          <h1>{section === "overview" ? t("Welcome back, Nour") : t(label)}</h1>
          <p>
            {t("Keep your applications and current projects moving forward.")}
          </p>
        </div>
        <Link className="sd-button sd-primary" to="/projects">
          <Icon name="search" />
          {t("Browse Jobs")}
        </Link>
      </div>
      {!loaded ? (
        <section role="status" className="sd-panel sd-loading">
          {t("Loading dashboard…")}
          <div />
          <div />
        </section>
      ) : scenario === "error" ? (
        <section className="sd-panel sd-empty" role="alert">
          <h2>{t("Dashboard unavailable")}</h2>
          <p>{t("Simulated load failure. Your data has not changed.")}</p>
          <button
            className="sd-button sd-primary"
            onClick={() => {
              setLoaded(false);
              setScenario("sample");
            }}
          >
            {t("Try again")}
          </button>
        </section>
      ) : (
        <>
          <StudentSectionViews
            {...{
              section,
              rows,
              jobs,
              scenario,
              setDetail,
              navigate,
              notifications,
              setNotifications,
            }}
          />
        </>
      )}
      <footer className="sd-footer">
        <span>{t("© 2026 MIU Freelance")}</span>
        <button onClick={showHelp}>{t("Help & support")}</button>
      </footer>
      <details className="sd-demo-controls">
        <summary>{t("Frontend demo · fictional data")}</summary>
        <p>
          {t(
            "Simulated access, progress, ratings, and finances. No backend or real identity verification.",
          )}
        </p>
        <label>
          {t("Preview state")}{" "}
          <select
            value={scenario}
            onChange={(event) => {
              setLoaded(false);
              setScenario(event.target.value);
            }}
          >
            <option value="sample">{t("Sample data")}</option>
            <option value="empty">{t("Empty")}</option>
            <option value="error">{t("Error")}</option>
          </select>
        </label>
      </details>
    </DashboardLayout>
  );
}
