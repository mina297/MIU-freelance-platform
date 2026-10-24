import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { ownsProfile } from "./utils/profileOwnership.js";
import {
  clientProfiles,
  studentProfiles,
} from "../../data/fixtures/profiles.js";
import {
  DEFAULT_CLIENT_PROFILE_ID,
  DEFAULT_STUDENT_PROFILE_ID,
} from "./constants.js";
import FileUploadField from "./components/FileUploadField.jsx";
import { getProfileEdit, saveProfileEdit } from "./utils/profileEditStorage.js";
import { resolveExternalLink } from "./utils/safeExternalUrl.js";

export default function ProfileEditPage(props) {
  const { session } = useAuth();
  const role = props.role ?? session.user?.role;
  const profileId = props.profileId ?? session.user?.id;
  if (!ownsProfile(session, profileId, role))
    return (
      <p role="alert">Only the active profile owner can edit this profile.</p>
    );
  return (
    <ProfileEditor
      {...props}
      key={`${profileId}:${role}`}
      profileId={profileId}
      role={role}
      session={session}
    />
  );
}

function buildLinkRecord(id, type, label, raw) {
  const resolved = resolveExternalLink(raw);
  return {
    id,
    type,
    label,
    urlDisplay: resolved.display || String(raw).trim(),
    href: resolved.href || resolved.display,
  };
}

const SKILL_SUGGESTIONS = [
  "Branding",
  "Figma",
  "Illustration",
  "React",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "UI Design",
];

/**
 * @param {object} profile
 */
function buildInitialForm(profile) {
  return {
    displayName: profile.displayName ?? "",
    headline: profile.headline ?? "",
    shortBio: profile.shortBio ?? "",
    aboutText: (profile.aboutParagraphs ?? []).join("\n\n"),
    skillsText: (profile.skills ?? []).join(", "),
    availability: profile.availability ?? "",
    location: profile.location ?? "",
    languagesText: (profile.languages ?? []).join(", "),
    rateEGP:
      profile.rateEGP === null || profile.rateEGP === undefined
        ? ""
        : String(profile.rateEGP),
    organizationName: profile.organizationName ?? "",
    github: profile.links?.find((l) => l.type === "github")?.urlDisplay ?? "",
    linkedin:
      profile.links?.find((l) => l.type === "linkedin")?.urlDisplay ?? "",
    portfolio:
      profile.links?.find((l) => l.type === "portfolio" || l.type === "website")
        ?.urlDisplay ?? "",
    profileImage: profile.profileImage || "",
  };
}

/**
 * @param {ReturnType<typeof buildInitialForm>} form
 * @param {'student' | 'client'} role
 */
function validateEditForm(form, role) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!form.displayName.trim())
    errors.displayName = "Display name is required.";
  if (!form.shortBio.trim() || form.shortBio.trim().length < 20) {
    errors.shortBio = "Write a short bio of at least 20 characters.";
  }
  if (role === "student") {
    if (!form.skillsText.trim()) errors.skillsText = "Add at least one skill.";
    if (!form.availability.trim()) {
      errors.availability = "Availability is required for student profiles.";
    }
    if (
      form.rateEGP !== "" &&
      (!/^\d+(\.\d{1,2})?$/.test(form.rateEGP) ||
        Number(form.rateEGP) <= 0 ||
        Number(form.rateEGP) > Number.MAX_SAFE_INTEGER / 100)
    ) {
      errors.rateEGP = "Rate must be a number in EGP.";
    }
  }
  if (role === "client" && !form.organizationName.trim()) {
    errors.organizationName = "Organization name is required.";
  }
  return errors;
}

/**
 * Edit Profile page with simulated sessionStorage persistence.
 * Expected route: `/profile/edit`
 *
 * Does not modify AuthProvider — profile id/role are passed as props
 * (or chosen in the Member 5 preview shell).
 *
 * @param {{
 *   profileId?: string,
 *   role?: 'student' | 'client',
 *   onCancel?: () => void,
 *   onSaved?: (profileId: string) => void,
 * }} props
 */
function ProfileEditor({
  profileId,
  role = "student",
  onCancel,
  onSaved,
  session,
}) {
  const resolvedId =
    profileId ||
    (role === "client"
      ? DEFAULT_CLIENT_PROFILE_ID
      : DEFAULT_STUDENT_PROFILE_ID);

  const baseProfile = useMemo(() => {
    const list = role === "client" ? clientProfiles : studentProfiles;
    return list.find((p) => p.id === resolvedId) ?? null;
  }, [role, resolvedId]);

  const initial = useMemo(() => {
    if (!baseProfile) return null;
    const overrides = getProfileEdit(resolvedId);
    return buildInitialForm({ ...baseProfile, ...(overrides ?? {}) });
  }, [baseProfile, resolvedId]);

  const [form, setForm] = useState(initial);
  const [photoPreview, setPhotoPreview] = useState(initial?.profileImage || "");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!baseProfile || !form) {
    return (
      <div className="w-full bg-surface-page px-5 py-8 md:px-[120px]">
        <div
          className="rounded-panel border border-border-soft bg-white p-8 text-center"
          role="alert"
        >
          <h1 className="text-xl font-semibold text-miu-black">
            Profile not found
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Cannot edit <span className="font-medium">{resolvedId}</span>.
          </p>
        </div>
      </div>
    );
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancel() {
    setForm(initial);
    setPhotoPreview(initial.profileImage || "");
    setErrors({});
    setStatus("idle");
    setMessage("");
    onCancel?.();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateEditForm(form, role);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setMessage("Fix the highlighted fields before saving.");
      return;
    }

    setStatus("saving");
    try {
      const skills = form.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const languages = form.languagesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const aboutParagraphs = form.aboutText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      const links = [];
      if (form.github.trim()) {
        links.push(
          buildLinkRecord(
            `link_${resolvedId}_github`,
            "github",
            "GitHub",
            form.github,
          ),
        );
      }
      if (form.linkedin.trim()) {
        links.push(
          buildLinkRecord(
            `link_${resolvedId}_linkedin`,
            "linkedin",
            "LinkedIn",
            form.linkedin,
          ),
        );
      }
      if (form.portfolio.trim()) {
        links.push(
          buildLinkRecord(
            `link_${resolvedId}_portfolio`,
            role === "client" ? "website" : "portfolio",
            role === "client" ? "Website" : "Portfolio",
            form.portfolio,
          ),
        );
      }

      /** @type {Record<string, unknown>} */
      const patch = {
        displayName: form.displayName.trim(),
        headline: form.headline.trim(),
        shortBio: form.shortBio.trim(),
        aboutParagraphs,
        location: form.location.trim(),
        links,
        profileImage:
          form.profileImage || photoPreview || baseProfile.profileImage,
        profileImageAlt: `Profile photo of ${form.displayName.trim()}`,
      };

      if (role === "student") {
        patch.firstName =
          form.displayName.trim().split(" ")[0] || form.displayName.trim();
        patch.skills = skills.length ? skills : baseProfile.skills;
        patch.availability = form.availability.trim();
        patch.languages = languages;
        patch.rateEGP = form.rateEGP === "" ? null : Number(form.rateEGP);
      } else {
        patch.organizationName = form.organizationName.trim();
      }

      saveProfileEdit(resolvedId, patch, session);
      setStatus("success");
      setMessage(
        "Profile saved in this browser session only (Phase 1 simulated persistence).",
      );
      onSaved?.(resolvedId);
    } catch {
      setStatus("error");
      setMessage(
        "Could not save profile changes. Browser storage may be full or unavailable. Your changes are still here; try a smaller image or retry.",
      );
    }
  }

  return (
    <div className="w-full bg-surface-page">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
            Simulated Phase 1 workflow
          </p>
          <h1 className="mt-1 text-2xl font-bold text-miu-black">
            Edit profile
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Editing {role} profile{" "}
            <span className="font-medium">{resolvedId}</span>. Changes stay in
            sessionStorage until the tab is cleared.
          </p>
        </div>

        <form
          className="space-y-5 rounded-panel border border-border-soft bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <FileUploadField
            label="Profile photo"
            hint="PNG or JPG · max 2 MB · preview only"
            accept="image/*"
            maxFiles={1}
            maxBytes={2_000_000}
            imagesOnly
            error={errors.profileImage}
            value={
              photoPreview
                ? [
                    {
                      id: "profile-photo",
                      name: "Profile photo",
                      previewUrl: photoPreview,
                    },
                  ]
                : []
            }
            onChange={(files) => {
              const next = files[0]?.previewUrl || "";
              setPhotoPreview(next);
              updateField("profileImage", next);
              setErrors((prev) => {
                const copy = { ...prev };
                delete copy.profileImage;
                return copy;
              });
            }}
          />

          <Field
            id="displayName"
            label="Display name"
            value={form.displayName}
            error={errors.displayName}
            onChange={(v) => updateField("displayName", v)}
          />

          {role === "client" ? (
            <Field
              id="organizationName"
              label="Organization"
              value={form.organizationName}
              error={errors.organizationName}
              onChange={(v) => updateField("organizationName", v)}
            />
          ) : null}

          <Field
            id="headline"
            label="Headline"
            value={form.headline}
            onChange={(v) => updateField("headline", v)}
          />

          <TextArea
            id="shortBio"
            label="Short bio"
            value={form.shortBio}
            error={errors.shortBio}
            onChange={(v) => updateField("shortBio", v)}
            rows={3}
          />

          <TextArea
            id="aboutText"
            label="About (separate paragraphs with a blank line)"
            value={form.aboutText}
            onChange={(v) => updateField("aboutText", v)}
            rows={5}
          />

          {role === "student" ? (
            <>
              <Field
                id="skillsText"
                label="Skills (comma-separated)"
                value={form.skillsText}
                error={errors.skillsText}
                onChange={(v) => updateField("skillsText", v)}
              />
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-miu-black hover:bg-miu-red-tint"
                    onClick={() => {
                      const current = form.skillsText
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (!current.includes(skill)) {
                        updateField(
                          "skillsText",
                          [...current, skill].join(", "),
                        );
                      }
                    }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
              <Field
                id="availability"
                label="Availability"
                value={form.availability}
                error={errors.availability}
                onChange={(v) => updateField("availability", v)}
              />
              <Field
                id="rateEGP"
                label="Indicative rate (EGP)"
                value={form.rateEGP}
                error={errors.rateEGP}
                onChange={(v) => updateField("rateEGP", v)}
                inputMode="numeric"
              />
              <Field
                id="languagesText"
                label="Languages (comma-separated)"
                value={form.languagesText}
                onChange={(v) => updateField("languagesText", v)}
              />
            </>
          ) : null}

          <Field
            id="location"
            label="Location"
            value={form.location}
            onChange={(v) => updateField("location", v)}
          />

          <Field
            id="github"
            label="GitHub URL"
            value={form.github}
            onChange={(v) => updateField("github", v)}
            placeholder="https://github.com/your-handle"
          />
          <Field
            id="linkedin"
            label="LinkedIn URL"
            value={form.linkedin}
            onChange={(v) => updateField("linkedin", v)}
            placeholder="https://linkedin.com/in/your-handle"
          />
          <Field
            id="portfolio"
            label={role === "client" ? "Website URL" : "Portfolio URL"}
            value={form.portfolio}
            onChange={(v) => updateField("portfolio", v)}
            placeholder="https://your-site.example (demo .example stays non-clickable)"
          />
          <p className="text-xs text-ink-secondary">
            Safe http(s) links open in a new tab. Domains ending in{" "}
            <span className="font-medium">.example</span> are treated as
            demo-only.
          </p>

          {message ? (
            <p
              className={`text-sm ${status === "error" ? "text-danger" : "text-success"}`}
              role="status"
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="h-11 rounded-full border border-border-soft px-5 text-sm font-semibold text-miu-black"
              disabled={status === "saving"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-full bg-miu-red px-5 text-sm font-semibold text-white hover:bg-miu-red-dark disabled:opacity-60"
              disabled={status === "saving"}
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange, error, inputMode, placeholder }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-miu-black">
        {label}
      </label>
      <input
        id={id}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border-soft px-3 text-sm text-miu-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
      />
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({ id, label, value, onChange, error, rows = 4 }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-miu-black">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm text-miu-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
      />
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
