import { BadgeCheck } from "lucide-react";
import SafeImage from "../../profiles/components/SafeImage.jsx";

/** Shows the student and completed project being reviewed. */
export default function ReviewSubjectSummary({ student, order }) {
  if (!student && !order) return null;

  const displayName = student?.displayName || "Student freelancer";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const academic =
    student?.headline ||
    [student?.fieldOfStudy, student?.yearLabel].filter(Boolean).join(" • ") ||
    "MIU student freelancer";

  const completedLabel = order?.completedAt
    ? `Completed ${formatCompletedDate(order.completedAt)}`
    : "Completed";

  return (
    <section
      className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-[#f8f8f9] p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
      aria-label="Review subject"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#e5e7eb] sm:size-[72px]">
        <SafeImage
          key={student?.profileImage || displayName}
          src={student?.profileImage}
          alt={student?.profileImageAlt || `Photo of ${displayName}`}
          className="size-full object-cover"
          width={72}
          height={72}
          placeholderClassName="flex size-full items-center justify-center bg-miu-red-tint text-lg font-semibold text-miu-red"
          placeholderLabel={initials || "?"}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-miu-black sm:text-lg">
            {displayName}
          </h3>
          {student?.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-miu-red ring-1 ring-[#e5e7eb]">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Verified
            </span>
          ) : null}
        </div>
        <p className="text-sm text-[#4b5563]">{academic}</p>
        {order?.title ? (
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <p className="text-sm font-medium text-miu-black">
              Project:{" "}
              <span className="font-normal text-[#4b5563]">{order.title}</span>
            </p>
            <span className="inline-flex w-fit items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
              {completedLabel}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function formatCompletedDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
