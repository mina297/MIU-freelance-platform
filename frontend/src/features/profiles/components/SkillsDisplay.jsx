/**
 * Skill chip list used in the About section.
 * @param {{ skills: string[], className?: string }} props
 */
export default function SkillsDisplay({ skills = [], className = "" }) {
  if (!skills.length) {
    return <p className="text-[13px] text-[#4b5563]">No skills listed yet.</p>;
  }

  return (
    <ul
      className={`flex flex-wrap content-start gap-2 ${className}`.trim()}
      aria-label="Skills"
    >
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-full bg-[#f1f1f3] px-3 py-[7px] text-[13px] leading-normal text-[#4b5563]"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
