import { useMemo, useState } from "react";
import {
  helpArticles,
  helpCategories,
  searchHelpContent,
} from "../../data/fixtures/help.js";
import FaqAccordion from "./components/FaqAccordion.jsx";

/**
 * Help Center with search, FAQ accordion, and article links.
 * Expected route: `/help`
 *
 * @param {{
 *   onOpenArticle?: (slug: string) => void,
 *   onContactSupport?: () => void,
 * }} props
 */
export default function HelpCenterPage({ onOpenArticle, onContactSupport }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const results = useMemo(() => searchHelpContent(query), [query]);

  const articles = useMemo(() => {
    if (activeCategory === "all") return results.articles;
    return results.articles.filter((a) => a.categoryId === activeCategory);
  }, [results.articles, activeCategory]);

  const faqs = useMemo(() => {
    if (activeCategory === "all") return results.faqs;
    return results.faqs.filter((f) => f.categoryId === activeCategory);
  }, [results.faqs, activeCategory]);

  return (
    <div className="w-full bg-surface-page">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        <header className="premium-help-header space-y-3">
          <h1 className="text-3xl font-bold text-miu-black">Help Center</h1>
          <p className="max-w-2xl text-[15px] text-ink-secondary">
            Guides and FAQs for profiles, reviews, and campus support. Phase 1
            content is fictional and for demonstration.
          </p>
          <label className="block">
            <span className="sr-only">Search help articles</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles and FAQs…"
              className="h-12 w-full rounded-full border border-border-soft bg-white px-5 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            />
          </label>
        </header>

        <div className="flex flex-wrap gap-2">
          <CategoryChip
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="All"
          />
          {helpCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              label={cat.label}
            />
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-miu-black">Articles</h2>
            <button
              type="button"
              onClick={
                onContactSupport ??
                (() =>
                  window.alert(
                    "Open /support/contact — wire this callback from the preview or Member 1 router.",
                  ))
              }
              className="text-sm font-semibold text-miu-red"
            >
              Contact support
            </button>
          </div>

          {articles.length === 0 ? (
            <p className="rounded-panel border border-dashed border-border-soft bg-white p-6 text-sm text-ink-secondary">
              No articles match “{query}”.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {articles.map((article) => (
                <li key={article.slug}>
                  <button
                    type="button"
                    onClick={() => onOpenArticle?.(article.slug)}
                    className="flex h-full w-full flex-col rounded-panel border border-border-soft bg-white p-5 text-left shadow-[var(--shadow-panel)] hover:border-miu-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  >
                    <h3 className="text-base font-semibold text-miu-black">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-ink-secondary">
                      {article.summary}
                    </p>
                    <span className="mt-3 text-sm font-semibold text-miu-red">
                      Read article →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-miu-black">FAQs</h2>
          <FaqAccordion items={faqs} />
        </section>

        {!helpArticles.length ? null : (
          <p className="text-xs text-ink-secondary">
            {`Showing ${articles.length} article${articles.length === 1 ? "" : "s"} and ${faqs.length} FAQ${faqs.length === 1 ? "" : "s"}${query ? ` for “${query}”` : ""}.`}
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        active
          ? "bg-miu-red text-white"
          : "bg-white text-ink-secondary ring-1 ring-[#e5e7eb] hover:text-miu-black"
      }`}
    >
      {label}
    </button>
  );
}
