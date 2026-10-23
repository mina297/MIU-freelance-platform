import { Link, NavLink } from "react-router-dom";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";

export default function PublicHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-5 px-5 py-4 sm:px-8">
        <Link
          to="/"
          aria-label="MIU Freelance home"
          className="flex items-center gap-4 rounded focus-visible:outline-2 focus-visible:outline-miu-red"
        >
          <img
            src={miuLogo}
            alt="Misr International University"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
          <span className="hidden border-l border-gray-200 pl-4 text-sm font-bold sm:inline">
            Freelance<span className="text-miu-red">.</span>
          </span>
        </Link>
        <nav
          aria-label="Public navigation"
          className="order-3 flex w-full flex-wrap gap-6 text-sm font-medium md:order-none md:w-auto md:flex-1 md:justify-center"
        >
          {[
            ["/", "Home"],
            ["/projects", "Projects"],
            ["/services", "Services"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `rounded py-2 focus-visible:outline-2 focus-visible:outline-miu-red ${isActive ? "text-miu-red" : "text-gray-700 hover:text-miu-red"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-sm font-semibold">
          <Link
            to="/login"
            className="rounded-lg border border-miu-red px-4 py-2.5 text-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-miu-red px-4 py-2.5 text-white hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
