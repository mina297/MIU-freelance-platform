import { useId, useRef, useState } from "react";
import Button from "./Button.jsx";
import "./navigation-controls.css";

/** Manual activation: arrow keys move focus; Enter/Space requests selection. */
export default function Tabs({
  items = [],
  value,
  onValueChange,
  label = "Sections",
  disabled = false,
  className = "",
}) {
  const groupId = useId();
  const buttons = useRef(new Map());
  const [focusedId, setFocusedId] = useState(null);

  if (
    !Array.isArray(items) ||
    items.some(
      (item) => !item || typeof item.id !== "string" || !item.id.trim(),
    )
  ) {
    throw new TypeError("Tabs items require nonempty string IDs.");
  }
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new TypeError("Tabs item IDs must be unique.");
  }
  if (items.length === 0) return null;

  const enabledItems = items.filter((item) => !item.disabled);
  const selectedItem = enabledItems.find((item) => item.id === value);
  const focusItem =
    enabledItems.find((item) => item.id === focusedId) ||
    selectedItem ||
    enabledItems[0];
  const unavailable = disabled || typeof onValueChange !== "function";
  const tabId = (id) => `${groupId}-tab-${encodeURIComponent(id)}`;
  const panelId = (id) => `${groupId}-panel-${encodeURIComponent(id)}`;

  function moveFocus(event, id) {
    if (unavailable || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = enabledItems.findIndex((item) => item.id === id);
    if (index < 0) return;
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabledItems.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const direction =
        getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1;
      const delta = (event.key === "ArrowRight" ? 1 : -1) * direction;
      next = (index + delta + enabledItems.length) % enabledItems.length;
    } else return;
    event.preventDefault();
    buttons.current.get(enabledItems[next].id)?.focus();
  }

  return (
    <div className={`miu-tabs ${className}`.trim()}>
      <div
        className="miu-tabs__list"
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        aria-disabled={unavailable || undefined}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocusedId(null);
        }}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            ref={(node) => {
              if (node) buttons.current.set(item.id, node);
              else buttons.current.delete(item.id);
            }}
            variant="ghost"
            className="miu-tabs__tab"
            id={tabId(item.id)}
            role="tab"
            aria-selected={selectedItem?.id === item.id}
            aria-controls={panelId(item.id)}
            disabled={unavailable || item.disabled}
            tabIndex={
              !unavailable && !item.disabled && focusItem?.id === item.id
                ? 0
                : -1
            }
            onFocus={() => setFocusedId(item.id)}
            onKeyDown={(event) => moveFocus(event, item.id)}
            onClick={() => {
              if (item.id !== value) onValueChange(item.id);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="miu-tabs__panel"
          id={panelId(item.id)}
          role="tabpanel"
          aria-labelledby={tabId(item.id)}
          hidden={selectedItem?.id !== item.id}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
