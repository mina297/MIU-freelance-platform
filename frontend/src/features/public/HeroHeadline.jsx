import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useMemo, useState } from "react";
import "./heroHeadline.css";

const messages = [
  "Great ideas deserve great talent.",
  "Your skills. Your next opportunity.",
  "Find talent. Bring ideas to life.",
  "Build work you’re proud of.",
];

export default function HeroHeadline({ enabled }) {
  const { t, language } = useLanguage();
  const localizedMessages = useMemo(
    () => messages.map((message) => t(message)),
    [t],
  );

  const [frame, setFrame] = useState({
    text: localizedMessages[0],
    phase: "hold",
    language,
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let index = 0;
    let length = localizedMessages[0].length;
    let phase = "hold";
    let timer;
    function tick() {
      let delay;
      if (phase === "hold") {
        phase = "fade";
        delay = 550;
      } else if (phase === "fade") {
        phase = "blank";
        length = 0;
        index = (index + 1) % localizedMessages.length;
        delay = 1100;
      } else {
        phase = "typing";
        length += 1;
        delay = 65;
        if (length === localizedMessages[index].length) {
          phase = "hold";
          delay = 2800;
        }
      }
      setFrame({
        text: localizedMessages[index].slice(0, length),
        phase,
        language,
      });
      timer = window.setTimeout(tick, delay);
    }
    timer = window.setTimeout(tick, 2800);
    return () => window.clearTimeout(timer);
  }, [enabled, language, localizedMessages]);

  return (
    <h1 id="landing-title" className="landing-typed-headline">
      <span className="sr-only">
        {t(
          "Great ideas deserve great talent. Find freelance projects and student services at MIU.",
        )}
      </span>
      <span
        className="landing-typed-visual"
        aria-hidden="true"
        data-phase={enabled ? frame.phase : "hold"}
      >
        {enabled && frame.language === language
          ? frame.text
          : localizedMessages[0]}
        {enabled && frame.phase === "typing" && (
          <span className="landing-typed-cursor" />
        )}
      </span>
    </h1>
  );
}
