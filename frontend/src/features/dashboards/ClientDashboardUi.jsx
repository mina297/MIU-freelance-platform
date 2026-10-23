import { asset } from "./clientDashboardAssets.js";
export function Icon({ name }) {
  return <img className="sd-icon" src={asset(name)} alt="" />;
}
export function Badge({ status }) {
  return (
    <span
      className={`sd-badge cd-${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}
