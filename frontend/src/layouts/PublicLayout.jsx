import { useId } from "react";
import PublicHeader from "../components/navigation/PublicHeader.jsx";
import PublicFooter from "../components/navigation/PublicFooter.jsx";

/** Supply page content (or a router Outlet); this component registers no routes. */
export default function PublicLayout({ children, destinations, currentPath }) {
  const mainId = useId();
  return (
    <div className="miu-public-layout">
      <a className="miu-public-skip-link" href={`#${mainId}`}>
        Skip to main content
      </a>
      <PublicHeader destinations={destinations} currentPath={currentPath} />
      <main className="miu-public-main" id={mainId} tabIndex={-1}>
        {children}
      </main>
      <PublicFooter destinations={destinations} currentPath={currentPath} />
    </div>
  );
}
