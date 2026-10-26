import { useLanguage } from "../../i18n/LanguageContext.js";
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
  const { t, locale } = useLanguage();

  const [feedback, setFeedback] = useState("");
  return (
    <Card as="article" className="recommendation-card">
      <p className="services-eyebrow">{t("SIMULATED SKILLS MATCH")}</p>
      <h3>{item.title}</h3>
      {item.serviceTitle && (
        <p className="recommendation-card__service">
          {t("Through:")} {item.serviceTitle}
        </p>
      )}
      <p>{item.description}</p>
      <div className="recommendation-card__reason">
        <h4>{t("Why this appears")}</h4>
        <ul>
          {item.selectedSkillCount > 0 && (
            <li>
              {item.matchedSkills.length} {t("of")} {item.selectedSkillCount}{" "}
              {t("selected skills overlap:")}{" "}
              {item.matchedSkills.map(({ label }) => label).join(", ")}.
            </li>
          )}
          {item.categoryLabel && (
            <li>
              {t("Matches your selected category:")} {item.categoryLabel}.
            </li>
          )}
        </ul>
        {item.selectedSkillCount > item.matchedSkills.length && (
          <p>{t("Some selected skills do not appear in this listing.")}</p>
        )}
      </div>
      <dl>
        <dt>{item.priceLabel}</dt>
        <dd>
          {item.priceEGP === null
            ? t("Price unavailable")
            : formatEGP(item.priceEGP, locale)}
        </dd>
      </dl>
      <Link className="recommendation-card__link" to={item.href}>
        {item.serviceTitle
          ? t("Explore matched service")
          : t("Explore opportunity")}{" "}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      <div
        className="recommendation-card__feedback"
        role="group"
        aria-label={t("Feedback for {value0}", { value0: item.title })}
      >
        <Button
          variant="outline"
          aria-pressed={feedback === "helpful"}
          onClick={() => setFeedback(feedback === "helpful" ? "" : "helpful")}
        >
          {t("Helpful")}
        </Button>
        <Button
          variant="outline"
          aria-pressed={feedback === "not relevant"}
          onClick={() =>
            setFeedback(feedback === "not relevant" ? "" : "not relevant")
          }
        >
          {t("Not relevant")}
        </Button>
      </div>
      <p className="recommendation-card__feedback-note" role="status">
        {feedback
          ? `Marked ${feedback} for this preview only. Feedback is not sent or used to train a model.`
          : t(
              "Feedback stays in this preview and resets when results change or you leave.",
            )}
      </p>
    </Card>
  );
}

export default function Recommendations({
  data: suppliedData,
  state = "ready",
  onRetry,
}) {
  const { t } = useLanguage();

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
              {t("A LITTLE DIRECTION. MORE POSSIBILITY.")}
            </p>
            <h1 id="recommendations-title">
              {t("Find your fit.")}
              <br />
              <em>{t("See the reason.")}</em>
            </h1>
            <p className="services-hero__intro">
              {t(
                "Turn the skills you choose into a starting point for your next project or collaboration.",
              )}
            </p>
            <div className="services-hero__points">
              <span>{t("Your choices")}</span>
              <span>{t("Visible reasons")}</span>
              <span>{t("Clear next steps")}</span>
            </div>
          </div>
          <div className="services-hero__note">
            <Sparkles size={34} aria-hidden="true" />
            <p className="services-eyebrow">
              {t("AI MATCHING · PHASE 1 SIMULATION")}
            </p>
            <h2>
              {t("A suggestion.")}
              <br />
              {t("You make the decision.")}
            </h2>
            <p>
              {t(
                "This local demonstration counts matching skill tags. It does not run an AI model, assess qualifications or decide who can work.",
              )}
            </p>
            <Link to="/freelancers">
              {t("Browse providers freely")}{" "}
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
            <p className="services-eyebrow">{t("START WITH WHAT MATTERS")}</p>
            <h2 id="preferences-title">{t("Your matching choices")}</h2>
            <Select
              label={t("I want suggestions for")}
              value={preferences.kind}
              disabled={!ready}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  kind: event.target.value,
                }))
              }
            >
              <option value="projects">{t("Projects to work on")}</option>
              <option value="services">{t("Services to buy")}</option>
              <option value="freelancers">
                {t("Student service providers")}
              </option>
            </Select>
            <Select
              label={t("Preferred category")}
              value={preferences.categoryId}
              disabled={!ready}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  categoryId: event.target.value,
                }))
              }
            >
              <option value="">{t("Any category")}</option>
              {data.categories.map(({ id, label }) => (
                <option key={id} value={id}>
                  {t(label)}
                </option>
              ))}
            </Select>
            <fieldset disabled={!ready}>
              <legend>{t("Skills to match")}</legend>
              <p>{t("Select one or more, or choose a category.")}</p>
              {data.skills.map(({ id, label }) => (
                <Checkbox
                  key={id}
                  label={t(label)}
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
              {t("Reset choices")}
            </Button>
            <p className="recommendations-disclosure">
              {t(
                "Choices stay on this page. We do not read your private profile, identity evidence, messages or order history.",
              )}
            </p>
          </section>
          <section
            className="recommendations-results"
            aria-labelledby="suggestions-title"
          >
            <p className="services-eyebrow">{t("EXPLAINED, EVERY TIME")}</p>
            <h2 id="suggestions-title">{t("Your suggested next steps")}</h2>
            <p className="recommendations-method">
              {t(
                "Simulated matching: category restricts results; at least one selected skill must overlap. More shared selected skills appear first, then names alphabetically. A provider is matched through one published service. Prices do not affect ranking. This is not a quality rating or a prediction of success.",
              )}
            </p>
            {ready && hasPreferences && (
              <p className="recommendations-count" role="status">
                {results.length}{" "}
                {results.length === 1 ? t("suggestion") : t("suggestions")}{" "}
                {t("based on your choices")}
              </p>
            )}
            {state === "loading" ? (
              <LoadingState message={t("Loading simulated suggestions…")} />
            ) : !ready ? (
              <ErrorState
                title={t("Suggestions are unavailable")}
                description={t(
                  "Your account and orders have not changed. Browse the catalogues or try again when available.",
                )}
                onRetry={onRetry}
              />
            ) : !hasPreferences ? (
              <EmptyState
                title={t("Choose a starting point")}
                description={t(
                  "Select a skill or category to see explained suggestions. No personal preferences are assumed.",
                )}
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
                title={t("No matching suggestions")}
                description={t(
                  "Try another skill or category. Only open projects and published services are considered.",
                )}
                onAction={reset}
                actionLabel="Reset choices"
              />
            )}
            <nav
              className="recommendations-browse"
              aria-label={t("Browse without matching")}
            >
              <Link to="/projects">{t("All projects")}</Link>
              <Link to="/services">{t("All services")}</Link>
              <Link to="/freelancers">{t("All providers")}</Link>
            </nav>
            <p className="recommendations-disclosure">
              {t(
                "Fictional Phase 1 data. No automatic selection, application, booking or payment. Review the listing and decide for yourself. For provider concerns, browse the original service; profile and support integration remains pending.",
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
