import { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";
import closeIcon from "../../assets/figma/modal-close.svg";
import "./modal.css";

// Multiple dialogs share one lock so closing one cannot unlock another's page.
const scrollLocks = new WeakMap();

function lockScroll(body) {
  let lock = scrollLocks.get(body);
  if (!lock) {
    lock = {
      count: 0,
      value: body.style.getPropertyValue("overflow"),
      priority: body.style.getPropertyPriority("overflow"),
    };
    scrollLocks.set(body, lock);
    body.style.setProperty("overflow", "hidden");
  }
  lock.count += 1;
  return () => {
    lock.count -= 1;
    if (lock.count === 0) {
      if (lock.value)
        body.style.setProperty("overflow", lock.value, lock.priority);
      else body.style.removeProperty("overflow");
      scrollLocks.delete(body);
    }
  };
}

function isAvailable(element) {
  return (
    element.isConnected &&
    !element.matches(":disabled") &&
    !element.closest("[inert]") &&
    element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility !== "hidden"
  );
}

function tabStops(dialog) {
  const elements = [
    ...dialog.querySelectorAll(
      'button, input, select, textarea, a[href], area[href], summary, [tabindex], [contenteditable="true"]',
    ),
  ].filter((element) => element.tabIndex >= 0 && isAvailable(element));

  // A named radio group contributes only its checked (or first) enabled radio.
  return elements.filter((element) => {
    if (!element.matches('input[type="radio"]') || !element.name) return true;
    const group = elements.filter(
      (other) =>
        other.matches('input[type="radio"]') &&
        other.name === element.name &&
        other.form === element.form,
    );
    return element === (group.find((radio) => radio.checked) || group[0]);
  });
}

function outsidePanel(event, dialog) {
  const bounds = dialog.getBoundingClientRect();
  return (
    event.target === dialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  );
}

/** Controlled presentation only. The consumer owns open, actions and data. */
export default function Modal({
  open = false,
  onClose,
  title = "Dialog",
  description,
  children,
  actions,
  initialFocusRef,
  closeOnBackdrop = false,
  closeLabel = "Close dialog",
  headingLevel = 2,
  className = "",
}) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const ignoredCloseEvents = useRef(0);
  const backdropPointerDown = useRef(false);
  const titleId = useId();
  const descriptionId = `${titleId}-description`;
  const Heading = [2, 3, 4].includes(headingLevel) ? `h${headingLevel}` : "h2";

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const document = dialog.ownerDocument;
    const previousFocus = document.activeElement;
    dialog.showModal();
    dialog.scrollTop = 0;
    const unlockScroll = lockScroll(document.body);
    const desiredFocus = initialFocusRef?.current;
    if (
      desiredFocus &&
      dialog.contains(desiredFocus) &&
      isAvailable(desiredFocus)
    ) {
      desiredFocus.focus();
    }
    if (document.activeElement !== desiredFocus) {
      headingRef.current.focus({ preventScroll: true });
    }

    return () => {
      if (dialog.open) {
        // Native close events are queued, including React StrictMode cleanup.
        ignoredCloseEvents.current += 1;
        dialog.close();
      }
      unlockScroll();
      if (previousFocus && isAvailable(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
      backdropPointerDown.current = false;
    };
  }, [open, initialFocusRef]);

  if (open && typeof onClose !== "function") {
    throw new Error("An open Modal requires an onClose callback.");
  }

  function trapTab(event) {
    if (event.key !== "Tab" || event.defaultPrevented) return;
    const dialog = dialogRef.current;
    const stops = tabStops(dialog);
    const first = stops[0];
    const last = stops.at(-1);
    const active = dialog.ownerDocument.activeElement;
    if (!first) {
      event.preventDefault();
      headingRef.current.focus();
    } else if (
      !stops.includes(active) ||
      (event.shiftKey ? active === first : active === last)
    ) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`miu-modal ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      onKeyDown={trapTab}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose("escape");
      }}
      onClose={(event) => {
        if (event.target !== dialogRef.current) return;
        event.stopPropagation();
        if (ignoredCloseEvents.current > 0) {
          ignoredCloseEvents.current -= 1;
        } else if (open) {
          onClose("native-close");
        }
      }}
      onPointerDown={(event) => {
        backdropPointerDown.current =
          event.button === 0 && outsidePanel(event, dialogRef.current);
      }}
      onClick={(event) => {
        const dismiss =
          closeOnBackdrop &&
          backdropPointerDown.current &&
          outsidePanel(event, dialogRef.current);
        backdropPointerDown.current = false;
        if (dismiss) onClose("backdrop");
      }}
    >
      <div className="miu-modal__header">
        <div className="miu-modal__title-group">
          <Heading
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="miu-modal__title"
          >
            {title || "Dialog"}
          </Heading>
          {description && (
            <p id={descriptionId} className="miu-modal__description">
              {description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          className="miu-modal__close"
          aria-label={closeLabel}
          onClick={() => onClose("close-button")}
        >
          <img
            src={closeIcon}
            alt=""
            width="22"
            height="22"
            draggable="false"
          />
        </Button>
      </div>
      {children != null && <div className="miu-modal__body">{children}</div>}
      {actions != null && <div className="miu-modal__actions">{actions}</div>}
    </dialog>
  );
}
