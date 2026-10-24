import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3, Search, SlidersHorizontal } from "lucide-react";
import { useServiceData } from "./useServiceData.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import ServiceCard from "./ServiceCard.jsx";
import {
  discoverServices,
  EMPTY_SERVICE_FILTERS,
  servicePriceOptions,
} from "./serviceCatalogueModel.js";
import "./services-catalogue.css";

export default function ServicesCatalogue({
  data: suppliedData,
  state = "ready",
  onRetry,
}) {
  const data = useServiceData(suppliedData);
  const [filters, setFilters] = useState({ ...EMPTY_SERVICE_FILTERS });
  const [draft, setDraft] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ready = state === "ready";
  const results = ready ? discoverServices(filters, data) : [];
  const update = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  const reset = () => {
    setFilters({ ...EMPTY_SERVICE_FILTERS });
    setDraft("");
  };
  const active =
    filters.query ||
    filters.categoryId ||
    filters.skillId ||
    filters.price !== "all";
  return (
    <div className="services-catalogue">
      <section className="services-hero" aria-labelledby="services-title">
        <div className="services-container services-hero__layout">
          <div>
            <p className="services-eyebrow">THE SERVICE MARKETPLACE</p>
            <h1 id="services-title">
              Big ideas.
              <br />
              <em>Expertly made.</em>
            </h1>
            <p className="services-hero__intro">
              Find a clear scope, a creative mind, and the right service to
              bring your next idea to life.
            </p>
            <div className="services-hero__points">
              <span>EGP pricing</span>
              <span>Defined packages</span>
              <span>Student talent</span>
            </div>
          </div>
          <div className="services-hero__note">
            <Layers3 size={32} aria-hidden="true" />
            <p className="services-eyebrow">A DIFFERENT WAY TO WORK</p>
            <h2>
              Choose the craft.
              <br />
              Know the scope.
            </h2>
            <p>
              Browse ready-defined services instead of posting a project and
              waiting for proposals.
            </p>
            <Link to="/projects">
              Prefer to post a brief? Explore projects{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="services-container services-content">
        <form
          className="services-search"
          role="search"
          aria-label="Search services"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, query: draft.trim() }));
          }}
        >
          <Search aria-hidden="true" />
          <Input
            label="Discover services"
            placeholder="Search titles or descriptions…"
            value={draft}
            maxLength={160}
            onChange={(event) => setDraft(event.target.value)}
            disabled={!ready}
          />
          <Button type="submit" disabled={!ready}>
            Find services <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </form>
        <p className="services-disclosure">
          Fictional Phase 1 listings. Prices and delivery describe the starting
          package. Open a service to compare packages and configure a simulated
          order. Profiles and payment processing are not connected yet.
        </p>
        <div
          className="services-categories"
          role="group"
          aria-label="Service categories"
        >
          {[{ id: "", label: "All services" }, ...data.categories].map(
            ({ id, label }) => (
              <Button
                key={id}
                variant={filters.categoryId === id ? "primary" : "outline"}
                aria-pressed={filters.categoryId === id}
                disabled={!ready}
                onClick={() =>
                  setFilters((current) => ({ ...current, categoryId: id }))
                }
              >
                {label}
              </Button>
            ),
          )}
        </div>
        <div className="services-workspace">
          <aside
            className="services-refine"
            aria-label="Refine service results"
          >
            <Button
              className="services-refine__toggle"
              variant="outline"
              aria-expanded={filtersOpen}
              aria-controls="service-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={17} aria-hidden="true" /> Refine results
            </Button>
            <div
              id="service-filters"
              className={`services-filters ${filtersOpen ? "services-filters--open" : ""}`}
            >
              <div className="services-filters__heading">
                <h2>Refine your search</h2>
                <Button variant="ghost" onClick={reset}>
                  Reset
                </Button>
              </div>
              <Select
                label="Required skill"
                value={filters.skillId}
                onChange={update("skillId")}
                disabled={!ready}
              >
                <option value="">All skills</option>
                {data.skills.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select
                label="Starting price"
                value={filters.price}
                onChange={update("price")}
                disabled={!ready}
              >
                {servicePriceOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <p className="services-filters__tip">
                A good fit starts with a clear scope. Compare what is included,
                not just the price.
              </p>
            </div>
          </aside>
          <section
            className="services-results"
            aria-labelledby="service-results-title"
          >
            <div className="services-results__heading">
              <div>
                <p className="services-eyebrow">
                  CRAFTED FOR YOUR NEXT CHAPTER
                </p>
                <h2 id="service-results-title">Services to explore</h2>
                {ready && (
                  <p role="status">
                    {results.length}{" "}
                    {results.length === 1 ? "service" : "services"} found
                  </p>
                )}
              </div>
              <Select
                label="Sort services"
                value={filters.sort}
                onChange={update("sort")}
                disabled={!ready}
              >
                <option value="newest">Newest first</option>
                <option value="price_low">Starting price: low to high</option>
                <option value="price_high">Starting price: high to low</option>
                <option value="delivery">
                  Starting package: shortest delivery
                </option>
              </Select>
            </div>
            {ready && active && (
              <div className="services-active">
                <p>
                  Filtered by{" "}
                  {[
                    filters.query && `“${filters.query}”`,
                    data.categories.find(({ id }) => id === filters.categoryId)
                      ?.label,
                    data.skills.find(({ id }) => id === filters.skillId)?.label,
                    filters.price !== "all" &&
                      servicePriceOptions.find(
                        ({ value }) => value === filters.price,
                      )?.label,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <Button variant="ghost" onClick={reset}>
                  Clear filters
                </Button>
              </div>
            )}
            {state === "loading" ? (
              <LoadingState message="Loading service listings…" />
            ) : !ready ? (
              <ErrorState
                title="Services are unavailable"
                description="The catalogue could not be displayed. No order or payment has been created."
                onRetry={onRetry}
              />
            ) : results.length ? (
              <div className="services-grid">
                {results.map(({ service, package: pack }) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    starting={pack}
                    data={data}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  active ? "No matching services" : "No published services yet"
                }
                description={
                  active
                    ? "Try a different keyword, category, skill or starting price."
                    : "Check back for new student services."
                }
                onAction={active ? reset : undefined}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
