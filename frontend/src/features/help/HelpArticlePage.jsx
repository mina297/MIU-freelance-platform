import {
  getHelpArticleBySlug,
  helpCategories,
} from "../../data/fixtures/help.js";

/**
 * Help article detail.
 * Expected route: `/help/:articleSlug`
 *
 * @param {{
 *   articleSlug: string,
 *   onBack?: () => void,
 *   onContactSupport?: () => void,
 * }} props
 */
export default function HelpArticlePage({
  articleSlug,
  onBack,
  onContactSupport,
}) {
  const article = getHelpArticleBySlug(articleSlug);

  if (!article) {
    return (
      <div className="w-full bg-surface-page px-5 py-8 md:px-[120px]">
        <div
          className="rounded-panel border border-border-soft bg-white p-8 text-center"
          role="alert"
        >
          <h1 className="text-xl font-semibold text-miu-black">
            Article not found
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            No help article matches{" "}
            <span className="font-medium">{articleSlug}</span>.
          </p>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mt-4 text-sm font-semibold text-miu-red"
            >
              ← Back to Help Center
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const category = helpCategories.find((c) => c.id === article.categoryId);

  return (
    <div className="w-full bg-surface-page">
      <article className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-miu-red"
          >
            ← Back to Help Center
          </button>
        ) : null}

        <header className="space-y-2">
          {category ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
              {category.label}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold text-miu-black">{article.title}</h1>
          <p className="text-[15px] text-ink-secondary">{article.summary}</p>
        </header>

        <div className="space-y-4 rounded-panel border border-border-soft bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6">
          {article.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-[15px] leading-relaxed text-ink-secondary"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {article.tags?.length ? (
          <ul className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-miu-black"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="rounded-lg bg-miu-red-tint px-4 py-3 text-sm text-miu-black">
          Still need help?{" "}
          <button
            type="button"
            className="font-semibold text-miu-red underline-offset-2 hover:underline"
            onClick={
              onContactSupport ??
              (() =>
                window.alert(
                  "Open /support/contact from the Member 5 preview or Member 1 router.",
                ))
            }
          >
            Contact support
          </button>
        </div>
      </article>
    </div>
  );
}
