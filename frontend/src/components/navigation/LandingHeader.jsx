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

export default function LandingHeader({ accountAction, themeControl }) {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link to="/" aria-label="MIU Freelance home" className="public-brand">
          <img src={miuLogo} alt="Misr International University" />
          <span>
            Freelance<span className="text-miu-red">.</span>
          </span>
        </Link>
        <nav aria-label="Public navigation" className="public-navigation">
          {navigation.map(({ label, eyebrow, links }) => (
            <Dropdown key={label} label={label} className="public-nav-dropdown">
              {(close) => (
                <>
                  <p className="public-dropdown-eyebrow">{eyebrow}</p>
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
                        <strong>{title}</strong>
                        <small>{description}</small>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  ))}
                </>
              )}
            </Dropdown>
          ))}
          <Link to="/#how-it-works" className="public-nav-link">
            How it works
          </Link>
        </nav>
        <div className="public-auth-links">
          {themeControl}
          {accountAction ?? (
            <>
              <Link to="/login" className="public-sign-in">
                Sign In
              </Link>
              <Link to="/register" className="public-sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
