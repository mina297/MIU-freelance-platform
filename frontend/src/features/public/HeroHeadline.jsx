import { useContext } from "react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { HeroTypingContext } from "./HeroTypingContext.js";
const phrases = {
  en: [["Your Skills", "Create Impact."], ["Great Ideas", "Start Here."], ["Build Today", "Grow Tomorrow."]],
  ar: [["مهاراتك", "تصنع الأثر."], ["أفكار رائعة", "تبدأ هنا."], ["أنجز اليوم", "وتطوّر غدًا."]],
};
export default function HeroHeadline() {
  const { language } = useLanguage();
  const { index, progress } = useContext(HeroTypingContext);
  const words = phrases[language] ?? phrases.en;
  const [first, second] = words[index % words.length];
  const length = Math.round((first.length + second.length) * progress);
  return <h1 id="landing-title" className="miu-hero-title miu-hero-title--typing" aria-label={words[0].join(" ")}>
    {words.map(([top, bottom]) => <span key={top} className="miu-title-reserve" aria-hidden="true">{top}<br />{bottom}</span>)}
    <span className="miu-title-typed" aria-hidden="true">{first.slice(0, length)}<br /><span>{second.slice(0, Math.max(0, length - first.length))}</span></span>
  </h1>;
}
