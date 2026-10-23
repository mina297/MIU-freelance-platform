/** Positions are node centers relative to the viewport, in document order. */
export function getTimelineMotion(centers, viewportHeight, extension = 0) {
  const head = viewportHeight * 0.68;
  const start = centers[0] - extension;
  const span = centers.at(-1) + extension - start;
  return {
    progress: span > 0 ? Math.max(0, Math.min(1, (head - start) / span)) : 0,
    activeIndex: centers.findLastIndex((center) => center <= head),
    revealed: centers.map((center) => center <= head),
  };
}
