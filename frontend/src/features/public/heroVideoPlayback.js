/** Connect native playback to motion, viewport and page visibility preferences. */
export function connectHeroPlayback(
  video,
  { enabled, source, page, Observer, saveData },
) {
  if (!video) return undefined;
  video.pause();
  if (!enabled || saveData) return undefined;

  let inView = !Observer;
  let active = true;
  function sync() {
    if (!active || !inView || page.hidden) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) {
      video.setAttribute("src", source);
      video.load();
    }
    // A browser may deny automatic playback; the poster remains a complete fallback.
    const playback = video.play();
    playback?.catch(() => {});
  }
  const observer = Observer
    ? new Observer(
        (entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { threshold: 0.05 },
      )
    : null;
  observer?.observe(video);
  page.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    active = false;
    observer?.disconnect();
    page.removeEventListener("visibilitychange", sync);
    video.pause();
  };
}
