import "./foundation.css";

const ELEMENTS = new Set(["div", "article", "section"]);

/** Visual container only: headings, content, links and actions belong to callers. */
export default function Card({
  as = "div",
  children,
  className = "",
  ...props
}) {
  const Element = ELEMENTS.has(as) ? as : "div";

  return (
    <Element {...props} className={`miu-card ${className}`.trim()}>
      {children}
    </Element>
  );
}
