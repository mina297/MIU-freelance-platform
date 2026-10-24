import { useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { mergeProjects, projectStore } from "../projects/projectStore.js";
import { useServiceData } from "../services/useServiceData.js";
import Button from "../../components/ui/Button.jsx";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Card from "../../components/ui/Card.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import {
  emptyPreferences,
  recommendMarketplace,
} from "./recommendationModel.js";
import "../services/services-catalogue.css";
import "./recommendations.css";

export function RecommendationCard({ item }) {
  const [feedback, setFeedback] = useState("");
  return (
    <Card as="article" className="recommendation-card">
      <p className="services-eyebrow">SIMULATED SKILLS MATCH</p>
      <h3>{item.title}</h3>
      {item.serviceTitle && (
        <p className="recommendation-card__service">
          Through: {item.serviceTitle}
        </p>
      )}
      <p>{item.description}</p>
      <div className="recommendation-card__reason">
        <h4>Why this appears</h4>
        <ul>
          {item.selectedSkillCount > 0 && (
            <li>
              {item.matchedSkills.length} of {item.selectedSkillCount} selected
              skills overlap:{" "}
              {item.matchedSkills.map(({ label }) => label).join(", ")}.
            </li>
          )}
          {item.categoryLabel && (
            <li>Matches your selected category: {item.categoryLabel}.</li>
          )}
        </ul>
        {item.selectedSkillCount > item.matchedSkills.length && (
          <p>Some selected skills do not appear in this listing.</p>
        )}
      </div>
      <dl>
        <dt>{item.priceLabel}</dt>
        <dd>
          {item.priceEGP === null
            ? "Price unavailable"
            : formatEGP(item.priceEGP)}
        </dd>
      </dl>
      <Link className="recommendation-card__link" to={item.href}>
        {item.serviceTitle ? "Explore matched service" : "Explore opportunity"}{" "}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      <div
        className="recommendation-card__feedback"
        role="group"
        aria-label={`Feedback for ${item.title}`}
      >
        <Button
          variant="outline"
          aria-pressed={feedback === "helpful"}
          onClick={() => setFeedback(feedback === "helpful" ? "" : "helpful")}
        >
          Helpful
        </Button>
        <Button
          variant="outline"
          aria-pressed={feedback === "not relevant"}
          onClick={() =>
            setFeedback(feedback === "not relevant" ? "" : "not relevant")
          }
        >
          Not relevant
        </Button>
      </div>
      <p className="recommendation-card__feedback-note" role="status">
        {feedback
          ? `Marked ${feedback} for this preview only. Feedback is not sent or used to train a model.`
          : "Feedback stays in this preview and resets when results change or you leave."}
      </p>
    </Card>
  );
}

export default function Recommendations({
  data: suppliedData,
  state = "ready",
  onRetry,
}) {
  const serviceData = useServiceData();
  const changedProjects = useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const data = suppliedData ?? {
    ...serviceData,
    projects: mergeProjects(marketplaceData.projects, changedProjects),
  };
  const [preferences, setPreferences] = useState({
    ...emptyPreferences,
    skillIds: [],
  });
  const ready = state === "ready";
  const hasPreferences = Boolean(
    preferences.categoryId || preferences.skillIds.length,
  );
  const results = ready ? recommendMarketplace(preferences, data) : [];
  const signature = JSON.stringify(preferences);
  const reset = () => setPreferences({ ...emptyPreferences, skillIds: [] });
  return (
    <div className="services-catalogue recommendations-page">
      <section
        className="services-hero"
        aria-labelledby="recommendations-title"
      >
        <div className="services-container services-hero__layout">
          <div>
            <p className="services-eyebrow">
              A LITTLE DIRECTION. MORE POSSIBILITY.
            </p>
            <h1 id="recommendations-title">
              Find your fit.
              <br />
              <em>See the reason.</em>
            </h1>
            <p className="services-hero__intro">
              Turn the skills you choose into a starting point for your next
              project or collaboration.
            </p>
            <div className="services-hero__points">
              <span>Your choices</span>
              <span>Visible reasons</span>
              <span>Clear next steps</span>
            </div>
          </div>
          <div className="services-hero__note">
            <Sparkles size={34} aria-hidden="true" />
            <p className="services-eyebrow">AI MATCHING · PHASE 1 SIMULATION</p>
            <h2>
              A suggestion.
              <br />
              You make the decision.
            </h2>
            <p>
              This local demonstration counts matching skill tags. It does not
              run an AI model, assess qualifications or decide who can work.
            </p>
            <Link to="/freelancers">
              Browse providers freely{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="services-container recommendations-content">
        <div className="recommendations-layout">
          <section
            className="recommendations-preferences"
            aria-labelledby="preferences-title"
          >
            <p className="services-eyebrow">START WITH WHAT MATTERS</p>
            <h2 id="preferences-title">Your matching choices</h2>
            <Select
              label="I want suggestions for"
              value={preferences.kind}
              disabled={!ready}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  kind: event.target.value,
                }))
              }
            >
              <option value="projects">Projects to work on</option>
              <option value="services">Services to buy</option>
              <option value="freelancers">Student service providers</option>
            </Select>
            <Select
              label="Preferred category"
              value={preferences.categoryId}
              disabled={!ready}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  categoryId: event.target.value,
                }))
              }
            >
              <option value="">Any category</option>
              {data.categories.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </Select>
            <fieldset disabled={!ready}>
              <legend>Skills to match</legend>
              <p>Select one or more, or choose a category.</p>
              {data.skills.map(({ id, label }) => (
                <Checkbox
                  key={id}
                  label={label}
                  checked={preferences.skillIds.includes(id)}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      skillIds: event.target.checked
                        ? [...current.skillIds, id]
                        : current.skillIds.filter((skill) => skill !== id),
                    }))
                  }
                />
              ))}
            </fieldset>
            <Button variant="outline" onClick={reset} disabled={!ready}>
              Reset choices
            </Button>
            <p className="recommendations-disclosure">
              Choices stay on this page. We do not read your private profile,
              identity evidence, messages or order history.
            </p>
          </section>
          <section
            className="recommendations-results"
            aria-labelledby="suggestions-title"
          >
            <p className="services-eyebrow">EXPLAINED, EVERY TIME</p>
            <h2 id="suggestions-title">Your suggested next steps</h2>
            <p className="recommendations-method">
              Simulated matching: category restricts results; at least one
              selected skill must overlap. More shared selected skills appear
              first, then names alphabetically. A provider is matched through
              one published service. Prices do not affect ranking. This is not a
              quality rating or a prediction of success.
            </p>
            {ready && hasPreferences && (
              <p className="recommendations-count" role="status">
                {results.length}{" "}
                {results.length === 1 ? "suggestion" : "suggestions"} based on
                your choices
              </p>
            )}
            {state === "loading" ? (
              <LoadingState message="Loading simulated suggestions…" />
            ) : !ready ? (
              <ErrorState
                title="Suggestions are unavailable"
                description="Your account and orders have not changed. Browse the catalogues or try again when available."
                onRetry={onRetry}
              />
            ) : !hasPreferences ? (
              <EmptyState
                title="Choose a starting point"
                description="Select a skill or category to see explained suggestions. No personal preferences are assumed."
              />
            ) : results.length ? (
              <div className="recommendations-grid">
                {results.map((item) => (
                  <RecommendationCard
                    key={`${signature}:${JSON.stringify(item)}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching suggestions"
                description="Try another skill or category. Only open projects and published services are considered."
                onAction={reset}
                actionLabel="Reset choices"
              />
            )}
            <nav
              className="recommendations-browse"
              aria-label="Browse without matching"
            >
              <Link to="/projects">All projects</Link>
              <Link to="/services">All services</Link>
              <Link to="/freelancers">All providers</Link>
            </nav>
            <p className="recommendations-disclosure">
              Fictional Phase 1 data. No automatic selection, application,
              booking or payment. Review the listing and decide for yourself.
              For provider concerns, browse the original service; profile and
              support integration remains pending.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
