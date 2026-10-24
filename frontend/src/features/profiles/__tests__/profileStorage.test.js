import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("profile and portfolio writes require current ownership and protect account-controlled fields", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  const { saveProfileEdit, loadProfileEdits } = await vite.ssrLoadModule(
    "/src/features/profiles/utils/profileEditStorage.js",
  );
  const { upsertPortfolioItem, getResolvedPortfolioItems } =
    await vite.ssrLoadModule(
      "/src/features/profiles/utils/portfolioStorage.js",
    );
  const { loadSupportSubmissions, saveSupportSubmission } =
    await vite.ssrLoadModule("/src/features/help/utils/supportStorage.js");
  const memory = new Map();
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
    },
  };
  try {
    const session = {
      status: "authenticated",
      user: {
        id: "student_001",
        role: "student",
        displayName: "Salma Farid",
        accountStatus: "active",
      },
    };
    assert.throws(() =>
      saveProfileEdit("student_002", { displayName: "Forged" }, session),
    );
    assert.throws(() =>
      saveProfileEdit("student_001", {}, { ...session, status: "expired" }),
    );
    const saved = saveProfileEdit(
      "student_001",
      { shortBio: "Fictional bio", verified: true, role: "super_admin" },
      session,
    );
    assert.equal(saved.verified, undefined);
    assert.equal(saved.role, undefined);
    const item = {
      id: "sample",
      studentId: "student_001",
      title: "Fictional portfolio item",
    };
    assert.throws(() => upsertPortfolioItem("student_002", item, session));
    upsertPortfolioItem("student_001", item, session);
    assert.equal(getResolvedPortfolioItems("student_001")[0].id, "sample");
    window.sessionStorage.setItem = () => {
      throw new Error("Storage unavailable");
    };
    assert.throws(() =>
      saveProfileEdit("student_001", { shortBio: "Unsaved" }, session),
    );
    assert.equal(loadProfileEdits().student_001.shortBio, "Fictional bio");
    assert.throws(() => saveSupportSubmission({ id: "not-saved" }));
    assert.deepEqual(loadSupportSubmissions(), []);
    window.sessionStorage.getItem = () => "null";
    assert.deepEqual(loadProfileEdits(), {});
    assert.deepEqual(loadSupportSubmissions(), []);
  } finally {
    delete globalThis.window;
    await vite.close();
  }
});
