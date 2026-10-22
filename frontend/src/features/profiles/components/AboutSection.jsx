import SkillsDisplay from "./SkillsDisplay.jsx";

/**
 * About introduction card with skills (Figma Introduction card).
 *
 * @param {{
 *   firstName: string,
 *   paragraphs: string[],
 *   skills: string[],
 * }} props
 */
export default function AboutSection({ firstName, paragraphs = [], skills = [] }) {
  return (
    <section
      className="flex w-full flex-col gap-5 overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-8"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-2xl font-bold leading-normal text-miu-black"
      >
        About {firstName}
      </h2>

      {paragraphs.map((paragraph, index) => (
        <p
          key={`about-paragraph-${index}`}
          className="text-[15px] leading-[1.7] text-[#4b5563]"
        >
          {paragraph}
        </p>
      ))}

      <div className="h-px w-full bg-[#e5e7eb]" role="separator" />

      <h3 className="text-lg font-semibold leading-normal text-miu-black">
        Skills
      </h3>
      <SkillsDisplay skills={skills} />
    </section>
  );
}
