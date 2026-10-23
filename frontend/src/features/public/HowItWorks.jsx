import { useEffect, useRef } from "react";
import { BriefcaseBusiness, Users, Star, ArrowUpRight } from "lucide-react";
import { getTimelineMotion } from "./timelineMotion.js";
import "./howItWorks.css";

const steps = [
  {
    icon: BriefcaseBusiness,
    title: "Post a job",
    caption: "Start with an idea",
    description:
      "Share your brief, budget and timeline. Give the right students a clear place to start.",
  },
  {
    icon: Users,
    title: "Apply and get chosen",
    caption: "Find your people",
    description:
      "Students bring their skills and proposals. Clients choose the right fit, and great work begins.",
  },
  {
    icon: Star,
    title: "Review each other",
    caption: "Build your reputation",
    description:
      "Deliver something great. Share feedback and turn a successful project into your next opportunity.",
  },
];

export default function HowItWorks({ motionEnabled }) {
  const timeline = useRef(null);
  useEffect(() => {
    const root = timeline.current;
    if (!motionEnabled || !root) return;
    const rows = [...root.querySelectorAll("li")];
    let frame = 0;
    function update() {
      frame = 0;
      const top = root.getBoundingClientRect().top;
      const offsets = rows.map((row) => row.offsetTop + row.offsetHeight / 2);
      const { progress, activeIndex, revealed } = getTimelineMotion(
        offsets.map((offset) => top + offset),
        window.innerHeight,
      );
      root.style.setProperty("--track-start", `${offsets[0]}px`);
      root.style.setProperty(
        "--track-length",
        `${offsets.at(-1) - offsets[0]}px`,
      );
      root.style.setProperty("--timeline-progress", progress);
      root.dataset.motionReady = "true";
      rows.forEach((row, index) => {
        if (revealed[index]) row.dataset.revealed = "true";
        row.dataset.active = String(index === activeIndex);
        row.dataset.passed = String(index < activeIndex);
      });
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize =
      "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
    resize?.observe(root);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      resize?.disconnect();
      delete root.dataset.motionReady;
      rows.forEach((row) => {
        delete row.dataset.active;
        delete row.dataset.passed;
      });
    };
  }, [motionEnabled]);

  return (
    <section
      className="landing-section landing-how"
      id="how-it-works"
      aria-labelledby="how-it-works-title"
    >
      <div className="landing-container">
        <div className="landing-heading landing-how-heading">
          <div>
            <p className="landing-eyebrow">From first idea to finished work</p>
            <h2 id="how-it-works-title">How it works</h2>
            <p>Three simple steps. A whole new set of possibilities.</p>
          </div>
          <span className="landing-how-caption">
            YOUR NEXT CHAPTER STARTS HERE{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
        <div ref={timeline} className="landing-timeline">
          <div className="landing-timeline-track" aria-hidden="true">
            <span className="landing-timeline-fill" />
            <span className="landing-timeline-light" />
          </div>
          <ol className="landing-timeline-list">
            {steps.map(
              ({ icon: StepIcon, title, caption, description }, index) => (
                <li key={title}>
                  <span className="landing-step-connector" aria-hidden="true" />
                  <article className="landing-step">
                    <div className="landing-step-top">
                      <span className="landing-icon-plate">
                        <StepIcon
                          size={24}
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      </span>
                      <span>{caption}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                  <span className="landing-step-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
