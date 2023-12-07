import { LitElement, html } from 'lit';
import { Router } from '@lit-labs/router';

import './pages/about-page.component.js';
import './pages/paper-page.component.js';

// Conditional ESM module loading (Node.js and browser)
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
}

export class PaperQuikApp extends LitElement {
  _router = new Router(
    this,
    [
      { path: '/about', render: () => html`<about-page></about-page>` },
      {
        path: '/paper/:size?/:layout?',
        render: ({ size, layout }) =>
          html`<paper-page .size="${size}" .layout="${layout}"></paper-page>`,
      },
    ],
    {
      fallback: {
        enter: async () => {
          await this._router.goto('/paper');

          // Tell the router to cancel the original navigation to make it
          // reentrant safe. It'll be better if we can detect reentrant calls
          // to goto() and do this automatically.
          return false;
        },
      },
    }
  );

  static get it() {
    return 'paperquik-app';
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return this._router.outlet();
  }
}

customElements.define(PaperQuikApp.it, PaperQuikApp);
