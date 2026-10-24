import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./SharedUiPreview.css";
import Button from "../Button.jsx";
import Card from "../Card.jsx";
import Badge from "../Badge.jsx";
import SharedUiExamples from "./SharedUiExamples.jsx";
import "../../../features/public/preview/marketplace-preview.css";

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
];

const BADGES = [
  ["neutral", "Cancelled"],
  ["success", "Open"],
  ["info", "In Progress"],
  ["completed", "Completed"],
  ["warning", "Pending"],
  ["danger", "Rejected"],
];

export default function SharedUiPreview() {
  const [lastAction, setLastAction] = useState("No preview action selected.");
  const [loading, setLoading] = useState(false);

  return (
    <main data-ui-preview className="marketplace-preview space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Component showcase</h1>
        <p className="max-w-3xl text-base">
          Isolated development preview. These controls demonstrate presentation
          only; actions do not change account or marketplace records.
        </p>
        <p className="text-sm">
          Use Tab and Enter/Space to try enabled buttons. Resize the browser and
          zoom to check labels and wrapping. Disabled buttons are skipped by
          Tab.
        </p>
      </header>

      <nav
        aria-label="Member 4 preview directory"
        className="flex flex-wrap gap-4 rounded-xl border p-4"
      >
        <a className="underline" href="/m4-pages-preview.html">
          All public page designs
        </a>
        <a className="underline" href="/how-it-works-preview.html">
          Original How It Works section
        </a>
        {[
          "buttons",
          "badges",
          "cards",
          "forms",
          "modal",
          "tabs",
          "data",
          "toasts",
          "feedback",
        ].map((section) => (
          <a className="underline" key={section} href={`#${section}`}>
            {section}
          </a>
        ))}
      </nav>

      <section
        id="buttons"
        aria-labelledby="buttons-heading"
        className="space-y-4"
      >
        <h2 id="buttons-heading" className="text-2xl font-bold">
          Buttons
        </h2>
        <p>
          Static appearance samples: default, disabled, and loading. The loading
          samples intentionally keep spinning; no requests are running. Use the
          separate interactive demo below to start and reset loading.
        </p>
        <div className="space-y-4">
          {BUTTON_VARIANTS.map((variant) => (
            <Card
              key={variant}
              as="section"
              aria-labelledby={`button-${variant}`}
            >
              <h3
                id={`button-${variant}`}
                className="mb-4 text-lg font-semibold"
              >
                {variant}
              </h3>
              <div className="showcase-states">
                <div className="showcase-state">
                  <p className="text-sm">Default</p>
                  <Button
                    variant={variant}
                    onClick={() =>
                      setLastAction(`${variant} button activated.`)
                    }
                  >
                    <span className="showcase-label">{variant} action</span>
                  </Button>
                </div>
                <div className="showcase-state">
                  <p className="text-sm">Disabled sample</p>
                  <Button
                    variant={variant}
                    disabled
                    onClick={() =>
                      setLastAction("Disabled action activated unexpectedly.")
                    }
                  >
                    <span className="showcase-label">Disabled action</span>
                  </Button>
                </div>
                <div className="showcase-state">
                  <p className="text-sm">Static loading sample</p>
                  <Button
                    variant={variant}
                    loading
                    onClick={() =>
                      setLastAction("Loading action activated unexpectedly.")
                    }
                  >
                    <span className="showcase-label">Loading appearance</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="mb-4 text-lg font-semibold">
            Interactive loading demo
          </h3>
          <p className="mb-4 text-sm">
            Start loading, then use Reset to return to normal. No request is
            sent.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                setLastAction(
                  "Loading demo active. Use Reset to return to normal.",
                );
              }}
            >
              <span className="showcase-label">
                {loading ? "Loading demo active" : "Start loading"}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(false);
                setLastAction("Loading preview reset. No data was saved.");
              }}
            >
              Reset
            </Button>
          </div>
        </Card>
        <p role="status" className="text-sm">
          {lastAction}
        </p>
      </section>

      <section
        id="badges"
        aria-labelledby="badges-heading"
        className="space-y-4"
      >
        <h2 id="badges-heading" className="text-2xl font-bold">
          Badges
        </h2>
        <Card>
          <div className="flex flex-wrap gap-6">
            {BADGES.map(([variant, label]) => (
              <div key={variant} className="space-y-2">
                <p className="text-sm font-semibold">{variant}</p>
                <Badge variant={variant}>{label}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm">
            Labels are examples supplied by this preview. The Badge component
            does not decide workflow status. Success, warning, and danger text
            includes the documented contrast adjustments to the Figma specimens.
          </p>
        </Card>
      </section>

      <section id="cards" aria-labelledby="cards-heading" className="space-y-4">
        <h2 id="cards-heading" className="text-2xl font-bold">
          Cards
        </h2>
        <p>All three semantic containers share the same visual surface.</p>
        <div className="showcase-cards">
          <Card>
            <h3 className="mb-3 text-lg font-semibold">Default div</h3>
            <p>
              A neutral container with the approved border, radius, padding, and
              shadow.
            </p>
          </Card>
          <Card as="article" aria-labelledby="article-card-heading">
            <h3
              id="article-card-heading"
              className="mb-3 text-lg font-semibold"
            >
              Article card
            </h3>
            <Badge variant="info">Preview example</Badge>
            <p className="mt-3">
              Content and labels remain the responsibility of the consuming
              feature.
            </p>
          </Card>
          <Card as="section" aria-labelledby="section-card-heading">
            <h3
              id="section-card-heading"
              className="mb-3 text-lg font-semibold"
            >
              Section card
            </h3>
            <p className="mb-4">
              Interactive elements stay inside the card rather than making the
              whole surface a button.
            </p>
            <Button
              variant="outline"
              onClick={() => setLastAction("Card action activated.")}
            >
              Try card action
            </Button>
          </Card>
        </div>
        <Card>
          <h3 className="mb-3 text-lg font-semibold">Long-content wrapping</h3>
          <div className="flex max-w-full flex-col items-start gap-4">
            <Badge variant="info">
              <span className="showcase-label">
                An intentionally long preview label for checking narrow screens
                and text zoom
              </span>
            </Badge>
            <Button
              variant="outline"
              onClick={() => setLastAction("Long-label action activated.")}
            >
              <span className="showcase-label">
                An intentionally long action label for checking wrapping at
                narrow widths
              </span>
            </Button>
          </div>
        </Card>
      </section>
      <SharedUiExamples />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SharedUiPreview />
  </StrictMode>,
);
