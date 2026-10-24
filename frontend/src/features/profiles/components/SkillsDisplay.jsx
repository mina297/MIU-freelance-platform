/**
 * Skill chip list used in the About section.
 * @param {{ skills: string[], className?: string }} props
 */
export default function SkillsDisplay({ skills = [], className = "" }) {
  if (!skills.length) {
    return <p className="text-[13px] text-ink-secondary">No skills listed yet.</p>;
  }

  return (
    <ul
      className={`flex flex-wrap content-start gap-2 ${className}`.trim()}
      aria-label="Skills"
    >
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-full bg-surface-muted px-3 py-[7px] text-[13px] leading-normal text-ink-secondary"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
