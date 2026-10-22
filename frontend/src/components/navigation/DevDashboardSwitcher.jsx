import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./DevDashboardSwitcher.css";

const dashboards = [
  { label: "Student Dashboard", path: "/student/dashboard" },
  { label: "Client Dashboard" },
  { label: "Super Admin Dashboard" },
  { label: "Verification Dashboard" },
  { label: "Marketplace Operations Dashboard" },
  { label: "Finance Dashboard" },
  { label: "Support & Disputes Dashboard" },
  { label: "AI & Quality Dashboard" },
];

// Temporary navigation only: no session, role, or dashboard state belongs here.
export default function DevDashboardSwitcher() {
  const ref = useRef(null);
  const { pathname, search } = useLocation();
  useEffect(() => {
    ref.current.open = false;
  }, [pathname, search]);
  useEffect(() => {
    function dismiss(event) {
      if (!ref.current.contains(event.target)) ref.current.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return (
    <nav
      className="dev-dashboard-navigation"
      aria-label="Development navigation"
    >
      <details
        ref={ref}
        className="dev-dashboard-switcher"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            ref.current.open = false;
            ref.current.querySelector("summary").focus();
          }
        }}
      >
        <summary>Development: Switch dashboard</summary>
        <ul aria-label="Dashboards">
          {dashboards.map(({ label, path }) => (
            <li key={label}>
              {path ? (
                <Link
                  to={path}
                  aria-current={pathname === path ? "page" : undefined}
                  onClick={() => {
                    ref.current.open = false;
                  }}
                >
                  {label}
                </Link>
              ) : (
                <span aria-disabled="true">
                  {label}
                  <small>Coming soon</small>
                </span>
              )}
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
