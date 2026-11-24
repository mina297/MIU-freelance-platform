export function watchHeaderScroll(header, scroller, target) {
  const position = () =>
    Math.max(
      0,
      Math.min(
        scroller.scrollTop,
        scroller.scrollHeight - scroller.clientHeight,
      ),
    );
  let previous = position();
  const reveal = () => header.removeAttribute("data-scroll-hidden");
  reveal();
  function update() {
    const current = position();
    if (current === previous) return;
    const interacting = header.matches(
      ':has(:focus-visible, [aria-expanded="true"])',
    );
    header.toggleAttribute(
      "data-scroll-hidden",
      !interacting && current > header.offsetHeight && current > previous,
    );
    previous = current;
  }
  target.addEventListener("scroll", update, { passive: true });
  header.addEventListener("focusin", reveal);
  return () => {
    target.removeEventListener("scroll", update);
    header.removeEventListener("focusin", reveal);
    reveal();
  };
}
