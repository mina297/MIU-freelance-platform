import { useLanguage } from "../../../i18n/LanguageContext.js";
import { PROFILE_TABS } from "../constants.js";
import { useRef } from "react";

/**
 * Interactive profile section tabs.
 *
 * @param {{
 *   activeTabId?: string,
 *   tabs?: typeof PROFILE_TABS,
 *   onTabSelect?: (tabId: string) => void,
 * }} props
 */
export default function ProfileTabs({
  activeTabId = "about",
  tabs = PROFILE_TABS,
  onTabSelect,
}) {
  const { t } = useLanguage();

  const buttons = useRef(new Map());
  function moveFocus(event, id) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const enabled = tabs.filter((tab) => tab.implemented !== false);
    const index = enabled.findIndex((tab) => tab.id === id);
    let target;
    if (event.key === "Home") target = 0;
    else if (event.key === "End") target = enabled.length - 1;
    else if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
      const direction =
        getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1;
      target =
        (index +
          (event.key === "ArrowRight" ? direction : -direction) +
          enabled.length) %
        enabled.length;
    } else return;
    event.preventDefault();
    buttons.current.get(enabled[target].id)?.focus();
    onTabSelect?.(enabled[target].id);
  }
  return (
    <div
      role="tablist"
      aria-label={t("Profile sections")}
      className="flex w-full items-center gap-6 overflow-x-auto border-b border-border-soft md:gap-8"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isImplemented = tab.implemented !== false;

        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) buttons.current.set(tab.id, node);
              else buttons.current.delete(tab.id);
            }}
            onKeyDown={(event) => moveFocus(event, tab.id)}
            type="button"
            role="tab"
            id={`profile-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`profile-panel-${tab.id}`}
            aria-disabled={!isImplemented}
            disabled={!isImplemented}
            tabIndex={isActive ? 0 : -1}
            title={t(
              isImplemented
                ? tab.label
                : `${tab.label} will be available in a later Stage`,
            )}
            className={
              isActive
                ? "h-9 shrink-0 rounded-full border-[3px] border-miu-red px-1 text-[15px] font-semibold text-[var(--theme-accent,var(--color-miu-red))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                : "h-[52px] shrink-0 px-1 text-[15px] font-medium text-ink-secondary hover:text-miu-black disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            }
            onClick={() => {
              if (isImplemented) onTabSelect?.(tab.id);
            }}
          >
            {t(tab.label)}
          </button>
        );
      })}
    </div>
  );
}
