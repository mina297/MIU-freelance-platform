import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

test('client dashboard direct entries preserve the shared shell and client role guard', async () => {
  const vite = await createServer({ root: fileURLToPath(new URL('../../', import.meta.url)), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'silent' });
  try {
    const { default: Router } = await vite.ssrLoadModule('/src/app/router.jsx');
    const { AuthContext } = await vite.ssrLoadModule('/src/contexts/AuthContext.js');
    const session = { status: 'authenticated', user: { id: 'client_001', role: 'client', displayName: 'Demo client', accountStatus: 'active' } };
    const render = (activeSession) => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/client/dashboard'] }, React.createElement(AuthContext.Provider, { value: { session: activeSession } }, React.createElement(Router))));
    for (let entry = 0; entry < 2; entry++) {
      const html = render(session);
      assert.match(html, /miu-public-main/);
      assert.equal((html.match(/class="student-dashboard client-dashboard"/g) ?? []).length, 1);
      assert.doesNotMatch(html, /routing placeholder only/);
    }
    assert.doesNotMatch(render({ status: 'anonymous', user: null }), /class="student-dashboard client-dashboard"/);
    assert.doesNotMatch(render({ ...session, user: { ...session.user, role: 'student' } }), /class="student-dashboard client-dashboard"/);
  } finally { await vite.close(); }
});
