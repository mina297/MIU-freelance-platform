import { ArrowDown } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.js";

const scenes = [
  "Welcome",
  "Opportunities open",
  "Discover talent",
  "Make connections",
  "Project success",
];

export default function HeroStoryRail() {
  const { t } = useLanguage();
  return (
    <div className="miu-story-rail">
      <a href="#hero-discover" className="miu-story-skip">
        <ArrowDown size={15} aria-hidden="true" />
        <span>{t("Explore the possibilities")}</span>
      </a>
      <div className="miu-story-chapters" aria-hidden="true">
        <div className="miu-story-progress">
          <span className="miu-story-progress-fill" />
        </div>
        <ol>
          {scenes.map((scene, index) => (
            <li key={scene} data-chapter={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {t(scene)}
            </li>
          ))}
        </ol>
      </div>
      <p className="miu-story-disclosure">
        {t(
          "An illustration of your journey. Fictional projects, profiles and earnings.",
        )}
      </p>
    </div>
  );
}
