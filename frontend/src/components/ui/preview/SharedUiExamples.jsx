import { useRef, useState } from "react";
import Button from "../Button.jsx";
import Card from "../Card.jsx";
import Input from "../Input.jsx";
import Select from "../Select.jsx";
import Textarea from "../Textarea.jsx";
import Checkbox from "../Checkbox.jsx";
import RadioGroup from "../RadioGroup.jsx";
import Modal from "../Modal.jsx";
import Tabs from "../Tabs.jsx";
import Pagination from "../Pagination.jsx";
import Toast from "../Toast.jsx";
import DataTable from "../DataTable.jsx";
import StatCard from "../StatCard.jsx";
import LanguageSwitcher from "../../navigation/LanguageSwitcher.jsx";
import LoadingState from "../../feedback/LoadingState.jsx";
import EmptyState from "../../feedback/EmptyState.jsx";
import ErrorState from "../../feedback/ErrorState.jsx";
import Skeleton from "../Skeleton.jsx";
import ProgressIndicator from "../ProgressIndicator.jsx";

const SAMPLE_ROWS = [
  { id: "preview-brief", name: "Fictional project brief", status: "Draft" },
  { id: "preview-design", name: "Fictional design task", status: "Open" },
  { id: "preview-content", name: "Fictional content task", status: "Complete" },
];
const COLUMNS = [
  {
    id: "name",
    header: "Example",
    rowHeader: true,
    sortable: true,
    render: (row) => row.name,
  },
  { id: "status", header: "Status", render: (row) => row.status },
];

export default function SharedUiExamples() {
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  const [tab, setTab] = useState("overview");
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [sort, setSort] = useState({
    columnId: "name",
    direction: "ascending",
  });
  const [toasts, setToasts] = useState([
    "info",
    "success",
    "warning",
    "error",
    "loading",
  ]);
  const rows = [...SAMPLE_ROWS].sort(
    (a, b) =>
      a.name.localeCompare(b.name) * (sort.direction === "ascending" ? 1 : -1),
  );

  return (
    <>
      <section id="forms" className="space-y-4" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-2xl font-bold">
          Form controls and language selector
        </h2>
        <Card>
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice("Demo form submitted. No record was saved.");
            }}
          >
            <Input
              label="Example name"
              name="name"
              required
              helperText="Try submitting without a name."
            />
            <Input
              label="Error appearance"
              error="This is an example validation message."
              defaultValue="Example value"
            />
            <Select label="Example category" name="category">
              <option>Design</option>
              <option>Development</option>
            </Select>
            <Input
              label="Disabled field"
              disabled
              defaultValue="Unavailable example"
            />
            <Textarea label="Example description" name="description" rows={3} />
            <RadioGroup
              label="Example delivery"
              name="delivery"
              defaultValue="standard"
              options={[
                { value: "standard", label: "Standard" },
                { value: "extended", label: "Extended" },
              ]}
            />
            <Checkbox label="Include the optional example" name="include" />
            <LanguageSwitcher
              value="en"
              options={[
                { value: "en", label: "English", lang: "en", dir: "ltr" },
              ]}
              disabled
              helperText="Language selector appearance. Approved translations are still pending."
            />
            <div>
              <Button type="submit">Try demo form</Button>
            </div>
          </form>
          <p role="status" className="mt-4">
            {notice}
          </p>
        </Card>
      </section>
      <section id="modal" className="space-y-4" aria-labelledby="modal-heading">
        <h2 id="modal-heading" className="text-2xl font-bold">
          Modal dialog
        </h2>
        <Button ref={opener} onClick={() => setOpen(true)}>
          Open example dialog
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Example dialog"
          description="Try Tab, Shift+Tab, Escape, and the close button."
          closeOnBackdrop
          actions={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <Input label="Example dialog input" />
        </Modal>
      </section>
      <section id="tabs" className="space-y-4" aria-labelledby="tabs-heading">
        <h2 id="tabs-heading" className="text-2xl font-bold">
          Tabs and pagination
        </h2>
        <Tabs
          value={tab}
          onValueChange={setTab}
          label="Example sections"
          items={[
            {
              id: "overview",
              label: "Overview",
              content:
                "Use the arrow keys to move between tabs; Enter or Space selects.",
            },
            {
              id: "details",
              label: "Details",
              content: "This is the second example panel.",
            },
            {
              id: "unavailable",
              label: "Disabled",
              disabled: true,
              content: "Unavailable",
            },
          ]}
        />
        <Pagination
          page={page}
          pageCount={SAMPLE_ROWS.length}
          onPageChange={setPage}
          summary={`Example page ${page} of ${SAMPLE_ROWS.length}`}
        />
      </section>
      <section id="data" className="space-y-4" aria-labelledby="data-heading">
        <h2 id="data-heading" className="text-2xl font-bold">
          Table and statistic cards
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Fictional examples" value={3} />
          <StatCard label="Loading appearance" state="loading" />
          <StatCard
            label="Error appearance"
            state="error"
            onRetry={() => setNotice("Example retry requested.")}
          />
        </div>
        <DataTable
          headingLevel={3}
          caption="Fictional records"
          columns={COLUMNS}
          rows={rows.slice(page - 1, page)}
          sort={sort}
          onSortChange={(nextSort) => {
            setSort(nextSort);
            setPage(1);
          }}
          pagination={
            <Pagination
              page={page}
              pageCount={SAMPLE_ROWS.length}
              onPageChange={setPage}
            />
          }
        />
      </section>
      <section
        id="toasts"
        className="space-y-4"
        aria-labelledby="toasts-heading"
      >
        <h2 id="toasts-heading" className="text-2xl font-bold">
          Toast feedback
        </h2>
        <Button
          variant="outline"
          onClick={() =>
            setToasts(["info", "success", "warning", "error", "loading"])
          }
        >
          Reset toast examples
        </Button>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {toasts.map((variant) => (
            <Toast
              key={variant}
              variant={variant}
              message={`${variant} feedback example`}
              description="Fictional component demonstration."
              announcement="off"
              onDismiss={() =>
                setToasts((current) =>
                  current.filter((item) => item !== variant),
                )
              }
            />
          ))}
        </div>
      </section>
      <section
        id="feedback"
        className="space-y-4"
        aria-labelledby="feedback-heading"
      >
        <h2 id="feedback-heading" className="text-2xl font-bold">
          Loading, progress, empty and error states
        </h2>
        <LoadingState message="Static loading appearance example" />
        <Skeleton variant="circle" />
        <ProgressIndicator label="Simulated progress" value={progress} />
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              setProgress((current) => Math.min(100, current + 25))
            }
            disabled={progress === 100}
          >
            Advance 25%
          </Button>
          <Button variant="outline" onClick={() => setProgress(0)}>
            Reset progress
          </Button>
        </div>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <EmptyState
            headingLevel={3}
            title="No fictional records"
            description="Example empty presentation."
          />
          <ErrorState
            headingLevel={3}
            title="Example recoverable error"
            description="No request has failed; this is a presentation example."
            onRetry={() => setNotice("Example retry requested.")}
          />
        </div>
      </section>
    </>
  );
}
