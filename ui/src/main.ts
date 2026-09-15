import { LitElement, html } from 'lit';
import { Router } from '@lit-labs/router';

import './pages/about-page.component.ts';
import './pages/sample-book-page.component.ts';

// Conditional ESM module loading (Node.js and browser). This can be
// removed in 2027.
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
}

export class PaperQuikApp extends LitElement {
  _router = new Router(this, [
    { path: '/about', render: () => html`<about-page></about-page>` },
    {
      path: '/sample-book',
      render: () => html`<sample-book-page></sample-book-page>`,
    },
    {
      path: '/*',
      enter: async () => {
        // Trigger the router again
        await this._router.goto('/sample-book');

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
