import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { orderStore } from "../orders/orderStore.js";
import { serviceStore } from "./serviceStore.js";
import { useServiceData } from "./useServiceData.js";
import {
  serviceFormValues,
  validateService,
  newPackageRow,
  newExtraRow,
  featureLines,
} from "./serviceFormModel.js";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import ServicePackageComparison from "./ServicePackageComparison.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import "../projects/project-create.css";
import "./service-manage.css";

function Editor({ service, data, session }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => serviceFormValues(service, data));
  const [submissionId] = useState(() => crypto.randomUUID());
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const heading = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [preview]);
  useEffect(() => {
    if (Object.keys(errors).length) {
      const target =
        form.current?.querySelector('[aria-invalid="true"]') ??
        form.current?.querySelector('[role="alert"]');
      target?.focus();
    }
  }, [errors]);
  function check(event) {
    event.preventDefault();
    const next = validateService(values);
    setErrors(next);
    if (!Object.keys(next).length) setPreview(true);
  }
  function save() {
    const result = serviceStore.save(
      values,
      session,
      service?.id,
      submissionId,
    );
    if (!result.ok) {
      setErrors(result.errors);
      setPreview(false);
      return;
    }
    navigate("/student/services", {
      state: {
        serviceNotice:
          "Service saved — simulation. Publish a draft from My services when ready.",
      },
    });
  }
  const field = (name, label, value, onChange, props = {}) => ({
    name,
    id: `service-${name}`,
    label,
    value,
    onChange,
    required: true,
    error: errors[name],
    ...props,
  });
  const mainField = (name, label, props) =>
    field(
      name,
      label,
      values[name],
      (event) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
      props,
    );
  const rowField = (group, index, name, label, props) =>
    field(
      `${group}.${index}.${name}`,
      label,
      values[group][index][name],
      (event) =>
        setValues((current) => ({
          ...current,
          [group]: current[group].map((row, i) =>
            i === index ? { ...row, [name]: event.target.value } : row,
          ),
        })),
      props,
    );
  const removeRow = (group, index) =>
    setValues((current) => ({
      ...current,
      [group]: current[group].filter((_, i) => i !== index),
    }));
  const previewPackages = preview
    ? values.packages
        .map((pack) => ({
          ...pack,
          includedFeatures: featureLines(pack.includedFeatures),
          priceEGP: Number(pack.priceEGP),
          deliveryDays: Number(pack.deliveryDays),
        }))
        .sort(
          (a, b) =>
            a.priceEGP - b.priceEGP ||
            a.deliveryDays - b.deliveryDays ||
            a.id.localeCompare(b.id),
        )
    : [];
  return (
    <main className="project-create service-manage">
      <header className="project-create__header">
        <Link to="/student/services">My services</Link>
        <Link to="/services">Public catalogue</Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">YOUR CRAFT, CLEARLY DEFINED</p>
          <h1 ref={heading} tabIndex={-1}>
            {preview
              ? "See it take shape."
              : service
                ? "Refine your service."
                : "Make your skills"}
            <br />
            <em>
              {preview
                ? "Before it goes live."
                : service
                  ? "Keep your edge."
                  : "a service worth choosing."}
            </em>
          </h1>
          <p>
            {preview
              ? "Private preview. Nothing is published or ordered by viewing this screen."
              : "Define your scope, packages and optional extras. Keep every promise clear."}
          </p>
        </div>
      </section>
      <div className="project-create__container service-manage__body">
        <p className="service-manage__disclosure">
          Fictional demo only. Save requires a complete service and at least one
          valid package. New saves are private drafts. Unsaved values clear when
          leaving or switching account; all saved changes reset on refresh.
          Publishing requires approved student verification.
        </p>
        {preview ? (
          <section className="project-create__panel service-manage__preview">
            <p className="project-create__eyebrow">
              PRIVATE PREVIEW — NOT A PUBLICATION
            </p>
            <h2>{values.title}</h2>
            <p className="service-manage__description">{values.description}</p>
            <p>
              {session.user.displayName} ·{" "}
              {
                data.categories.find(({ id }) => id === values.categoryId)
                  ?.label
              }
            </p>
            <ServicePackageComparison packages={previewPackages} />
            <h3>Optional extras</h3>
            {values.extras.length ? (
              <ul>
                {values.extras.map((extra) => (
                  <li key={extra.id}>
                    <strong>{extra.title}</strong> —{" "}
                    {formatEGP(Number(extra.additionalPriceEGP))}, +
                    {extra.additionalDays} days<p>{extra.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No extras included.</p>
            )}
            <div className="project-create__success-links">
              <Button variant="outline" onClick={() => setPreview(false)}>
                Continue editing
              </Button>
              <Button onClick={save}>
                {service ? "Save service changes" : "Save private draft"}
              </Button>
            </div>
          </section>
        ) : (
          <form ref={form} noValidate onSubmit={check}>
            {Object.keys(errors).length > 0 && (
              <p role="alert" tabIndex={-1} className="project-create__alert">
                {errors.form ??
                  "Check the highlighted fields and package/extra information."}
              </p>
            )}
            <section className="project-create__panel service-manage__fields">
              <h2>Service essentials</h2>
              <Input
                {...mainField("title", "Service title", { maxLength: 120 })}
              />
              <Textarea
                {...mainField("description", "Description and scope", {
                  rows: 6,
                  maxLength: 3000,
                })}
              />
              <Select {...mainField("categoryId", "Category")}>
                <option value="">Choose category</option>
                {data.categories.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
              <fieldset>
                <legend>Relevant skills (required)</legend>
                <div className="service-manage__skills">
                  {data.skills.map(({ id, label }, index) => (
                    <Checkbox
                      key={id}
                      name="skillIds"
                      label={label}
                      checked={values.skillIds.includes(id)}
                      error={index === 0 ? errors.skillIds : undefined}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          skillIds: event.target.checked
                            ? [...current.skillIds, id]
                            : current.skillIds.filter((skill) => skill !== id),
                        }))
                      }
                    />
                  ))}
                </div>
              </fieldset>
            </section>
            <section
              className="project-create__panel service-manage__fields"
              aria-labelledby="package-editor-title"
            >
              <div className="service-manage__section-heading">
                <div>
                  <h2 id="package-editor-title">Service packages</h2>
                  <p>
                    Define at least one complete option. These names and scopes
                    are yours, not fixed platform tiers.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      packages: [...current.packages, newPackageRow()],
                    }))
                  }
                >
                  Add package
                </Button>
              </div>
              {errors.packages && (
                <p role="alert" className="project-create__alert">
                  {errors.packages}
                </p>
              )}
              {values.packages.map((pack, index) => (
                <fieldset className="service-manage__row" key={pack.id}>
                  <legend>Package {index + 1}</legend>
                  <Input
                    {...rowField("packages", index, "name", "Package name", {
                      maxLength: 120,
                    })}
                  />
                  <Textarea
                    {...rowField(
                      "packages",
                      index,
                      "description",
                      "Package scope",
                      { rows: 3, maxLength: 2000 },
                    )}
                  />
                  <Textarea
                    {...rowField(
                      "packages",
                      index,
                      "includedFeatures",
                      "Included deliverables",
                      {
                        rows: 3,
                        helperText: "One deliverable per line.",
                        maxLength: 3000,
                      },
                    )}
                  />
                  <div className="project-create__field-row">
                    <Input
                      {...rowField(
                        "packages",
                        index,
                        "priceEGP",
                        "Package price (EGP)",
                        { inputMode: "decimal" },
                      )}
                    />
                    <Input
                      {...rowField(
                        "packages",
                        index,
                        "deliveryDays",
                        "Delivery estimate (days)",
                        { inputMode: "numeric" },
                      )}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeRow("packages", index)}
                  >
                    Remove package {index + 1}
                  </Button>
                </fieldset>
              ))}
            </section>
            <section
              className="project-create__panel service-manage__fields"
              aria-labelledby="extra-editor-title"
            >
              <div className="service-manage__section-heading">
                <div>
                  <h2 id="extra-editor-title">Optional extras</h2>
                  <p>
                    Additional scope and time. Leave this empty when no extras
                    are offered.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      extras: [...current.extras, newExtraRow()],
                    }))
                  }
                >
                  Add extra
                </Button>
              </div>
              {errors.extras && (
                <p role="alert" className="project-create__alert">
                  {errors.extras}
                </p>
              )}
              {values.extras.map((extra, index) => (
                <fieldset className="service-manage__row" key={extra.id}>
                  <legend>Extra {index + 1}</legend>
                  <Input
                    {...rowField("extras", index, "title", "Extra name", {
                      maxLength: 120,
                    })}
                  />
                  <Textarea
                    {...rowField(
                      "extras",
                      index,
                      "description",
                      "Extra scope",
                      { rows: 3, maxLength: 2000 },
                    )}
                  />
                  <div className="project-create__field-row">
                    <Input
                      {...rowField(
                        "extras",
                        index,
                        "additionalPriceEGP",
                        "Additional price (EGP)",
                        { inputMode: "decimal" },
                      )}
                    />
                    <Input
                      {...rowField(
                        "extras",
                        index,
                        "additionalDays",
                        "Additional days",
                        { inputMode: "numeric" },
                      )}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeRow("extras", index)}
                  >
                    Remove extra {index + 1}
                  </Button>
                </fieldset>
              ))}
            </section>
            <div className="project-create__actions">
              <Link to="/student/services">Discard unsaved changes</Link>
              <Button type="submit">Preview service</Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ServiceForm() {
  const { serviceId } = useParams();
  const { session } = useAuth();
  const data = useServiceData();
  useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const service = serviceId ? serviceStore.findOwned(serviceId, session) : null;
  const error = serviceId ? serviceStore.editError(serviceId, session) : null;
  if (error)
    return (
      <main className="project-create">
        <div className="project-create__container service-manage__recovery">
          <h1>Service unavailable for editing</h1>
          <p>{error}</p>
          <Link to="/student/services">Return to My services</Link>
        </div>
      </main>
    );
  return (
    <Editor
      key={`${session.user.id}:${serviceId ?? "new"}`}
      service={service}
      data={data}
      session={session}
    />
  );
}
