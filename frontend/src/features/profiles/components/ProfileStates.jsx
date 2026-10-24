/**
 * Loading / empty / not-found states for profile pages.
 */

export function ProfileLoadingState() {
  return (
    <div
      className="flex w-full flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading profile</span>
      <div className="h-4 w-48 animate-pulse rounded bg-[#e5e7eb]" />
      <div className="h-[180px] w-full animate-pulse rounded-[10px] bg-[#e5e7eb]" />
      <div className="h-12 w-full animate-pulse rounded bg-[#e5e7eb]" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-72 animate-pulse rounded-[10px] bg-[#e5e7eb]" />
        <div className="h-72 animate-pulse rounded-[10px] bg-[#e5e7eb]" />
      </div>
    </div>
  );
}

export function ProfileNotFoundState({ studentId }) {
  return (
    <div
      className="rounded-[10px] border border-[#e5e7eb] bg-white p-8 text-center shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)]"
      role="alert"
    >
      <h2 className="text-xl font-semibold text-miu-black">
        Profile not found
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
        No student profile matches
        {studentId ? (
          <>
            {" "}
            <span className="font-medium text-miu-black">{studentId}</span>
          </>
        ) : (
          " the requested ID"
        )}
        . Check the ID or try a demo profile such as{" "}
        <span className="font-medium text-miu-black">student_001</span> or{" "}
        <span className="font-medium text-miu-black">student_002</span>.
      </p>
    </div>
  );
}

export function ProfileEmptyState({ message = "Nothing to show yet." }) {
  return (
    <div className="rounded-[10px] border border-dashed border-[#e5e7eb] bg-white p-8 text-center">
      <p className="text-sm text-[#4b5563]">{message}</p>
    </div>
  );
}
