import { useId } from "react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";
import LoadingState from "../feedback/LoadingState.jsx";
import EmptyState from "../feedback/EmptyState.jsx";
import ErrorState from "../feedback/ErrorState.jsx";
import "./data-display.css";

/** Renders exactly the supplied records; data operations remain caller-owned. */
export default function DataTable({
  caption = "Records",
  description,
  columns,
  rows = [],
  getRowId = (row) => row.id,
  sort,
  onSortChange,
  getSortLabel = (header, direction) => `Sort ${header} ${direction}`,
  toolbar,
  pagination,
  state = "ready",
  loadingLabel = "Loading records…",
  emptyTitle = "No records to display",
  emptyDescription = "There are no records to show here yet.",
  onEmptyAction,
  emptyActionLabel = "Clear filters",
  errorMessage = "The records could not be loaded. Please try again.",
  onRetry,
  headingLevel = 2,
  className = "",
}) {
  const tableId = useId();
  const titleId = `${tableId}-title`;
  const descriptionId = `${tableId}-description`;
  const level = [2, 3, 4].includes(headingLevel) ? headingLevel : 2;
  const Heading = `h${level}`;

  if (
    !Array.isArray(columns) ||
    !columns.length ||
    columns.some(
      (column) =>
        !column ||
        typeof column.id !== "string" ||
        !column.id.trim() ||
        typeof column.header !== "string" ||
        !column.header.trim() ||
        typeof column.render !== "function",
    )
  ) {
    throw new TypeError(
      "DataTable requires columns with nonempty string IDs/headers and render functions.",
    );
  }
  if (
    new Set(columns.map((column) => column.id)).size !== columns.length ||
    columns.filter((column) => column.rowHeader).length > 1
  ) {
    throw new TypeError(
      "DataTable column IDs must be unique, with at most one row header.",
    );
  }
  if (!Array.isArray(rows) || typeof getRowId !== "function") {
    throw new TypeError(
      "DataTable requires a rows array and getRowId function.",
    );
  }
  if (!["ready", "loading", "error"].includes(state)) {
    throw new TypeError("DataTable state must be ready, loading, or error.");
  }

  const rowIds =
    state === "ready"
      ? rows.map((row) => {
          const id = getRowId(row);
          if (!(
            (typeof id === "string" && id.trim()) ||
            (typeof id === "number" && Number.isFinite(id))
          )) {
            throw new TypeError(
              "DataTable rows require stable nonempty string or finite numeric IDs.",
            );
          }
          return String(id);
        })
      : [];
  if (new Set(rowIds).size !== rowIds.length)
    throw new TypeError("DataTable row IDs must be unique.");

  const rowHeader = columns.find((column) => column.rowHeader);
  const headerId = (id) => `${tableId}-column-${encodeURIComponent(id)}`;
  const rowHeaderId = (id) => `${tableId}-row-${encodeURIComponent(id)}`;
  const selectedSort =
    columns.some((column) => column.id === sort?.columnId && column.sortable) &&
    ["ascending", "descending"].includes(sort?.direction)
      ? sort
      : undefined;
  const hasRows = state === "ready" && rows.length > 0;

  return (
    <Card
      as="section"
      className={`miu-data-table ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="miu-data-table__intro">
        <Heading id={titleId}>{caption}</Heading>
        {description && <p id={descriptionId}>{description}</p>}
      </div>
      {Boolean(toolbar) && (
        <div className="miu-data-table__toolbar">{toolbar}</div>
      )}
      {state === "loading" && (
        <div className="miu-data-table__feedback">
          <LoadingState message={loadingLabel} />
        </div>
      )}
      <div className="miu-data-table__content" aria-busy={state === "loading"}>
        {state === "error" ? (
          <ErrorState
            className="miu-data-table__feedback-card"
            title="Records unavailable"
            description={errorMessage}
            onRetry={onRetry}
            headingLevel={Math.min(level + 1, 4)}
          />
        ) : state === "ready" && !rows.length ? (
          <EmptyState
            className="miu-data-table__feedback-card"
            title={emptyTitle}
            description={emptyDescription}
            onAction={onEmptyAction}
            actionLabel={emptyActionLabel}
            headingLevel={Math.min(level + 1, 4)}
          />
        ) : hasRows ? (
          <table
            className="miu-data-table__table"
            role="table"
            aria-describedby={description ? descriptionId : undefined}
          >
            <caption className="miu-data-display-sr-only">{caption}</caption>
            <colgroup>
              {columns.map((column) => (
                <col
                  key={column.id}
                  style={
                    column.width == null ? undefined : { width: column.width }
                  }
                />
              ))}
            </colgroup>
            <thead
              className={`miu-data-table__head${columns.some((column) => column.sortable) ? " miu-data-table__head--sortable" : ""}`}
              role="rowgroup"
            >
              <tr role="row">
                {columns.map((column) => {
                  const active = selectedSort?.columnId === column.id;
                  const nextDirection =
                    active && selectedSort.direction === "ascending"
                      ? "descending"
                      : "ascending";
                  return (
                    <th
                      key={column.id}
                      id={headerId(column.id)}
                      scope="col"
                      role="columnheader"
                      aria-sort={active ? selectedSort.direction : undefined}
                      className={
                        column.sortable
                          ? "miu-data-table__sortable-header"
                          : undefined
                      }
                    >
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          className="miu-data-table__sort"
                          disabled={typeof onSortChange !== "function"}
                          aria-label={getSortLabel(
                            column.header,
                            nextDirection,
                          )}
                          onClick={() =>
                            onSortChange({
                              columnId: column.id,
                              direction: nextDirection,
                            })
                          }
                        >
                          {column.header}
                          <span
                            className="miu-data-table__sort-hint"
                            aria-hidden="true"
                          >
                            {active ? selectedSort.direction : "Sort"}
                          </span>
                        </Button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {rows.map((row, index) => (
                <tr key={rowIds[index]} role="row">
                  {columns.map((column) => {
                    const Cell = column.rowHeader ? "th" : "td";
                    return (
                      <Cell
                        key={column.id}
                        id={
                          column.rowHeader
                            ? rowHeaderId(rowIds[index])
                            : undefined
                        }
                        scope={column.rowHeader ? "row" : undefined}
                        role={column.rowHeader ? "rowheader" : "cell"}
                        headers={`${headerId(column.id)}${rowHeader && !column.rowHeader ? ` ${rowHeaderId(rowIds[index])}` : ""}`}
                        className={`miu-data-table__cell${column.rowHeader ? " miu-data-table__cell--row-header" : ""}`}
                        data-align={
                          ["end", "center"].includes(column.align)
                            ? column.align
                            : "start"
                        }
                      >
                        <span
                          className="miu-data-table__mobile-label"
                          aria-hidden="true"
                        >
                          {column.header}
                        </span>
                        <div className="miu-data-table__value">
                          {column.render(row)}
                        </div>
                      </Cell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      {hasRows && Boolean(pagination) && (
        <div className="miu-data-table__footer">{pagination}</div>
      )}
    </Card>
  );
}
