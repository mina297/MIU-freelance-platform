import { useEffect, useState } from "react";

const examples = [
  "Software development",
  "Design",
  "Video editing",
  "Content writing",
  "Translation",
  "Digital marketing",
];

export default function RotatingSearchHint({ enabled }) {
  const [text, setText] = useState(examples[0]);
  useEffect(() => {
    if (!enabled) return;
    let index = 0;
    let length = examples[0].length;
    let deleting = true;
    let timer;
    function tick() {
      const word = examples[index];
      length += deleting ? -1 : 1;
      setText(word.slice(0, length));
      let delay = deleting ? 40 : 85;
      if (length === 0) {
        index = (index + 1) % examples.length;
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
  }, [enabled]);

  return (
    <span className="landing-search-hint" aria-hidden="true">
      <span className="landing-search-example">
        {enabled ? text : examples[0]}
      </span>
      <span className="landing-search-caret" />
    </span>
  );
}
