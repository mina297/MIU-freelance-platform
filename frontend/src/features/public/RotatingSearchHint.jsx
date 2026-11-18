import { useContext } from "react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { HeroTypingContext } from "./HeroTypingContext.js";
const examples = [
  "Software development",
  "Design",
  "Video editing",
  "Content writing",
  "Translation",
  "Digital marketing",
];

export default function RotatingSearchHint() {
  const { t } = useLanguage();
  const { index, progress } = useContext(HeroTypingContext);
  const word = t(examples[index % examples.length]);
  return <span className="landing-search-hint" aria-hidden="true">
    <span className="landing-search-example">{word.slice(0, Math.round(word.length * progress))}</span>
    <span className="landing-search-caret" />
  </span>;
}
