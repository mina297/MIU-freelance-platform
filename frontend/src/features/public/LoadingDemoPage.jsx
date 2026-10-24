import { useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import ProgressIndicator from "../../components/ui/ProgressIndicator.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import "./states/state-demos.css";

/** Content only; Member 1 registers /loading-demo inside PublicLayout. */
export default function LoadingDemoPage() {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const loading = phase === "loading";
  const message = loading
    ? "Example loading started. Use Advance or Complete to finish."
    : phase === "complete"
      ? "Example loading complete."
      : "Ready to start the loading example.";

  function advance() {
    const next = Math.min(100, progress + 25);
    setProgress(next);
    if (next === 100) setPhase("complete");
  }

  return (
    <div className="m4-state-demo">
      <header className="m4-state-demo__intro">
        <h1>Loading states</h1>
        <p>
          Phase 1 component demonstration. These examples do not fetch data or
          measure a real operation.
        </p>
      </header>

      <Card as="section" aria-labelledby="loading-interactive-heading">
        <h2 id="loading-interactive-heading">Interactive loading example</h2>
        <p role="status" aria-atomic="true">
          {message}
        </p>
        <div className="m4-state-demo__actions">
          <Button
            onClick={() => {
              setPhase("loading");
              setProgress(0);
            }}
          >
            Start loading
          </Button>
          <Button variant="outline" disabled={!loading} onClick={advance}>
            Advance 25%
          </Button>
          <Button
            variant="outline"
            disabled={!loading}
            onClick={() => {
              setProgress(100);
              setPhase("complete");
            }}
          >
            Complete
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setProgress(0);
              setPhase("idle");
            }}
          >
            Reset
          </Button>
        </div>
        <ProgressIndicator label="Simulated progress" value={progress} />
        <div className="m4-state-demo__result" aria-busy={loading}>
          {loading ? (
            <Skeleton />
          ) : (
            <p>
              {phase === "complete"
                ? "Example content is ready."
                : "Example content will appear here."}
            </p>
          )}
        </div>
      </Card>

      <section
        aria-labelledby="loading-static-heading"
        className="m4-state-demo__section"
      >
        <h2 id="loading-static-heading">Static appearance examples</h2>
        <p>These specimens stay visible so their styling can be inspected.</p>
        <div className="m4-state-demo__grid">
          <Card as="section" aria-labelledby="loading-spinner-heading">
            <h3 id="loading-spinner-heading">Spinner and loading message</h3>
            <LoadingState message="Loading example content…" />
          </Card>
          <Card as="section" aria-labelledby="loading-skeleton-heading">
            <h3 id="loading-skeleton-heading">Decorative skeleton shapes</h3>
            <Skeleton variant="circle" />
            <Skeleton variant="rectangle" />
            <p>
              Placeholders have no keyboard targets or duplicate announcements.
            </p>
          </Card>
          <Card as="section" aria-labelledby="loading-progress-heading">
            <h3 id="loading-progress-heading">Unknown progress</h3>
            <ProgressIndicator label="Example operation" />
            <p>No percentage is shown when progress is unknown.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
