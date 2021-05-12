import { LitElement, css, html } from 'lit';
import page from 'page';

import './about-page.js';
import './paper-page.js';
import { paperSizes } from './paper-generation.js';

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

    page('/about', () => {
      this.renderer = () => html`<about-page></about-page>`;
      this.requestUpdate();
    });
    page('/paper/:size?/:layout?', () => {
      this.renderer = () => html`<paper-page></paper-page>`;
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
