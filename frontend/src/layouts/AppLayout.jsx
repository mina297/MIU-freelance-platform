import PublicWebsite from "../app/PublicWebsite.jsx";

/** Protected routes retain their access checks and share the public navigation. */
export default function AppLayout() {
  return <PublicWebsite />;
}
