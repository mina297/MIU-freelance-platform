import { PROFILE_TABS } from "../constants.js";

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
  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="flex w-full items-center gap-6 overflow-x-auto border-b border-[#e5e7eb] md:gap-8"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isImplemented = tab.implemented !== false;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`profile-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`profile-panel-${tab.id}`}
            aria-disabled={!isImplemented}
            disabled={!isImplemented}
            tabIndex={isActive ? 0 : -1}
            title={
              isImplemented
                ? tab.label
                : `${tab.label} will be available in a later Stage`
            }
            className={
              isActive
                ? "h-9 shrink-0 rounded-full border-[3px] border-miu-red px-1 text-[15px] font-semibold text-miu-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                : "h-[52px] shrink-0 px-1 text-[15px] font-medium text-[#4b5563] hover:text-miu-black disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            }
            onClick={() => {
              if (isImplemented) onTabSelect?.(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
