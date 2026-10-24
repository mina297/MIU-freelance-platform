import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../../index.css";
import PublicLayout from "../../../layouts/PublicLayout.jsx";
import Select from "../../../components/ui/Select.jsx";
import LandingPage from "../LandingPage.jsx";
import AboutPage from "../AboutPage.jsx";
import HowItWorksPage from "../HowItWorksPage.jsx";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import TermsPage from "../TermsPage.jsx";
import PrivacyPage from "../PrivacyPage.jsx";
import LoadingDemoPage from "../LoadingDemoPage.jsx";
import ErrorDemoPage from "../ErrorDemoPage.jsx";
import "./marketplace-preview.css";

const PAGES = [
  ["landing", "Member 4 landing design"],
  ["about", "About"],
  ["howItWorks", "How It Works"],
  ["terms", "Terms placeholder"],
  ["privacy", "Privacy placeholder"],
  ["loading", "Loading states"],
  ["error", "Empty/error states"],
];
const destinations = Object.fromEntries(
  PAGES.map(([key]) => [
    key === "landing" ? "home" : key,
    `/m4-pages-preview.html?page=${key}`,
  ]),
);

export default function PublicPagesPreview() {
  const requested = new URLSearchParams(window.location.search).get("page");
  const [page, setPage] = useState(
    PAGES.some(([id]) => id === requested) ? requested : "landing",
  );
  const content = {
    landing: (
      <LandingPage
        destinations={destinations}
        howItWorks={<HowItWorksSection />}
      />
    ),
    about: <AboutPage destinations={destinations} />,
    howItWorks: (
      <HowItWorksPage
        destinations={destinations}
        howItWorks={<HowItWorksSection />}
      />
    ),
    terms: <TermsPage destinations={destinations} />,
    privacy: <PrivacyPage destinations={destinations} />,
    loading: <LoadingDemoPage />,
    error: <ErrorDemoPage />,
  };
  return (
    <div className="marketplace-preview">
      <nav
        aria-label="Member 4 design preview"
        className="marketplace-preview__toolbar"
      >
        <div>
          <strong>MIU Freelance. Design studio</strong>
          <p>Member 4 pages, styled to match the project marketplace.</p>
        </div>
        <Select
          label="Page to preview"
          value={page}
          onChange={(event) => setPage(event.target.value)}
        >
          {PAGES.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
        <a className="inline-block underline" href="/shared-ui-preview.html">
          Open all shared components
        </a>
      </nav>
      <PublicLayout
        destinations={destinations}
        currentPath={destinations[page === "landing" ? "home" : page]}
      >
        {content[page]}
      </PublicLayout>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PublicPagesPreview />
  </StrictMode>,
);
