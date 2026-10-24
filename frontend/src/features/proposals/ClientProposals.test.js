import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("client review protects ownership and includes live submissions, shortlist status, comparison and recovery states", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { proposalStore } = await vite.ssrLoadModule(
      "/src/features/proposals/proposalStore.js",
    );
    const { projectStore } = await vite.ssrLoadModule(
      "/src/features/projects/projectStore.js",
    );
    const { default: Comparison } = await vite.ssrLoadModule(
      "/src/features/proposals/ProposalComparison.jsx",
    );
    const client = {
      status: "authenticated",
      user: {
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const render = (path, session = client) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            React.createElement(AppRouter),
          ),
        ),
      );
    const path = "/client/projects/project_001/proposals";
    const initial = render(path);
    assert.match(initial, /Incoming proposals/);
    assert.match(initial, /Salma Farid/);
    assert.match(initial, /Search proposals/);
    assert.match(initial, /Proposal status/);
    assert.match(initial, /Lowest price/);
    assert.match(initial, /Shortest delivery/);
    assert.match(initial, /Select two or three proposals/);
    assert.equal((initial.match(/<main\b/g) ?? []).length, 1);
    assert.match(
      render("/client/projects"),
      /href="\/client\/projects\/project_001\/proposals"/,
    );
    const foreign = { ...client, user: { ...client.user, id: "other_client" } };
    const unavailable = render(path, foreign);
    assert.match(unavailable, /Proposals unavailable/);
    assert.doesNotMatch(unavailable, /Salma Farid|5,700|accessible navigation/);
    assert.match(
      render("/client/projects/missing/proposals"),
      /Proposals unavailable/,
    );
    for (const session of [
      { status: "anonymous", user: null },
      { ...client, user: { ...client.user, role: "student" } },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render(path, session),
        /Incoming proposals|Salma Farid/,
      );
    assert.match(
      render("/client/projects/project_003/proposals"),
      /Your next collaborator is still on the way/,
    );
    assert.match(
      render("/client/projects/project_002/proposals"),
      /Proposals can be reviewed and compared, but shortlisting is unavailable/,
    );
    const student = {
      ...client,
      user: {
        ...client.user,
        id: "student_002",
        displayName: "Omar Nabil",
        role: "student",
      },
    };
    const submitted = proposalStore.submit(
      {
        priceEGP: "6200",
        deliveryDays: "14",
        coverMessage: "A second fictional event-site approach",
        attachmentIds: ["demo_attachment_plan"],
      },
      "project_001",
      student,
    );
    assert.equal(submitted.ok, true);
    assert.match(render(path), /Omar Nabil/);
    assert.match(render(path), /Sample project plan.pdf/);
    assert.equal(
      proposalStore.shortlist(submitted.proposal.id, client, true).ok,
      true,
    );
    assert.match(render(path), /Remove shortlist/);
    assert.match(
      render("/projects/project_001/propose", student),
      /Shortlisted/,
    );
    const selected = proposalStore
      .getSnapshot()
      .filter((proposal) => proposal.projectId === "project_001");
    const comparison = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Comparison, { proposals: selected }),
      ),
    );
    assert.match(comparison, /Selected proposal comparison/);
    assert.match(comparison, /scope="col"/);
    assert.match(comparison, /scope="row"/);
    assert.match(comparison, /Salma Farid/);
    assert.match(comparison, /Omar Nabil/);
    assert.match(comparison, /6,200/);
    assert.match(comparison, /14 days/);
    projectStore.transition("project_001", client, "close");
    assert.match(render(path), /shortlisting is unavailable/);
    assert.equal(
      proposalStore.shortlist(submitted.proposal.id, client, false).ok,
      false,
    );
  } finally {
    await vite.close();
  }
});
