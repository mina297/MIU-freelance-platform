import Checkbox from "../../components/ui/Checkbox.jsx";
import { ORDER_SAMPLE_ATTACHMENTS } from "./orderWorkspaceModel.js";

export function OrderAttachmentNames({ ids }) {
  if (!ids.length) return null;
  return (
    <ul
      className="order-workspace__samples"
      aria-label="Fictional attachment metadata"
    >
      {ids.map((id) => (
        <li key={id}>
          {ORDER_SAMPLE_ATTACHMENTS.find((item) => item.id === id)?.name ??
            "Sample unavailable"}{" "}
          <span>(fictional sample; no file)</span>
        </li>
      ))}
    </ul>
  );
}

export default function OrderSampleAttachments({ ids, onChange, error }) {
  return (
    <fieldset className="order-workspace__attachments">
      <legend>Sample attachments (optional)</legend>
      <p>No real files are read, uploaded, stored or downloaded.</p>
      {ORDER_SAMPLE_ATTACHMENTS.map((item, index) => (
        <Checkbox
          key={item.id}
          name="workspace-attachments"
          label={item.name}
          checked={ids.includes(item.id)}
          error={index === 0 ? error : undefined}
          onChange={(event) =>
            onChange(
              event.target.checked
                ? [...ids, item.id]
                : ids.filter((id) => id !== item.id),
            )
          }
        />
      ))}
    </fieldset>
  );
}
