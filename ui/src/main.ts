import { LitElement, html } from 'lit';
import { Router } from '@lit-labs/router';

import './pages/about-page.component.js';
import './pages/paper-page.component.js';

// Conditional ESM module loading (Node.js and browser)
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
}

export class PaperQuikApp extends LitElement {
  _router = new Router(this, [
    { path: '/about', render: () => html`<about-page></about-page>` },
    {
      path: '/paper/:size?/:layout?',
      render: ({ size, layout }) =>
        html`<paper-page .size="${size}" .layout="${layout}"></paper-page>`,
    },
    {
      path: '/*',
      enter: async () => {
        // Trigger the router again
        await this._router.goto('/paper');

        // Reject this route so the dynamic one is matched
        return false;
      },
    },
  ]);

  static get it() {
    return 'paperquik-app';
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return this._router.outlet();
  }
}

customElements.define(PaperQuikApp.it, PaperQuikApp);
