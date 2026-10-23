/** Missing destinations remain text, never placeholder or misleading links. */
export default function PublicLink({
  href,
  currentPath,
  className = "",
  children,
  onClick,
  ...props
}) {
  const classes = `miu-public-link ${className}`.trim();
  if (!href) return <span className={classes}>{children}</span>;

  return (
    <a
      {...props}
      href={href}
      className={classes}
      aria-current={currentPath === href ? "page" : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
