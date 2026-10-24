import { Outlet } from "react-router-dom";
import LandingHeader from "../components/navigation/LandingHeader.jsx";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">
        Skip to content
      </a>
      <LandingHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
