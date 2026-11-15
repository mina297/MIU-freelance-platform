import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dashboardStudent,
  selectStudentRecords,
} from "./studentDashboardModel.js";
import "../dashboard.css";
import DashboardLayout from "../shared/DashboardLayout.jsx";
import { useDashboardSection } from "../shared/useDashboardSection.js";
import { DetailDialog } from "../shared/DashboardUi.jsx";
import { asset } from "./studentDashboardAssets.js";
import { Icon } from "./StudentDashboardUi.jsx";
import { StudentSectionViews } from "./StudentDashboardPanels.jsx";

const navigation = [
  ["overview", "Overview"],
  ["applications", "My Applications"],
  ["active", "Active Jobs"],
  ["completed", "Completed Jobs"],
  ["profile", "Profile"],
  ["settings", "Settings"],
];
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
      brand={
        <>
          {" "}
          <Link to="/projects" className="sd-brand">
            <img src={asset("logo")} alt={t("MIU anniversary logo")} />
            <span>
              <b>{t("MIU Freelance")}</b>
              <small>{t("The MIU community at work")}</small>
            </span>
          </Link>
        </>
      }
      sidebarFooter={
        <>
          {" "}
          <div className="sd-help">
            <Icon name="shield" />
            <h3>{t("Built on campus trust")}</h3>
            <p>{t("Real projects. Verified members of the MIU community.")}</p>
            <button onClick={showHelp}>{t("Visit Help Center →")}</button>
          </div>
        </>
      }
      mobileAccount={
        <img
          className="sd-mobile-avatar"
          src={asset("avatar")}
          alt={t("Fictional student avatar")}
        />
      }
      headerAccount={
        <>
          {" "}
          <div className="sd-account">
            <Link to="/projects">{t("Browse Jobs")}</Link>
            <button
              aria-label={t("View notifications")}
              onClick={() =>
                setDetail({
                  title: "Notifications",
                  body: "Demo notification: your campus map proposal was accepted. Notifications are fictional and do not update from a server.",
                })
              }
            >
              <Icon name="bell" />
            </button>
            <img
              className="sd-avatar"
              src={asset("avatar")}
              alt={t("Fictional student avatar")}
            />
            <span>
              <b>{dashboardStudent.name}</b>
              <small>{dashboardStudent.course}</small>
            </span>
          </div>
        </>
      }
      breadcrumbIcon={<Icon name="chevron" />}
      navigationLinks={[
        {
          to: "/student/orders",
          label: "Orders",
          icon: <Icon name="briefcase" />,
        },
      ]}
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
          <h1>{section === "overview" ? t("Welcome back, Nour") : label}</h1>
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
