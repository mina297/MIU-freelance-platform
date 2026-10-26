import { useLanguage } from "../../../i18n/LanguageContext.js";
import { ArrowUpRight, Code2, Globe, Link2 } from "lucide-react";
import { resolveExternalLink } from "../utils/safeExternalUrl.js";

/** Lucide no longer ships brand icons; use generic glyphs that match link type. */
const LINK_ICONS = {
  github: Code2,
  linkedin: Link2,
  portfolio: Globe,
  website: Globe,
};

/**
 * External profile links card.
 * Safe http(s) links open in a new tab; demo-only / invalid URLs stay non-navigable.
 *
 * @param {{
 *   links: { id: string, type: string, label: string, urlDisplay: string, href?: string }[],
 * }} props
 */
export default function LinksCard({ links = [] }) {
  const { t } = useLanguage();

  return (
    <section
      className="flex w-full flex-col gap-5 overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-6 shadow-[var(--shadow-panel)] sm:p-8"
      aria-labelledby="links-heading"
    >
      <h2
        id="links-heading"
        className="text-lg font-semibold leading-normal text-miu-black"
      >
        {t("Links")}
      </h2>

      {links.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {t("No public links added yet.")}
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {links.map((link) => {
            const Icon = LINK_ICONS[link.type] ?? Globe;
            const resolved = resolveExternalLink(link.href || link.urlDisplay);
            const rowClass =
              "flex w-full items-center gap-3 rounded-lg text-start transition hover:bg-surface-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red";

            const content = (
              <>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-page">
                  <Icon className="size-5 text-miu-black" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-miu-black">
                    {t(link.label)}
                  </p>
                  <p className="truncate text-[13px] text-[var(--theme-accent,var(--color-miu-red))]">
                    {resolved.display || link.urlDisplay}
                  </p>
                  {resolved.isDemoOnly ? (
                    <p className="mt-0.5 text-[11px] text-ink-secondary">
                      {t("Demo example · not a live external link")}
                    </p>
                  ) : null}
                  {!resolved.isSafe &&
                  !resolved.isDemoOnly &&
                  resolved.display ? (
                    <p className="mt-0.5 text-[11px] text-ink-secondary">
                      {t("Incomplete URL · open disabled")}
                    </p>
                  ) : null}
                </div>
                <ArrowUpRight
                  className={`size-4 shrink-0 ${resolved.isSafe ? "text-[var(--theme-accent,var(--color-miu-red))]" : "text-[#d1d5db]"}`}
                  aria-hidden="true"
                />
              </>
            );

            return (
              <li key={link.id}>
                {resolved.isSafe ? (
                  <a
                    className={rowClass}
                    href={resolved.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    className={`${rowClass} cursor-default`}
                    aria-disabled="true"
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
