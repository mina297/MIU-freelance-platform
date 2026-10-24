import Button from "./Button.jsx";
import { getPaginationItems } from "./paginationModel.js";
import previousIcon from "../../assets/figma/pagination-previous.svg";
import nextIcon from "../../assets/figma/pagination-next.svg";
import "./navigation-controls.css";

export default function Pagination({
  page = 1,
  pageCount = 0,
  onPageChange,
  summary,
  label = "Pagination",
  previousLabel = "Previous page",
  nextLabel = "Next page",
  getPageLabel = (number) => `Page ${number}`,
  disabled = false,
  className = "",
}) {
  const items = getPaginationItems(page, pageCount);
  const unavailable = disabled || typeof onPageChange !== "function";
  if (items.length === 0 && summary == null) return null;

  function requestPage(number) {
    if (!unavailable && number !== page && number >= 1 && number <= pageCount) {
      onPageChange(number);
    }
  }

  return (
    <nav
      className={`miu-pagination ${className}`.trim()}
      aria-label={label}
      aria-disabled={unavailable || undefined}
    >
      {summary != null && <p className="miu-pagination__summary">{summary}</p>}
      {items.length > 0 && (
        <ul className="miu-pagination__list">
          <li key="previous">
            <Button
              variant="ghost"
              className="miu-pagination__button"
              aria-label={previousLabel}
              disabled={unavailable || page === 1}
              onClick={() => requestPage(page - 1)}
            >
              <img
                src={page === 1 ? previousIcon : nextIcon}
                className={
                  page === 1
                    ? "miu-pagination__previous-disabled"
                    : "miu-pagination__previous"
                }
                alt=""
                width="16"
                height="16"
                draggable="false"
              />
            </Button>
          </li>
          {items.map((item) => (
            <li key={item}>
              {typeof item === "number" ? (
                <Button
                  variant={item === page ? "primary" : "ghost"}
                  className="miu-pagination__button"
                  aria-label={getPageLabel(item)}
                  aria-current={item === page ? "page" : undefined}
                  disabled={unavailable}
                  onClick={() => requestPage(item)}
                >
                  {item}
                </Button>
              ) : (
                <span className="miu-pagination__gap" aria-hidden="true">
                  …
                </span>
              )}
            </li>
          ))}
          <li key="next">
            <Button
              variant="ghost"
              className="miu-pagination__button"
              aria-label={nextLabel}
              disabled={unavailable || page === pageCount}
              onClick={() => requestPage(page + 1)}
            >
              <img
                src={nextIcon}
                alt=""
                width="16"
                height="16"
                draggable="false"
              />
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
}
