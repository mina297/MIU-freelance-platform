export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div className="m4-landing__heading-row">
      <div className="m4-landing__heading-copy">
        <p className="m4-landing__eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
