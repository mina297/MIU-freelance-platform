import source from "../../assets/hero/miu-journey-objects-light-crimson-v3.webp";
import darkSource from "../../assets/hero/miu-journey-objects-dark-ivory-v2.webp";

// Raster atlas from the approved ImageGen preview. Viewports isolate each image
// without redrawing it or downloading seven copies of the same artwork.
export const heroJourneyArtwork = {
  sources: { light: source, dark: darkSource },
  width: 1536,
  height: 1024,
  objects: [
    { id: "project", className: "miu-scene-card miu-scene-project", viewBox: "840 35 565 365" },
    { id: "profile", className: "miu-scene-card miu-scene-profile", viewBox: "130 50 570 360" },
    { id: "service", className: "miu-scene-card miu-scene-service", viewBox: "458 422 610 250" },
    { id: "earnings", className: "miu-scene-card miu-scene-earnings", viewBox: "80 690 290 290" },
    { id: "laptop", className: "miu-scene-laptop", viewBox: "385 690 420 285" },
    { id: "briefcase", className: "miu-floating-briefcase", viewBox: "860 700 280 275" },
    { id: "users", className: "miu-floating-users", viewBox: "1180 700 275 280" },
  ],
};
