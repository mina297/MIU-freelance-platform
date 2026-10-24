import { Link, useInRouterContext } from "react-router-dom";

/** Internal page links preserve the app session; standalone previews need no router. */
export default function PublicLink({
  href,
  currentPath,
  className = "",
  children,
  onClick,
  reloadDocument = false,
  ...props
}) {
  const inRouter = useInRouterContext();
  const classes = `miu-public-link ${className}`.trim();
  if (!href) return <span className={classes}>{children}</span>;

  const internalPage =
    typeof href === "string" && /^(\/(?!\/)|\.\.?\/|\?)/.test(href);
  const nativeNavigation =
    reloadDocument ||
    (props.download != null && props.download !== false) ||
    (props.target && props.target !== "_self");
  const linkProps = {
    ...props,
    className: classes,
    "aria-current": currentPath === href ? "page" : undefined,
    onClick,
  };

  if (inRouter && internalPage && !nativeNavigation) {
    return (
      <Link {...linkProps} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <a {...linkProps} href={href}>
      {children}
    </a>
  );
}
