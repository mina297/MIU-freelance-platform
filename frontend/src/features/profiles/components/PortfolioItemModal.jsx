import Modal from "../../../components/ui/Modal.jsx";
import SafeImage from "./SafeImage.jsx";
export default function PortfolioItemModal({ item, open, onClose }) {
  return (
    <Modal
      open={Boolean(open && item)}
      onClose={onClose}
      title={item?.title ?? "Portfolio item"}
      closeOnBackdrop
    >
      {item && (
        <div className="space-y-4">
          <SafeImage
            src={item.imageSrc}
            alt={item.imageAlt || item.title}
            className="max-h-80 w-full object-contain"
          />
          <p>
            {item.category} · {item.monthLabel}
          </p>
          <p>{item.description || item.summary}</p>
          {item.tools?.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {item.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
