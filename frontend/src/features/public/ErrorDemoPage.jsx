import { useRef, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import "./states/state-demos.css";

/** Local, synchronous recovery simulation; no API or router side effects. */
export default function ErrorDemoPage() {
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
        <h1>Empty and error states</h1>
        <p>
          Phase 1 component demonstration. Failures and recovery are simulated
          locally; no real request is made.
        </p>
      </header>

      <section
        aria-labelledby="error-interactive-heading"
        className="m4-state-demo__section"
      >
        <h2 id="error-interactive-heading">Recoverable error example</h2>
        <div className="m4-state-demo__actions">
          <Button ref={triggerRef} onClick={() => setFailed(true)}>
            Simulate error
          </Button>
          <Button variant="ghost" onClick={recover}>
            Reset error
          </Button>
        </div>
        <p role="status" aria-atomic="true">
          {failed
            ? "Example error shown. Try again restores the example content."
            : "Example content is ready. No error is active."}
        </p>
        {failed ? (
          <ErrorState
            headingLevel={3}
            description="This is a simulated failure. Try again restores the example immediately."
            onRetry={recover}
          />
        ) : (
          <Card>
            <p>Example content is available.</p>
          </Card>
        )}
      </section>

      <section
        aria-labelledby="empty-interactive-heading"
        className="m4-state-demo__section"
      >
        <h2 id="empty-interactive-heading">Empty result example</h2>
        <div className="m4-state-demo__actions">
          <Button
            variant="outline"
            ref={clearRef}
            onClick={() => setEmpty(true)}
          >
            Reset empty example
          </Button>
        </div>
        <p role="status" aria-atomic="true">
          {empty
            ? "No example items are shown."
            : "Example filters cleared. One example item is shown."}
        </p>
        {empty ? (
          <EmptyState
            headingLevel={3}
            title="No example results"
            description="Clear the simulated filters to show an example item."
            onAction={showItems}
          />
        ) : (
          <Card>
            <ul>
              <li>Example item</li>
            </ul>
          </Card>
        )}
      </section>

      <section
        aria-labelledby="error-static-heading"
        className="m4-state-demo__section"
      >
        <h2 id="error-static-heading">
          Static appearance without recovery actions
        </h2>
        <p>
          A recovery button is shown only when the consuming feature provides a
          working handler.
        </p>
        <div className="m4-state-demo__grid">
          <EmptyState headingLevel={3} />
          <ErrorState
            headingLevel={3}
            description="This static example has no retry handler."
          />
        </div>
      </section>
    </div>
  );
}
