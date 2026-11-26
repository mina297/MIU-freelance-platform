import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { createMockAuthStore } from "../features/auth/mockAuth.js";
import {
  createRegistrationProfile,
  getRegistrationProfile,
} from "../features/profiles/registrationProfiles.js";
import {
  getRouteAccess,
  INITIAL_SESSION,
  ROLES,
} from "../features/auth/session.js";
import { routeConfig } from "../app/routeConfig.js";
import { getRegistrationDestination } from "../features/auth/navigation.js";
import {
  filterProfileWorkCategories,
  profileWorkCategories,
} from "../features/profiles/profileWorkCategories.js";
import { translate } from "../i18n/translate.js";
import {
  getProfileSetupDraft,
  saveProfileSetupDraft,
  canContinueProfileSetup,
} from "../features/profiles/profileSetupDraft.js";

test("work categories support the reference list and search in either language", () => {
  assert.equal(profileWorkCategories.length, 12);
  assert.equal(
    new Set(profileWorkCategories.map((category) => category.id)).size,
    12,
  );
  assert.deepEqual(
    filterProfileWorkCategories("  SOFTWARE ").map(({ id }) => id),
    ["web_development"],
  );
  assert.deepEqual(
    filterProfileWorkCategories("المحاسبة", (label) =>
      translate("ar", label),
    ).map(({ id }) => id),
    ["accounting_consulting"],
  );
  assert.equal(filterProfileWorkCategories(" ").length, 12);
  assert.deepEqual(filterProfileWorkCategories("astronaut"), []);
});

test("work selection requires a completed start step and persists only listed category IDs", () => {
  assert.equal(canContinueProfileSetup(null), false);
  assert.equal(canContinueProfileSetup({ method: "manual" }), true);
  assert.equal(canContinueProfileSetup({ method: "resume" }), false);
  assert.equal(
    canContinueProfileSetup({
      method: "linkedin",
      resume: { name: "resume.docx", size: 10 },
    }),
    false,
  );
  assert.equal(
    canContinueProfileSetup({
      method: "linkedin",
      resume: { name: "profile.pdf", size: 10 },
    }),
    true,
  );
  const session = {
    status: "authenticated",
    user: createMockAuthStore().register(values).user,
  };
  saveProfileSetupDraft(session, {
    method: "manual",
    categoryId: "graphic_design",
    scrollY: 130,
    workScrollY: 260,
  });
  assert.equal(getProfileSetupDraft(session).categoryId, "graphic_design");
  saveProfileSetupDraft(session, { categoryId: "accounting_consulting" });
  assert.equal(
    getProfileSetupDraft(session).categoryId,
    "accounting_consulting",
  );
  saveProfileSetupDraft(session, { categoryId: "graphic_design" });
  saveProfileSetupDraft(session, { workScrollY: 300 });
  assert.equal(getProfileSetupDraft(session).categoryId, "graphic_design");
  assert.equal(getProfileSetupDraft(session).scrollY, 130);
  assert.equal(getProfileSetupDraft(session).workScrollY, 300);
  saveProfileSetupDraft(session, { categoryId: "unlisted-category" });
  assert.equal(getProfileSetupDraft(session).categoryId, "");
  const workRoute = routeConfig.find(
    (route) => route.path === "/profile/setup/work",
  );
  assert.equal(workRoute.showInNavigation, false);
  for (const role of Object.values(ROLES)) {
    assert.equal(
      getRouteAccess(
        { ...session, user: { ...session.user, role } },
        workRoute,
      ),
      role === ROLES.STUDENT ? "allowed" : "denied",
    );
  }
});

test("setup drafts restore selection, validation and scroll only within the same active student session", () => {
  const user = createMockAuthStore().register(values).user;
  const session = { status: "authenticated", user };
  assert.equal(getProfileSetupDraft(session), null);
  saveProfileSetupDraft(session, {
    method: "resume",
    resume: { name: "fictional.pdf", size: 400, contents: "never retained" },
    scrollY: 475,
  });
  const restored = getProfileSetupDraft({ ...session });
  assert.equal(restored.method, "resume");
  assert.equal(restored.scrollY, 475);
  assert.deepEqual(restored.resume, { name: "fictional.pdf", size: 400 });
  assert.ok(Object.isFrozen(restored));
  saveProfileSetupDraft(session, { scrollY: 290 });
  assert.equal(getProfileSetupDraft(session).resume.name, "fictional.pdf");
  saveProfileSetupDraft(session, {
    resume: null,
    resumeError: "Your resume must be 5MB or smaller.",
  });
  assert.equal(getProfileSetupDraft(session).resume, null);
  assert.equal(getProfileSetupDraft(session).scrollY, 290);
  assert.equal(
    getProfileSetupDraft(session).resumeError,
    "Your resume must be 5MB or smaller.",
  );
  saveProfileSetupDraft(session, { method: "manual", scrollY: -4 });
  assert.equal(getProfileSetupDraft(session).resumeError, "");
  assert.equal(getProfileSetupDraft(session).scrollY, 0);
  assert.equal(
    getProfileSetupDraft({ ...session, user: { ...user } }),
    null,
    "new sign-in must not inherit an earlier session's draft",
  );
  for (const denied of [
    INITIAL_SESSION,
    { status: "expired", user },
    { ...session, user: { ...user, role: ROLES.CLIENT } },
    { ...session, user: { ...user, accountStatus: "suspended" } },
  ]) {
    assert.equal(
      saveProfileSetupDraft(denied, { method: "resume" }),
      undefined,
    );
    assert.equal(getProfileSetupDraft(denied), null);
  }
});
import {
  selectResume,
  MAX_RESUME_BYTES,
} from "../features/profiles/resumeSelection.js";

test("LinkedIn selection accepts only a nonempty PDF and restores its metadata within the student session", () => {
  const file = {
    name: "LinkedIn-profile.PDF",
    size: MAX_RESUME_BYTES,
    contents: "not retained",
  };
  assert.deepEqual(selectResume([file], { pdfOnly: true }).file, {
    name: file.name,
    size: file.size,
  });
  for (const invalid of [
    { name: "profile.doc", size: 100 },
    { name: "profile.docx", size: 100 },
    { name: "profile.pdf", size: 0 },
    { name: "profile.pdf", size: MAX_RESUME_BYTES + 1 },
  ])
    assert.ok(selectResume([invalid], { pdfOnly: true }).error);
  const session = {
    status: "authenticated",
    user: createMockAuthStore().register(values).user,
  };
  saveProfileSetupDraft(session, {
    method: "linkedin",
    resume: file,
    scrollY: 300,
  });
  assert.equal(getProfileSetupDraft(session).method, "linkedin");
  assert.deepEqual(getProfileSetupDraft(session).resume, {
    name: file.name,
    size: file.size,
  });
  saveProfileSetupDraft(session, {
    resume: { name: "profile.docx", size: 100 },
  });
  assert.equal(getProfileSetupDraft(session).resume, null);
});

test("resume selection enforces one nonempty PDF/Word file up to 5MB without retaining contents", () => {
  for (const name of ["resume.pdf", "resume.DOC", "resume.docx"]) {
    const selected = selectResume([
      {
        name,
        size: MAX_RESUME_BYTES,
        contents: "private",
        type: "application/pdf",
      },
    ]);
    assert.deepEqual(selected, { file: { name, size: MAX_RESUME_BYTES } });
  }
  for (const files of [
    [],
    [
      { name: "a.pdf", size: 1 },
      { name: "b.doc", size: 1 },
    ],
    [{ name: "resume.exe", size: 12 }],
    [{ name: "resume.pdf.exe", size: 12 }],
    [{ name: "resume.pdf", size: 0 }],
    [{ name: "resume.pdf", size: MAX_RESUME_BYTES + 1 }],
  ]) {
    assert.ok(selectResume(files).error);
    assert.equal(selectResume(files).file, undefined);
  }
});

const values = {
  firstName: "Test",
  lastName: "Student",
  email: "test@miuegypt.edu.eg",
  password: "Fictional123",
  confirmPassword: "Fictional123",
  country: "Egypt",
  acceptTerms: true,
  role: ROLES.STUDENT,
};

test("new accounts get unique IDs across app instances and empty public profile shells", () => {
  const first = createMockAuthStore().register(values).user;
  const second = createMockAuthStore().register(values).user;
  assert.notEqual(
    first.id,
    second.id,
    "refresh must not reuse another account's stored profile edits",
  );
  const profile = createRegistrationProfile({
    ...first,
    password: "private",
    email: "private@example.test",
  });
  assert.equal(profile.id, first.id);
  assert.equal(profile.displayName, "Test Student");
  assert.equal(profile.verified, false);
  assert.equal(profile.completedJobsCount, 0);
  assert.deepEqual(profile.skills, []);
  assert.equal(profile.ratingSummary.count, 0);
  assert.equal(profile.email, undefined);
  assert.equal(profile.password, undefined);
  assert.equal(getRegistrationProfile(first.id, "client"), null);
  assert.equal(getRegistrationProfile(second.id, "student"), null);
  assert.equal(
    createRegistrationProfile({ ...first, role: ROLES.SUPER_ADMIN }),
    undefined,
  );
  assert.equal(
    createRegistrationProfile({ ...second, accountStatus: "suspended" }),
    undefined,
  );
});

test("profile setup is restricted to active students and excluded from menus", () => {
  const route = routeConfig.find((item) => item.path === "/profile/setup");
  assert.equal(route.showInNavigation, false);
  assert.equal(getRouteAccess(INITIAL_SESSION, route), "login");
  for (const role of Object.values(ROLES)) {
    const session = {
      status: "authenticated",
      user: { id: "test", displayName: "Test", role, accountStatus: "active" },
    };
    assert.equal(
      getRouteAccess(session, route),
      role === ROLES.STUDENT ? "allowed" : "denied",
    );
    assert.equal(
      getRouteAccess(
        { ...session, user: { ...session.user, accountStatus: "suspended" } },
        route,
      ),
      "denied",
    );
  }
});

test("email and Google registration send only students to setup; clients return home", () => {
  for (const role of [ROLES.STUDENT, ROLES.CLIENT]) {
    for (const method of ["register", "registerGoogle"]) {
      const result = createMockAuthStore()[method]({ ...values, role });
      assert.equal(result.ok, true);
      const destination = getRegistrationDestination(result.user);
      assert.equal(
        destination,
        role === ROLES.STUDENT ? "/profile/setup" : "/",
      );
      const route = routeConfig.find((entry) => entry.path === destination);
      assert.equal(
        getRouteAccess({ status: "authenticated", user: result.user }, route),
        "allowed",
      );
    }
  }
});

test("setup, editor and public profiles render for newly registered owners without invented history", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { default: Setup } = await vite.ssrLoadModule(
      "/src/features/profiles/ProfileSetupPage.jsx",
    );
    const { default: ProtectedRoute } = await vite.ssrLoadModule(
      "/src/features/auth/ProtectedRoute.jsx",
    );
    const { default: Editor } = await vite.ssrLoadModule(
      "/src/features/profiles/ProfileEditPage.jsx",
    );
    const { default: Work } = await vite.ssrLoadModule(
      "/src/features/profiles/ProfileWorkPage.jsx",
    );
    const { default: Progress } = await vite.ssrLoadModule(
      "/src/features/profiles/ProfileSetupProgress.jsx",
    );
    for (const currentStep of [1, 2, 3, 4]) {
      const progress = renderToStaticMarkup(
        React.createElement(Progress, { currentStep }),
      );
      assert.equal(
        (progress.match(/data-completed="true"/g) ?? []).length,
        currentStep - 1,
      );
      assert.equal((progress.match(/aria-current="step"/g) ?? []).length, 1);
      assert.match(
        progress,
        new RegExp(
          `aria-current="step"><span class="profile-setup__step-number">${currentStep}</span>`,
        ),
      );
    }
    const { saveProfileSetupDraft: saveDraft } = await vite.ssrLoadModule(
      "/src/features/profiles/profileSetupDraft.js",
    );
    const { default: ResumeUpload } = await vite.ssrLoadModule(
      "/src/features/profiles/ResumeUpload.jsx",
    );
    const upload = renderToStaticMarkup(
      React.createElement(ResumeUpload, {
        value: { name: "fictional<script>.pdf", size: 100 },
        onChange() {},
      }),
    );
    assert.match(upload, /type="file"/);
    assert.match(upload, /accept="\.pdf,\.doc,\.docx/);
    assert.match(upload, /Max file size: 5MB/);
    assert.match(upload, /Supported file types: PDF, DOC, DOCX/);
    assert.match(upload, /fictional&lt;script&gt;\.pdf/);
    assert.match(upload, /Remove file/);
    assert.match(upload, /Your file stays on this device/);
    const { default: Modal } = await vite.ssrLoadModule(
      "/src/components/ui/Modal.jsx",
    );
    const mobileUpload = renderToStaticMarkup(
      React.createElement(
        Modal,
        {
          open: true,
          onClose() {},
          title: "Upload resume",
          className: "profile-resume-sheet",
          closeOnBackdrop: true,
        },
        React.createElement(ResumeUpload, {
          compact: true,
          value: null,
          onChange() {},
          onError() {},
          error: "Your resume must be 5MB or smaller.",
        }),
      ),
    );
    assert.match(mobileUpload, /<dialog[^>]*profile-resume-sheet/);
    assert.match(mobileUpload, /aria-modal="true"/);
    assert.match(mobileUpload, /aria-label="Close dialog"/);
    assert.match(mobileUpload, /Choose a file/);
    assert.match(mobileUpload, /type="file"/);
    assert.match(mobileUpload, /Max file size: 5MB/);
    assert.match(mobileUpload, /Supported file types: PDF, DOC, DOCX/);
    assert.match(mobileUpload, /aria-invalid="true"/);
    assert.match(mobileUpload, /Your resume must be 5MB or smaller/);
    assert.doesNotMatch(mobileUpload, /Drag or|profile-resume__dropzone|<h3/);
    for (const compact of [false, true]) {
      const linkedin = renderToStaticMarkup(
        React.createElement(ResumeUpload, {
          source: "linkedin",
          compact,
          value: null,
          onChange() {},
          onError() {},
        }),
      );
      assert.match(
        linkedin,
        /Save your LinkedIn profile as a PDF, then add the file here/,
      );
      assert.match(linkedin, /accept="\.pdf,application\/pdf"/);
      assert.match(linkedin, /Supported file type: PDF/);
      assert.doesNotMatch(linkedin, /\.doc|DOCX|type="password"|type="url"/);
      assert.match(
        linkedin,
        compact ? /Choose a file/ : /Upload LinkedIn profile/,
      );
    }
    const { createRegistrationProfile: create } = await vite.ssrLoadModule(
      "/src/features/profiles/registrationProfiles.js",
    );
    const { getStudentProfileById } = await vite.ssrLoadModule(
      "/src/features/profiles/utils/getStudentProfile.js",
    );
    const { getClientProfileById } = await vite.ssrLoadModule(
      "/src/features/profiles/utils/getClientProfile.js",
    );
    for (const role of ["student", "client"]) {
      const user = createMockAuthStore().register({ ...values, role }).user;
      create(user);
      const session = { status: "authenticated", user };
      const render = (component) =>
        renderToStaticMarkup(
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(
              AuthContext.Provider,
              { value: { session } },
              component === Setup
                ? React.createElement(
                    ProtectedRoute,
                    {
                      route: routeConfig.find(
                        (route) => route.path === "/profile/setup",
                      ),
                    },
                    React.createElement(component),
                  )
                : React.createElement(component),
            ),
          ),
        );
      const html = render(Setup);
      if (role === "student") {
        assert.match(html, /aria-current="step"/);
        assert.match(html, /<input(?![^>]*disabled)[^>]*value="resume"/);
        assert.match(html, /<input(?![^>]*disabled)[^>]*value="linkedin"/);
        assert.match(html, /type="submit" disabled/);
        assert.match(html, /Fill out manually/);
        assert.doesNotMatch(html, /Not connected|Ready to start/);
      } else {
        assert.doesNotMatch(
          html,
          /profile-setup|Fill out manually|Coming soon/,
        );
      }
      const editor = render(Editor);
      assert.doesNotMatch(editor, /Profile not found/);
      assert.match(editor, /Test Student/);
      assert.match(
        editor,
        role === "student" ? /Skills \(comma-separated\)/ : /Organization/,
      );
      if (role === "student") {
        assert.equal(
          render(Work),
          "",
          "unfinished setup returns to the start step",
        );
        saveDraft(session, { method: "manual" });
        const unselected = render(Work);
        assert.match(
          unselected,
          /<li aria-current="step"><span class="profile-setup__step-number">2<\/span>/,
        );
        assert.doesNotMatch(unselected, /<progress/);
        assert.match(unselected, /Great! Let&#x27;s find you the right jobs/);
        assert.match(unselected, /Type of work you do/);
        assert.match(unselected, /Select a category/);
        assert.match(unselected, /form="profile-work-form" disabled/);
        assert.match(unselected, /href="\/profile\/setup"/);
        saveDraft(session, { categoryId: "graphic_design" });
        const selected = render(Work);
        assert.match(selected, /Design &amp; Creative/);
        assert.doesNotMatch(selected, /form="profile-work-form" disabled/);
        assert.match(render(Editor), /value="Design &amp; Creative"/);
      }
      const result =
        role === "student"
          ? getStudentProfileById(user.id)
          : getClientProfileById(user.id);
      assert.equal(result.profile.verified, false);
      assert.deepEqual(
        role === "student" ? result.completedProjects : result.projectHistory,
        [],
      );
    }
  } finally {
    await vite.close();
  }
});
