import { useLanguage } from "../../i18n/LanguageContext.js";
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
  const { t, count } = useLanguage();

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
            <p className="services-eyebrow">{t("THE SERVICE MARKETPLACE")}</p>
            <h1 id="services-title">
              {t("Big ideas.")}
              <br />
              <em>{t("Expertly made.")}</em>
            </h1>
            <p className="services-hero__intro">
              {t(
                "Find a clear scope, a creative mind, and the right service to bring your next idea to life.",
              )}
            </p>
            <div className="services-hero__points">
              <span>{t("EGP pricing")}</span>
              <span>{t("Defined packages")}</span>
              <span>{t("Student talent")}</span>
            </div>
          </div>
          <div className="services-hero__note">
            <Layers3 size={32} aria-hidden="true" />
            <p className="services-eyebrow">{t("A DIFFERENT WAY TO WORK")}</p>
            <h2>
              {t("Choose the craft.")}
              <br />
              {t("Know the scope.")}
            </h2>
            <p>
              {t(
                "Browse ready-defined services instead of posting a project and waiting for proposals.",
              )}
            </p>
            <Link to="/projects">
              {t("Prefer to post a brief? Explore projects")}{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="services-container services-content">
        <form
          className="services-search"
          role="search"
          aria-label={t("Search services")}
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, query: draft.trim() }));
          }}
        >
          <Search aria-hidden="true" />
          <Input
            label={t("Discover services")}
            placeholder={t("Search titles or descriptions…")}
            value={draft}
            maxLength={160}
            onChange={(event) => setDraft(event.target.value)}
            disabled={!ready}
          />
          <Button type="submit" disabled={!ready}>
            {t("Find services")} <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </form>
        <p className="services-disclosure">
          {t(
            "Fictional Phase 1 listings. Prices and delivery describe the starting package. Open a service to compare packages and configure a simulated order. Profiles and payment processing are not connected yet.",
          )}
        </p>
        <div
          className="services-categories"
          role="group"
          aria-label={t("Service categories")}
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
                {t(label)}
              </Button>
            ),
          )}
        </div>
        <div className="services-workspace">
          <aside
            className="services-refine"
            aria-label={t("Refine service results")}
          >
            <Button
              className="services-refine__toggle"
              variant="outline"
              aria-expanded={filtersOpen}
              aria-controls="service-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={17} aria-hidden="true" />{" "}
              {t("Refine results")}
            </Button>
            <div
              id="service-filters"
              className={`services-filters ${filtersOpen ? "services-filters--open" : ""}`}
            >
              <div className="services-filters__heading">
                <h2>{t("Refine your search")}</h2>
                <Button variant="ghost" onClick={reset}>
                  {t("Reset")}
                </Button>
              </div>
              <Select
                label={t("Required skill")}
                value={filters.skillId}
                onChange={update("skillId")}
                disabled={!ready}
              >
                <option value="">{t("All skills")}</option>
                {data.skills.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {t(label)}
                  </option>
                ))}
              </Select>
              <Select
                label={t("Starting price")}
                value={filters.price}
                onChange={update("price")}
                disabled={!ready}
              >
                {servicePriceOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {t(label)}
                  </option>
                ))}
              </Select>
              <p className="services-filters__tip">
                {t(
                  "A good fit starts with a clear scope. Compare what is included, not just the price.",
                )}
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
                  {t("CRAFTED FOR YOUR NEXT CHAPTER")}
                </p>
                <h2 id="service-results-title">{t("Services to explore")}</h2>
                {ready && (
                  <p role="status">
                    {count("service", results.length)} {t("found")}
                  </p>
                )}
              </div>
              <Select
                label={t("Sort services")}
                value={filters.sort}
                onChange={update("sort")}
                disabled={!ready}
              >
                <option value="newest">{t("Newest first")}</option>
                <option value="price_low">
                  {t("Starting price: low to high")}
                </option>
                <option value="price_high">
                  {t("Starting price: high to low")}
                </option>
                <option value="delivery">
                  {t("Starting package: shortest delivery")}
                </option>
              </Select>
            </div>
            {ready && active && (
              <div className="services-active">
                <p>
                  {t("Filtered by")}{" "}
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
                  {t("Clear filters")}
                </Button>
              </div>
            )}
            {state === "loading" ? (
              <LoadingState message={t("Loading service listings…")} />
            ) : !ready ? (
              <ErrorState
                title={t("Services are unavailable")}
                description={t(
                  "The catalogue could not be displayed. No order or payment has been created.",
                )}
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
                title={t(
                  active
                    ? t("No matching services")
                    : t("No published services yet"),
                )}
                description={t(
                  active
                    ? t(
                        "Try a different keyword, category, skill or starting price.",
                      )
                    : t("Check back for new student services."),
                )}
                onAction={active ? reset : undefined}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
