import { useLanguage } from "../../i18n/LanguageContext.js";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";
import Dropdown from "../ui/Dropdown.jsx";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import "./publicHeader.css";
import ThemeToggle from "../../theme/ThemeToggle.jsx";
import LanguageControl from "../../i18n/LanguageControl.jsx";

const navigation = [
  {
    label: "Hire Talent",
    eyebrow: "Make your next idea happen",
    links: [
      {
        to: "/#student-talent",
        title: "Explore student talent",
        description: "Meet skilled students from MIU.",
        icon: Users,
      },
      {
        to: "/services",
        title: "Browse services",
        description: "Discover services for your next project.",
        icon: Layers,
      },
      {
        to: "/register?role=client",
        title: "Post a job",
        description: "Get started with a client account.",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Find Work",
    eyebrow: "Build a career around your skills",
    links: [
      {
        to: "/projects",
        title: "Browse projects",
        description: "Find your next opportunity.",
        icon: BriefcaseBusiness,
      },
      {
        to: "/register?role=student",
        title: "Join as a student",
        description: "Turn your skills into experience.",
        icon: GraduationCap,
      },
      {
        to: "/#how-it-works",
        title: "How it works",
        description: "Your path from first brief to delivery.",
        icon: Layers,
      },
    ],
  },
];

export default function LandingHeader({ accountAction }) {
  const { t } = useLanguage();

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link
          to="/"
          aria-label={t("MIU Freelance home")}
          className="public-brand"
        >
          <img src={miuLogo} alt={t("Misr International University")} />
          <span>
            {t("Freelance")}
            <span className="text-[var(--theme-accent,var(--color-miu-red))]">
              .
            </span>
          </span>
        </Link>
        <nav aria-label={t("Public navigation")} className="public-navigation">
          {navigation.map(({ label, eyebrow, links }) => (
            <Dropdown
              key={label}
              label={t(label)}
              className="public-nav-dropdown"
            >
              {(close) => (
                <>
                  <p className="public-dropdown-eyebrow">{t(eyebrow)}</p>
                  {links.map(({ to, title, description, icon: ItemIcon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={close}
                      className="public-dropdown-link"
                    >
                      <span className="public-dropdown-icon">
                        <ItemIcon size={20} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{t(title)}</strong>
                        <small>{t(description)}</small>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  ))}
                </>
              )}
            </Dropdown>
          ))}
          <Link to="/#how-it-works" className="public-nav-link">
            {t("How it works")}
          </Link>
        </nav>
        <div className="public-auth-links">
          <LanguageControl />
          <ThemeToggle />
          {accountAction ?? (
            <>
              <Link to="/login" className="public-sign-in">
                {t("Sign In")}
              </Link>
              <Link to="/register" className="public-sign-up">
                {t("Sign Up")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
