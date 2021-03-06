import { LitElement, html } from 'lit';
import page from 'page';

import './pages/about-page.component.js';
import './pages/paper-page.component.js';

export class PaperQuikApp extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'paperquik-app';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return {};
  }

  constructor() {
    super();

    this.renderer = () => {
      return html``;
    };

    page('/about', () => {
      this.renderer = () => html`<about-page></about-page>`;
      this.requestUpdate();
    });
    page('/paper/:size?/:layout?', (ctx) => {
      this.renderer = () =>
        html`<paper-page
          .size="${ctx.params.size}"
          .layout="${ctx.params.layout}"
        ></paper-page>`;
      this.requestUpdate();
    });
    page('*', '/paper');

    page();
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return this.renderer();
  }
}

customElements.define(PaperQuikApp.it, PaperQuikApp);
