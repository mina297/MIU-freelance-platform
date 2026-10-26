import { useLanguage } from "../../i18n/LanguageContext.js";
import { useRef, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import "./states/state-demos.css";

/** Local, synchronous recovery simulation; no API or router side effects. */
export default function ErrorDemoPage() {
  const { t } = useLanguage();

  const [failed, setFailed] = useState(false);
  const [empty, setEmpty] = useState(true);
  const triggerRef = useRef(null);
  const clearRef = useRef(null);

  function recover() {
    setFailed(false);
    triggerRef.current?.focus();
  }

  function showItems() {
    setEmpty(false);
    clearRef.current?.focus();
  }

  return (
    <div className="m4-state-demo">
      <header className="m4-state-demo__intro">
        <h1>{t("Empty and error states")}</h1>
        <p>
          {t(
            "Phase 1 component demonstration. Failures and recovery are simulated locally; no real request is made.",
          )}
        </p>
      </header>

      <section
        aria-labelledby="error-interactive-heading"
        className="m4-state-demo__section"
      >
        <h2 id="error-interactive-heading">{t("Recoverable error example")}</h2>
        <div className="m4-state-demo__actions">
          <Button ref={triggerRef} onClick={() => setFailed(true)}>
            {t("Simulate error")}
          </Button>
          <Button variant="ghost" onClick={recover}>
            {t("Reset error")}
          </Button>
        </div>
        <p role="status" aria-atomic="true">
          {failed
            ? t("Example error shown. Try again restores the example content.")
            : t("Example content is ready. No error is active.")}
        </p>
        {failed ? (
          <ErrorState
            headingLevel={3}
            description={t(
              "This is a simulated failure. Try again restores the example immediately.",
            )}
            onRetry={recover}
          />
        ) : (
          <Card>
            <p>{t("Example content is available.")}</p>
          </Card>
        )}
      </section>

      <section
        aria-labelledby="empty-interactive-heading"
        className="m4-state-demo__section"
      >
        <h2 id="empty-interactive-heading">{t("Empty result example")}</h2>
        <div className="m4-state-demo__actions">
          <Button
            variant="outline"
            ref={clearRef}
            onClick={() => setEmpty(true)}
          >
            {t("Reset empty example")}
          </Button>
        </div>
        <p role="status" aria-atomic="true">
          {empty
            ? t("No example items are shown.")
            : t("Example filters cleared. One example item is shown.")}
        </p>
        {empty ? (
          <EmptyState
            headingLevel={3}
            title={t("No example results")}
            description={t(
              "Clear the simulated filters to show an example item.",
            )}
            onAction={showItems}
          />
        ) : (
          <Card>
            <ul>
              <li>{t("Example item")}</li>
            </ul>
          </Card>
        )}
      </section>

      <section
        aria-labelledby="error-static-heading"
        className="m4-state-demo__section"
      >
        <h2 id="error-static-heading">
          {t("Static appearance without recovery actions")}
        </h2>
        <p>
          {t(
            "A recovery button is shown only when the consuming feature provides a working handler.",
          )}
        </p>
        <div className="m4-state-demo__grid">
          <EmptyState headingLevel={3} />
          <ErrorState
            headingLevel={3}
            description={t("This static example has no retry handler.")}
          />
        </div>
      </section>
    </div>
  );
}
