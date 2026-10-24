import {
  BriefcaseBusiness,
  CalendarClock,
  Languages,
  MapPin,
  Star,
} from "lucide-react";
import {
  formatClientFeedbackLabel,
  formatCompletedJobsLabel,
  formatLanguagesLabel,
} from "../utils/formatProfileLabels.js";

/** Sidebar facts card (availability, jobs, feedback, location, languages). */
export default function AtAGlanceCard({
  completedJobsCount,
  ratingSummary,
  location,
  languages,
  availability = "",
}) {
  const facts = [
    {
      id: "availability",
      label: "Availability",
      value: availability?.trim() || "Not specified",
      Icon: CalendarClock,
    },
    {
      id: "jobs",
      label: "Completed jobs",
      value: formatCompletedJobsLabel(completedJobsCount),
      Icon: BriefcaseBusiness,
    },
    {
      id: "feedback",
      label: "Client feedback",
      value: formatClientFeedbackLabel(ratingSummary),
      Icon: Star,
    },
    {
      id: "location",
      label: "Based in",
      value: location || "Not specified",
      Icon: MapPin,
    },
    {
      id: "languages",
      label: "Languages",
      value: formatLanguagesLabel(languages),
      Icon: Languages,
    },
  ];

  return (
    <section
      className="flex w-full flex-col gap-6 overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)]"
      aria-labelledby="at-a-glance-heading"
    >
      <h2
        id="at-a-glance-heading"
        className="text-lg font-semibold leading-normal text-miu-black"
      >
        At a glance
      </h2>

      <ul className="flex flex-col gap-6">
        {facts.map(({ id, label, value, Icon }) => (
          <li key={id} className="flex items-start gap-3">
            <Icon
              className="mt-0.5 size-5 shrink-0 text-[#4b5563]"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs leading-normal text-[#4b5563]">{label}</p>
              <p className="text-sm font-medium leading-normal text-miu-black">
                {value}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
