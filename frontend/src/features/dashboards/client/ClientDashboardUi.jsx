import { asset } from "./clientDashboardAssets.js";
import { Badge as DashboardBadge } from "../shared/DashboardUi.jsx";
export function Icon({ name }) {
  return <img className="sd-icon" src={asset(name)} alt="" />;
}
export function Badge({ status }) {
  return <DashboardBadge status={status} variant="client" translate={false} />;
}
