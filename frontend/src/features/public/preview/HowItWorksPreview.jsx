import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../index.css";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import "./marketplace-preview.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <main className="marketplace-preview">
      <h1 className="sr-only">How it works component preview</h1>
      <HowItWorksSection />
    </main>
  </StrictMode>,
);
