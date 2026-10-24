import { useEffect, useRef } from "react";
import videoSource from "../../assets/hero/collaboration.mp4";
import posterSource from "../../assets/hero/collaboration-poster.jpg";
import { connectHeroPlayback } from "./heroVideoPlayback.js";
import "./heroVideo.css";

/** Decorative footage; the complete message and controls remain in the hero. */
export default function HeroVideo({ enabled }) {
  const ref = useRef(null);
  useEffect(
    () =>
      connectHeroPlayback(ref.current, {
        enabled,
        source: videoSource,
        page: document,
        Observer: window.IntersectionObserver,
        saveData: navigator.connection?.saveData,
      }),
    [enabled],
  );

  return (
    <div className="landing-hero-media" aria-hidden="true">
      <img
        className="landing-hero-poster"
        src={posterSource}
        alt=""
        fetchPriority="high"
        width="1280"
        height="720"
      />
      <video
        ref={ref}
        className="landing-hero-video"
        poster={posterSource}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
        onPlaying={(event) => {
          event.currentTarget.dataset.ready = "true";
        }}
        onError={(event) => {
          delete event.currentTarget.dataset.ready;
        }}
      />
      <div className="landing-hero-film-overlay" />
      <div className="landing-hero-film-frame" />
    </div>
  );
}
