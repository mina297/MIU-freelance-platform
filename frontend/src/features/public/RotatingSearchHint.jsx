import { useVisibleMotion } from "./useLandingMotion.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.js";

const examples = [
  "Software development",
  "Design",
  "Video editing",
  "Content writing",
  "Translation",
  "Digital marketing",
];

export default function RotatingSearchHint({ enabled: requestedMotion }) {
  const motionRef = useRef(null);
  const enabled = useVisibleMotion(motionRef, requestedMotion);
  const { t, language } = useLanguage();
  const localizedExamples = useMemo(
    () => examples.map((example) => t(example)),
    [t],
  );
  const [frame, setFrame] = useState({ text: localizedExamples[0], language });
  useEffect(() => {
    if (!enabled) return;
    let index = 0;
    let length = localizedExamples[0].length;
    let deleting = true;
    let timer;
    function tick() {
      const word = localizedExamples[index];
      length += deleting ? -1 : 1;
      setFrame({ text: word.slice(0, length), language });
      let delay = deleting ? 40 : 85;
      if (length === 0) {
        index = (index + 1) % localizedExamples.length;
        deleting = false;
        delay = 220;
      } else if (length === word.length) {
        deleting = true;
        delay = 1600;
      }
      timer = window.setTimeout(tick, delay);
    }
    timer = window.setTimeout(tick, 1600);
    return () => window.clearTimeout(timer);
  }, [enabled, language, localizedExamples]);

  return (
    <span ref={motionRef} className="landing-search-hint" aria-hidden="true">
      <span className="landing-search-example">
        {enabled && frame.language === language
          ? frame.text
          : localizedExamples[0]}
      </span>
      <span className="landing-search-caret" />
    </span>
  );
}
