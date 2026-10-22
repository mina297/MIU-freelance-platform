import { useId } from "react";
import briefcaseDesktop from "../../../assets/public/how-it-works/briefcase-desktop.svg";
import briefcaseMobile from "../../../assets/public/how-it-works/briefcase-mobile.svg";
import usersDesktop from "../../../assets/public/how-it-works/users-desktop.svg";
import usersMobile from "../../../assets/public/how-it-works/users-mobile.svg";
import starDesktop from "../../../assets/public/how-it-works/star-desktop.svg";
import starMobile from "../../../assets/public/how-it-works/star-mobile.svg";
import "./HowItWorksSection.css";

const STEPS = [
  {
    id: "post",
    title: "Post a job",
    description:
      "Describe the scope, budget, and timeline so the right students can find your opportunity.",
    desktopIcon: briefcaseDesktop,
    mobileIcon: briefcaseMobile,
  },
  {
    id: "apply",
    title: "Apply and get chosen",
    description:
      "Students share relevant work and a focused proposal; clients choose with confidence.",
    desktopIcon: usersDesktop,
    mobileIcon: usersMobile,
  },
  {
    id: "review",
    title: "Review each other",
    description:
      "Close the project with useful feedback that strengthens both profiles and the community.",
    desktopIcon: starDesktop,
    mobileIcon: starMobile,
  },
];

/** Static project-flow explanation for the public landing page. */
export default function HowItWorksSection() {
  const headingId = useId();

  return (
    <section className="m4-how-it-works" aria-labelledby={headingId}>
      <div className="m4-how-it-works__content">
        <div className="m4-how-it-works__heading-row">
          <div className="m4-how-it-works__heading-copy">
            <p className="m4-how-it-works__eyebrow">
              A simple path to great work
            </p>
            <h2 id={headingId}>How it works</h2>
            <p className="m4-how-it-works__introduction">
              Clear steps, campus accountability, and mutual reviews keep every
              project focused and trustworthy.
            </p>
          </div>
          <p className="m4-how-it-works__summary">
            THREE STEPS • ONE COMMUNITY
          </p>
        </div>

        <ol className="m4-how-it-works__steps" role="list">
          {STEPS.map((step, index) => (
            <li className="m4-how-it-works__step" key={step.id}>
              <div className="m4-how-it-works__card">
                <div className="m4-how-it-works__card-top" aria-hidden="true">
                  <span className="m4-how-it-works__icon-plate">
                    <img
                      className="m4-how-it-works__icon-desktop"
                      src={step.desktopIcon}
                      width="22"
                      height="22"
                      alt=""
                    />
                    <img
                      className="m4-how-it-works__icon-mobile"
                      src={step.mobileIcon}
                      width="21"
                      height="21"
                      alt=""
                    />
                  </span>
                  <span className="m4-how-it-works__number">0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p className="m4-how-it-works__description">
                  {step.description}
                </p>
              </div>
              <span className="m4-how-it-works__timeline-number" aria-hidden="true">
                0{index + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
