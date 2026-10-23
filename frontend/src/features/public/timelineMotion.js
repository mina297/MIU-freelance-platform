/** Positions are node centers relative to the viewport, in document order. */
export function getTimelineMotion(centers, viewportHeight) {
  const head = viewportHeight * 0.68;
  const span = centers.at(-1) - centers[0];
  return {
    progress:
      span > 0 ? Math.max(0, Math.min(1, (head - centers[0]) / span)) : 0,
    activeIndex: centers.findLastIndex((center) => center <= head),
    revealed: centers.map((center) => center <= head),
  };
}
