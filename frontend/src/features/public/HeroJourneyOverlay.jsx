import { heroJourneyArtwork } from "./heroJourneyArtwork.js";
import { useTheme } from "../../theme/ThemeContext.js";
import { getRibbonPath, heroLightRibbons } from "./heroLightRibbons.js";

export default function HeroJourneyOverlay() {
  const { theme } = useTheme();
  const source = heroJourneyArtwork.sources[theme] ?? heroJourneyArtwork.sources.light;
  return (
    <div className="miu-scene-overlay">
      <div className="miu-journey-stage">
        <svg
          className="miu-connections"
          viewBox="0 0 700 650"
          fill="none"
          focusable="false"
        >
          <g className="miu-light-trails">
            {heroLightRibbons.map((ribbon) => (
              <path key={ribbon.id} data-ribbon={ribbon.id} d={getRibbonPath(ribbon)} />
            ))}
          </g>
          <g className="miu-ribbon-tips">
            {heroLightRibbons.map((ribbon) => (
              <circle key={ribbon.id} data-ribbon-tip={ribbon.id} r="2.8" />
            ))}
          </g>
        </svg>

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
