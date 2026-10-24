import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const session = (id, role, displayName) => ({
  status: "authenticated",
  user: {
    id,
    role,
    displayName,
    accountStatus: "active",
    verificationStatus: "approved",
  },
});
const client = session("client_001", "client", "Nile Studio");
const student = session("student_002", "student", "Omar Nabil");
const outsider = session(
  "integration_outsider",
  "client",
  "Fictional Other Client",
);

async function setup() {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  const load = (path) => vite.ssrLoadModule(`/src/${path}`);
  const { default: Router } = await load("app/router.jsx");
  const { AuthContext } = await load("contexts/AuthContext.js");
  const render = (path, current = client) =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: [path] },
        React.createElement(
          AuthContext.Provider,
          { value: { session: current } },
          React.createElement(Router),
        ),
      ),
    );
  return { vite, load, render };
}

test("project flow connects private draft, publication, discovery, proposal acceptance and participant-only order workspace", async () => {
  const { vite, load, render } = await setup();
  try {
    const { projectStore } = await load("features/projects/projectStore.js");
    const { proposalStore } = await load("features/proposals/proposalStore.js");
    const { orderStore } = await load("features/orders/orderStore.js");
    const { orderWorkspaceStore } = await load(
      "features/orders/orderWorkspaceStore.js",
    );
    const { marketplaceData } = await load("data/fixtures/marketplace.js");
    const { mergeProjects } = await load("features/projects/projectStore.js");
    const { recommendMarketplace } = await load(
      "features/recommendations/recommendationModel.js",
    );
    const values = {
      title: "Integration React brief",
      description: "A fictional accessible event website.",
      scope: "Build one responsive event screen.",
      deliverables: "Event screen\nKeyboard navigation",
      categoryId: "web_development",
      requiredSkillIds: ["react"],
      budgetEGP: "5000.50",
      deadline: "2099-12-31",
    };
    const draft = projectStore.saveDraft(values, client, "integration-project");
    assert.equal(draft.ok, true);
    assert.doesNotMatch(render("/projects"), /Integration React brief/);
    assert.match(render(`/projects/${draft.project.id}`), /Project not found/);
    const published = projectStore.publish(
      values,
      client,
      "integration-project",
    );
    assert.equal(published.ok, true);
    const id = published.project.id;
    assert.match(render("/projects"), /Integration React brief/);
    assert.match(render(`/projects/${id}`), /Integration React brief/);
    const matches = () =>
      recommendMarketplace(
        { kind: "projects", skillIds: ["react"] },
        {
          ...marketplaceData,
          projects: mergeProjects(
            marketplaceData.projects,
            projectStore.getSnapshot(),
          ),
        },
      );
    assert.ok(matches().some((record) => record.id === id));
    const offer = proposalStore.submit(
      {
        priceEGP: "3100.25",
        deliveryDays: "8",
        coverMessage:
          "Integration offer with a clear accessible implementation.",
        attachmentIds: [],
      },
      id,
      student,
    );
    assert.equal(offer.ok, true);
    assert.match(render(`/client/projects/${id}/proposals`), /3100|3,100/);
    assert.equal(
      proposalStore.shortlist(offer.proposal.id, client, true).ok,
      true,
    );
    const accepted = proposalStore.decide(offer.proposal.id, client, "accept");
    assert.equal(accepted.ok, true);
    assert.equal(accepted.order.agreedAmountEGP, 3100.25);
    assert.equal(accepted.order.status, "awaiting_payment");
    assert.ok(!matches().some((record) => record.id === id));
    assert.doesNotMatch(render("/projects"), /Integration React brief/);
    assert.equal(
      proposalStore.decide(offer.proposal.id, client, "accept").order.id,
      accepted.order.id,
    );
    assert.equal(
      orderStore.getSnapshot().filter((order) => order.sourceId === id).length,
      1,
    );
    assert.equal(projectStore.transition(id, client, "cancel").ok, false);
    assert.equal(proposalStore.withdraw(offer.proposal.id, student).ok, false);
    const orderId = accepted.order.id;
    for (const current of [client, student]) {
      assert.match(
        render(`/${current.user.role}/orders`, current),
        /Integration React brief/,
      );
      const html = render(`/orders/${orderId}`, current);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1);
      assert.match(html, /Order workspace/);
    }
    assert.equal(
      orderWorkspaceStore.saveRequirements(
        orderId,
        { text: "Integration private coordination notes", attachmentIds: [] },
        client,
        0,
      ).ok,
      true,
    );
    assert.equal(
      orderWorkspaceStore.sendMessage(
        orderId,
        { text: "Integration private student message", attachmentIds: [] },
        student,
        "integration-message",
      ).ok,
      true,
    );
    assert.match(
      render(`/orders/${orderId}`),
      /Integration private student message/,
    );
    assert.equal(orderWorkspaceStore.read(orderId, outsider), null);
    assert.doesNotMatch(
      render(`/orders/${orderId}`, outsider),
      /Integration private|Integration React brief|3,100/,
    );
    assert.doesNotMatch(
      render("/client/orders", outsider),
      /Integration React brief/,
    );
    assert.equal(
      orderStore.submitDelivery(
        orderId,
        { text: "Premature handover", attachmentIds: [] },
        student,
        null,
        "too-early",
      ).ok,
      false,
    );
    const expired = { ...client, status: "expired" };
    assert.doesNotMatch(
      render(`/orders/${orderId}`, expired),
      /Integration private|Integration React brief/,
    );
    assert.equal(
      orderWorkspaceStore.sendMessage(
        orderId,
        { text: "After expiry", attachmentIds: [] },
        expired,
        "expired",
      ).ok,
      false,
    );
  } finally {
    await vite.close();
  }
});

test("service flow connects drafts, provider discovery, recommendations, package snapshot, pause and private collaboration", async () => {
  const { vite, load, render } = await setup();
  try {
    const { serviceStore } = await load("features/services/serviceStore.js");
    const { orderStore } = await load("features/orders/orderStore.js");
    const { orderWorkspaceStore } = await load(
      "features/orders/orderWorkspaceStore.js",
    );
    const { quoteServiceOrder } = await load(
      "features/services/serviceOrderModel.js",
    );
    const { recommendMarketplace } = await load(
      "features/recommendations/recommendationModel.js",
    );
    const provider = session(
      "integration_provider",
      "student",
      "Integration Provider",
    );
    const created = serviceStore.save(
      {
        title: "Integration service offer",
        description: "A fictional responsive React screen with clear scope.",
        categoryId: "web_development",
        skillIds: ["react"],
        packages: [
          {
            id: "form-package",
            name: "Integration basic",
            description: "One accessible screen.",
            includedFeatures: "Responsive screen\nKeyboard support",
            priceEGP: "1800.25",
            deliveryDays: "5",
          },
        ],
        extras: [
          {
            id: "form-extra",
            title: "Extra section",
            description: "One additional section.",
            additionalPriceEGP: "250.50",
            additionalDays: "2",
          },
        ],
      },
      provider,
      null,
      "integration-service",
    );
    assert.equal(created.ok, true);
    const id = created.service.id;
    assert.doesNotMatch(render("/services"), /Integration service offer/);
    assert.doesNotMatch(render("/freelancers"), /Integration Provider/);
    assert.equal(serviceStore.transition(id, provider, "publish").ok, true);
    assert.match(render("/services"), /Integration service offer/);
    assert.match(render("/freelancers"), /Integration Provider/);
    assert.ok(
      recommendMarketplace(
        { kind: "freelancers", skillIds: ["react"] },
        serviceStore.getSnapshot(),
      ).some((person) => person.id === provider.user.id),
    );
    const data = serviceStore.getSnapshot();
    const selection = {
      packageId: data.servicePackages.find((pack) => pack.serviceId === id).id,
      extraIds: [data.serviceExtras.find((extra) => extra.serviceId === id).id],
    };
    const quote = quoteServiceOrder(id, selection, client, data);
    assert.equal(quote.ok, true);
    const confirmed = { ...selection, expectedRevision: quote.revision };
    const result = orderStore.createFromService(
      id,
      confirmed,
      client,
      "integration-confirm",
      serviceStore.getSnapshot,
    );
    assert.equal(result.ok, true);
    assert.equal(result.order.agreedAmountEGP, 2050.75);
    assert.equal(result.order.deliveryDays, 7);
    assert.equal(result.order.status, "awaiting_payment");
    assert.equal(
      orderStore.createFromService(
        id,
        confirmed,
        client,
        "integration-confirm",
        serviceStore.getSnapshot,
      ).order.id,
      result.order.id,
    );
    assert.equal(
      orderStore.getSnapshot().filter((order) => order.sourceId === id).length,
      1,
    );
    assert.equal(serviceStore.transition(id, provider, "remove").ok, false);
    assert.equal(serviceStore.transition(id, provider, "pause").ok, true);
    assert.doesNotMatch(render("/services"), /Integration service offer/);
    assert.doesNotMatch(render("/freelancers"), /Integration Provider/);
    assert.ok(
      !recommendMarketplace(
        { kind: "services", skillIds: ["react"] },
        serviceStore.getSnapshot(),
      ).some((service) => service.id === id),
    );
    assert.equal(
      orderStore.createFromService(
        id,
        confirmed,
        client,
        "new-confirm",
        serviceStore.getSnapshot,
      ).ok,
      false,
    );
    assert.match(
      render(`/orders/${result.order.id}`),
      /Integration basic|Saved package terms/,
    );
    assert.match(
      render("/student/orders", provider),
      /Integration service offer/,
    );
    assert.equal(
      orderWorkspaceStore.sendMessage(
        result.order.id,
        { text: "Integration service private message", attachmentIds: [] },
        provider,
        "service-message",
      ).ok,
      true,
    );
    assert.match(
      render(`/orders/${result.order.id}`),
      /Integration service private message/,
    );
    assert.doesNotMatch(
      render(`/orders/${result.order.id}`, outsider),
      /Integration service private|Integration basic|2,050/,
    );
    assert.equal(
      orderStore.submitDelivery(
        result.order.id,
        { text: "Premature handover", attachmentIds: [] },
        provider,
        null,
        "too-early",
      ).ok,
      false,
    );
  } finally {
    await vite.close();
  }
});
