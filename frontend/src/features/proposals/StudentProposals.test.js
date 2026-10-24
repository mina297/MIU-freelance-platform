import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("student routes expose only owned records, edit safely, reflect client changes and link accepted orders", async () => {
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
    const student = {
      status: "authenticated",
      user: {
        id: "student_002",
        displayName: "Omar Nabil",
        role: "student",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const client = {
      ...student,
      user: {
        ...student.user,
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
      },
    };
    const render = (path, session = student) =>
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
    const initial = render("/student/proposals");
    assert.match(initial, /My proposals/);
    assert.match(initial, /Accepted/);
    assert.match(initial, /href="\/orders\/order_001"/);
    assert.doesNotMatch(initial, /Build a responsive event website/);
    assert.equal((initial.match(/<main\b/g) ?? []).length, 1);
    for (const session of [
      client,
      { status: "anonymous", user: null },
      { ...student, status: "expired" },
      { ...student, user: { ...student.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render("/student/proposals", session),
        /Your offers\.|Khamsat|href="\/orders\/order_001"/,
      );
    const empty = {
      ...student,
      user: { ...student.user, id: "empty_student" },
    };
    assert.match(
      render("/student/proposals", empty),
      /Your first opportunity is waiting/,
    );
    assert.match(
      render("/student/proposals/proposal_001/edit"),
      /Proposal unavailable for editing/,
    );
    assert.doesNotMatch(
      render("/student/proposals/proposal_001/edit"),
      /5,700|accessible navigation/,
    );
    assert.match(
      render("/student/proposals/proposal_002/edit"),
      /Proposal unavailable for editing/,
    );
    const values = {
      priceEGP: "4800",
      deliveryDays: "18",
      coverMessage: "Editable fictional offer",
      attachmentIds: [],
    };
    const created = proposalStore.submit(
      values,
      "project_001",
      student,
    ).proposal;
    const editPath = `/student/proposals/${created.id}/edit`;
    assert.match(render(editPath), /Update your proposal/);
    assert.match(render(editPath), /value="4800"/);
    assert.match(render(editPath), /Sample project plan.pdf/);
    assert.match(render("/student/proposals"), /Edit proposal/);
    assert.match(render("/student/proposals"), /Withdraw proposal/);
    assert.equal(
      proposalStore.edit(
        created.id,
        {
          ...values,
          priceEGP: "4700",
          coverMessage: "Revised fictional offer",
        },
        student,
      ).ok,
      true,
    );
    assert.match(
      render("/client/projects/project_001/proposals", client),
      /Revised fictional offer/,
    );
    assert.equal(proposalStore.shortlist(created.id, client, true).ok, true);
    assert.match(render("/student/proposals"), /Shortlisted/);
    assert.equal(proposalStore.withdraw(created.id, student).ok, true);
    assert.match(render("/student/proposals"), /Withdrawn/);
    assert.match(
      render("/client/projects/project_001/proposals", client),
      /Withdrawn/,
    );
    assert.match(render(editPath), /Proposal unavailable for editing/);
    assert.equal(proposalStore.decide(created.id, client, "accept").ok, false);
    const pending = {
      ...student,
      user: {
        ...student.user,
        id: "student_001",
        verificationStatus: "pending",
      },
    };
    assert.match(
      render("/student/proposals/proposal_001/edit", pending),
      /Student verification must be approved/,
    );
  } finally {
    await vite.close();
  }
});
