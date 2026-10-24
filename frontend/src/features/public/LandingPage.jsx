import { useId, useMemo, useRef, useState } from "react";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import Button from "../../components/ui/Button.jsx";
import HeroSection from "./landing/HeroSection.jsx";
import FeaturedOpportunities from "./landing/FeaturedOpportunities.jsx";
import FeaturedStudents from "./landing/FeaturedStudents.jsx";
import TrustSection from "./landing/TrustSection.jsx";
import {
  getLandingDiscovery,
  getServiceStartingPrice,
} from "./landing/discoveryModel.js";
import "./landing/landing.css";

/** Page content for PublicLayout; no routing, sessions, or marketplace mutations. */
export default function LandingPage({
  data = marketplaceData,
  destinations = {},
  getProjectHref,
  getServiceHref,
  getStudentHref,
  howItWorks = null,
  discoveryState = "ready",
  onRetry,
}) {
  const [filters, setFilters] = useState({ query: "", categoryId: "" });
  const [savedIds, setSavedIds] = useState([]);
  const [saveNotice, setSaveNotice] = useState("");
  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const resultsId = useId();
  const projectId = `${resultsId}-projects`;
  const serviceId = `${resultsId}-services`;
  const ready = discoveryState === "ready";
  const results = useMemo(
    () =>
      ready
        ? getLandingDiscovery(filters, data)
        : { projects: [], services: [] },
    [filters, data, ready],
  );
  const skillNames = new Map(data.skills.map(({ id, label }) => [id, label]));
  const categoryNames = new Map(
    data.categories.map(({ id, label }) => [id, label]),
  );

  function clearFilters() {
    setFilters({ query: "", categoryId: "" });
    inputRef.current?.focus();
  }

  function toggleSaved(id) {
    const saved = savedIds.includes(id);
    setSavedIds((current) =>
      saved ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
    setSaveNotice(
      saved
        ? "Project removed from this preview's saved list."
        : "Project saved only while this landing preview is open.",
    );
  }

  const projects = results.projects.map((project) => ({
    ...project,
    participantName: data.participants.clients.find(
      ({ id }) => id === project.clientId,
    )?.displayName,
    skillLabels: project.requiredSkillIds
      .map((id) => skillNames.get(id))
      .filter(Boolean),
    categoryLabel: categoryNames.get(project.categoryId),
    priceEGP: project.budgetEGP,
  }));
  const services = results.services.map((service) => ({
    ...service,
    participantName: data.participants.students.find(
      ({ id }) => id === service.studentId,
    )?.displayName,
    skillLabels: service.skillIds
      .map((id) => skillNames.get(id))
      .filter(Boolean),
    categoryLabel: categoryNames.get(service.categoryId),
    priceEGP: getServiceStartingPrice(service.id, data),
  }));

  return (
    <div className="m4-landing">
      <HeroSection
        query={filters.query}
        categoryId={filters.categoryId}
        categories={data.categories}
        onQueryChange={(query) =>
          setFilters((current) => ({ ...current, query }))
        }
        onCategoryChange={(categoryId) =>
          setFilters((current) => ({ ...current, categoryId }))
        }
        onSearch={(event) => {
          event?.preventDefault();
          resultsRef.current?.focus();
        }}
        inputRef={inputRef}
        disabled={!ready}
        postProjectHref={destinations.postProject}
        projectAnchor={`#${projectId}`}
        serviceAnchor={`#${serviceId}`}
      />
      {howItWorks}
      <p className="m4-landing__result-count" role="status" aria-atomic="true">
        {ready
          ? `${projects.length} ${projects.length === 1 ? "project" : "projects"} and ${services.length} ${services.length === 1 ? "service" : "services"} found. Up to three of each are shown.`
          : discoveryState === "loading"
            ? "Loading opportunities…"
            : "Discovery is unavailable in this preview."}
      </p>
      <div
        id={resultsId}
        className="m4-landing__results"
        ref={resultsRef}
        tabIndex={-1}
        role="region"
        aria-label="Project and service discovery"
        aria-busy={discoveryState === "loading" || undefined}
      >
        {ready ? (
          <>
            <FeaturedOpportunities
              id={projectId}
              kind="project"
              items={projects}
              browseHref={destinations.projects}
              getItemHref={getProjectHref}
              savedIds={savedIds}
              onToggleSaved={toggleSaved}
              onClear={clearFilters}
            />
            <FeaturedOpportunities
              id={serviceId}
              kind="service"
              items={services}
              browseHref={destinations.services}
              getItemHref={getServiceHref}
              onClear={clearFilters}
            />
          </>
        ) : (
          <div className="m4-landing__container m4-landing__state">
            <p>
              {discoveryState === "loading"
                ? "Loading project and service examples."
                : "Try again to load the examples."}
            </p>
            {discoveryState !== "loading" && onRetry && (
              <Button onClick={onRetry}>Try again</Button>
            )}
          </div>
        )}
      </div>
      <p className="m4-landing__save-notice" role="status">
        {saveNotice}
      </p>
      <FeaturedStudents
        students={data.participants.students}
        getStudentHref={getStudentHref}
        browseHref={destinations.freelancers}
      />
      <TrustSection />
    </div>
  );
}
