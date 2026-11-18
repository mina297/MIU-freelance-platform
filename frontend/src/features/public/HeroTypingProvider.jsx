import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { HeroTypingContext } from "./HeroTypingContext.js";
import { useVisibleMotion } from "./useLandingMotion.js";

// One clock keeps both strings at the same typing, hold and erase phase.
export default function HeroTypingProvider({ enabled: requestedMotion, children }) {
  const ref = useRef(null);
  const enabled = useVisibleMotion(ref, requestedMotion);
  const { language } = useLanguage();
  const [frame, setFrame] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    let index = 0, progress = 1, deleting = true, timer;
    function tick() {
      progress = Math.max(0, Math.min(1, progress + (deleting ? -0.05 : 0.05)));
      setFrame({ index, progress, language });
      let delay = deleting ? 35 : 70;
      if (progress === 0) {
        index = (index + 1) % 6;
        deleting = false;
        delay = 120;
      } else if (progress === 1) {
        deleting = true;
        delay = 2800;
      }
      timer = window.setTimeout(tick, delay);
    }
    timer = window.setTimeout(tick, 2800);
    return () => window.clearTimeout(timer);
  }, [enabled, language]);
  const value = enabled && frame?.language === language ? frame : { index: 0, progress: 1 };
  return <HeroTypingContext.Provider value={value}><div ref={ref} className="landing-hero-copy">{children}</div></HeroTypingContext.Provider>;
}
