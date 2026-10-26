import { useLanguage } from "../../i18n/LanguageContext.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search, UsersRound } from "lucide-react";
import { useServiceData } from "../services/useServiceData.js";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import FreelancerCard from "./FreelancerCard.jsx";
import {
  discoverFreelancers,
  emptyFreelancerFilters,
  freelancerPriceOptions,
} from "./freelancerModel.js";
import "../services/services-catalogue.css";
import "./freelancers.css";

export default function FreelancersCatalogue({
  data: suppliedData,
  state = "ready",
  onRetry,
}) {
  const { t } = useLanguage();

  const data = useServiceData(suppliedData);
  const [filters, setFilters] = useState({ ...emptyFreelancerFilters });
  const [draft, setDraft] = useState("");
  const ready = state === "ready";
  const results = ready ? discoverFreelancers(filters, data) : [];
  const update = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  const reset = () => {
    setFilters({ ...emptyFreelancerFilters });
    setDraft("");
  };
  const active =
    filters.query ||
    filters.categoryId ||
    filters.skillId ||
    filters.price !== "all";
  return (
    <div className="services-catalogue freelancers-catalogue">
      <section className="services-hero" aria-labelledby="freelancer-title">
        <div className="services-container services-hero__layout">
          <div>
            <p className="services-eyebrow">
              {t("THE PEOPLE BEHIND THE POSSIBILITIES")}
            </p>
            <h1 id="freelancer-title">
              {t("Find the craft.")}
              <br />
              <em>{t("Meet the talent.")}</em>
            </h1>
            <p className="services-hero__intro">
              {t(
                "Explore student service providers through the work they offer. Start with a skill, find a clear scope, and discover your next collaboration.",
              )}
            </p>
            <div className="services-hero__points">
              <span>{t("Published services")}</span>
              <span>{t("Clear EGP pricing")}</span>
              <span>{t("Skills-led discovery")}</span>
            </div>
          </div>
          <div className="services-hero__note">
            <UsersRound size={34} aria-hidden="true" />
            <p className="services-eyebrow">{t("LET THE OFFER SPEAK")}</p>
            <h2>
              {t("A skill is a start.")}
              <br />
              {t("A clear scope is next.")}
            </h2>
            <p>
              {t(
                "This directory shows fictional providers with published services. Compare what they offer without assuming ratings or availability.",
              )}
            </p>
            <Link to="/services">
              {t("Browse all services")}{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="services-container services-content">
        <form
          className="services-search"
          role="search"
          aria-label={t("Search freelancers")}
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, query: draft.trim() }));
          }}
        >
          <Search aria-hidden="true" />
          <Input
            label={t("Find student service providers")}
            placeholder={t("Search a name, skill or published service…")}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={160}
            disabled={!ready}
          />
          <Button type="submit" disabled={!ready}>
            {t("Find talent")} <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </form>
        <p className="services-disclosure">
          {t(
            "Fictional Phase 1 discovery based only on published services. Skills are service tags, not verified qualifications. Prices are package starting prices, not hourly rates. Linked profile details are fictional declarations and do not certify qualifications or availability.",
          )}
        </p>
        <section
          className="freelancers-filters"
          aria-label={t("Refine freelancer discovery")}
        >
          <Select
            label={t("Service category")}
            value={filters.categoryId}
            onChange={update("categoryId")}
            disabled={!ready}
          >
            <option value="">{t("All categories")}</option>
            {data.categories.map(({ id, label }) => (
              <option key={id} value={id}>
                {t(label)}
              </option>
            ))}
          </Select>
          <Select
            label={t("Published service skill")}
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
            label={t("Service starting price")}
            value={filters.price}
            onChange={update("price")}
            disabled={!ready}
          >
            {freelancerPriceOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </Select>
          <Button variant="outline" onClick={reset} disabled={!ready}>
            {t("Reset filters")}
          </Button>
        </section>
        <section aria-labelledby="freelancer-results-title">
          <div className="services-results__heading">
            <div>
              <p className="services-eyebrow">
                {t("GOOD WORK STARTS WITH A GOOD FIT")}
              </p>
              <h2 id="freelancer-results-title">
                {t("Freelancers to explore")}
              </h2>
              {ready && (
                <p role="status">
                  {results.length}{" "}
                  {results.length === 1 ? t("provider") : t("providers")}{" "}
                  {t("found")}
                </p>
              )}
            </div>
            <Select
              label={t("Sort providers")}
              value={filters.sort}
              onChange={update("sort")}
              disabled={!ready}
            >
              <option value="name">{t("Name: A to Z")}</option>
              <option value="name_desc">{t("Name: Z to A")}</option>
              <option value="price_low">
                {t("Service starting price: low to high")}
              </option>
              <option value="services">
                {t("Most matching published services")}
              </option>
            </Select>
          </div>
          {active && ready && (
            <div className="services-active">
              <p>
                {t(
                  "Showing services matching your search and filters. All filters apply to the same published service.",
                )}
              </p>
              <Button variant="ghost" onClick={reset}>
                {t("Clear filters")}
              </Button>
            </div>
          )}
          {state === "loading" ? (
            <LoadingState message={t("Loading student service providers…")} />
          ) : !ready ? (
            <ErrorState
              title={t("Freelancer discovery is unavailable")}
              description={t(
                "Provider information could not be displayed. No account or order was changed.",
              )}
              onRetry={onRetry}
            />
          ) : results.length ? (
            <div className="freelancers-grid">
              {results.map((person) => (
                <FreelancerCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t(
                active
                  ? t("No matching providers")
                  : t("No published service providers yet"),
              )}
              description={t(
                active
                  ? t(
                      "Try another name, service category, skill or package starting price.",
                    )
                  : t(
                      "Providers will appear when their services are published.",
                    ),
              )}
              onAction={active ? reset : undefined}
            />
          )}
        </section>
        <p className="freelancers-catalogue__footer-note">
          {t(
            "Alphabetical and service-count sorts are browsing tools, not reputation rankings or AI recommendations.",
          )}
        </p>
      </div>
    </div>
  );
}
