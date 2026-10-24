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
              THE PEOPLE BEHIND THE POSSIBILITIES
            </p>
            <h1 id="freelancer-title">
              Find the craft.
              <br />
              <em>Meet the talent.</em>
            </h1>
            <p className="services-hero__intro">
              Explore student service providers through the work they offer.
              Start with a skill, find a clear scope, and discover your next
              collaboration.
            </p>
            <div className="services-hero__points">
              <span>Published services</span>
              <span>Clear EGP pricing</span>
              <span>Skills-led discovery</span>
            </div>
          </div>
          <div className="services-hero__note">
            <UsersRound size={34} aria-hidden="true" />
            <p className="services-eyebrow">LET THE OFFER SPEAK</p>
            <h2>
              A skill is a start.
              <br />A clear scope is next.
            </h2>
            <p>
              This directory shows fictional providers with published services.
              Compare what they offer without assuming ratings or availability.
            </p>
            <Link to="/services">
              Browse all services <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="services-container services-content">
        <form
          className="services-search"
          role="search"
          aria-label="Search freelancers"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, query: draft.trim() }));
          }}
        >
          <Search aria-hidden="true" />
          <Input
            label="Find student service providers"
            placeholder="Search a name, skill or published service…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={160}
            disabled={!ready}
          />
          <Button type="submit" disabled={!ready}>
            Find talent <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </form>
        <p className="services-disclosure">
          Fictional Phase 1 discovery based only on published services. Skills
          are service tags, not verified qualifications. Prices are package
          starting prices, not hourly rates. Linked profile details are
          fictional declarations and do not certify qualifications or
          availability.
        </p>
        <section
          className="freelancers-filters"
          aria-label="Refine freelancer discovery"
        >
          <Select
            label="Service category"
            value={filters.categoryId}
            onChange={update("categoryId")}
            disabled={!ready}
          >
            <option value="">All categories</option>
            {data.categories.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            label="Published service skill"
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
            label="Service starting price"
            value={filters.price}
            onChange={update("price")}
            disabled={!ready}
          >
            {freelancerPriceOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Button variant="outline" onClick={reset} disabled={!ready}>
            Reset filters
          </Button>
        </section>
        <section aria-labelledby="freelancer-results-title">
          <div className="services-results__heading">
            <div>
              <p className="services-eyebrow">
                GOOD WORK STARTS WITH A GOOD FIT
              </p>
              <h2 id="freelancer-results-title">Freelancers to explore</h2>
              {ready && (
                <p role="status">
                  {results.length}{" "}
                  {results.length === 1 ? "provider" : "providers"} found
                </p>
              )}
            </div>
            <Select
              label="Sort providers"
              value={filters.sort}
              onChange={update("sort")}
              disabled={!ready}
            >
              <option value="name">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="price_low">
                Service starting price: low to high
              </option>
              <option value="services">Most matching published services</option>
            </Select>
          </div>
          {active && ready && (
            <div className="services-active">
              <p>
                Showing services matching your search and filters. All filters
                apply to the same published service.
              </p>
              <Button variant="ghost" onClick={reset}>
                Clear filters
              </Button>
            </div>
          )}
          {state === "loading" ? (
            <LoadingState message="Loading student service providers…" />
          ) : !ready ? (
            <ErrorState
              title="Freelancer discovery is unavailable"
              description="Provider information could not be displayed. No account or order was changed."
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
              title={
                active
                  ? "No matching providers"
                  : "No published service providers yet"
              }
              description={
                active
                  ? "Try another name, service category, skill or package starting price."
                  : "Providers will appear when their services are published."
              }
              onAction={active ? reset : undefined}
            />
          )}
        </section>
        <p className="freelancers-catalogue__footer-note">
          Alphabetical and service-count sorts are browsing tools, not
          reputation rankings or AI recommendations.
        </p>
      </div>
    </div>
  );
}
