import { asset } from "./studentDashboardAssets.js";
export function Icon({ name }) {
  return <img className="sd-icon" src={asset(name)} alt="" />;
}
