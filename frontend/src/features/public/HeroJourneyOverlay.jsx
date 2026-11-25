import { heroJourneyArtwork } from "./heroJourneyArtwork.js";
import { useTheme } from "../../theme/ThemeContext.js";

export default function HeroJourneyOverlay() {
  const { theme } = useTheme();
  const source = heroJourneyArtwork.sources[theme] ?? heroJourneyArtwork.sources.light;
  return (
    <div className="miu-scene-overlay">
      <div className="miu-journey-stage">
        {heroJourneyArtwork.objects.map(({ id, className, viewBox }) => (
          <div key={id} className={`${className} miu-journey-item`} data-artwork={id}>
            <svg
              className="miu-journey-artwork"
              viewBox={viewBox}
              focusable="false"
              aria-hidden="true"
            >
              <image
                href={source}
                width={heroJourneyArtwork.width}
                height={heroJourneyArtwork.height}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
