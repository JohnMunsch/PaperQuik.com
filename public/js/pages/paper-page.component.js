import { LitElement, html } from 'lit';

import { paperSizes } from './generation/sizes.js';
import { paper } from './paper-generation.js';

import './pq-adblock.js';
import './pq-footer.js';
import './pq-jumbotron.js';
import './pq-step-one.js';
import './pq-step-two.js';
import './pq-step-three.js';
import './pq-menu.js';

export class PaperPage extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'paper-page';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return {
      layout: { type: String },
      size: { type: String },
      showJumbotron: { state: true, type: Boolean },
    };
  }

  constructor() {
    super();

    this.paperSize = null;
    this.showJumbotron = true;
  }

  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('size')) {
      this.paperSize = paperSizes.find(
        (paperSize) => paperSize.id === this.size
      );
    }
  }

  render() {
    return html`<div>
      ${paper(true, this.paperSize, this.layout)}
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container d-print-none">
        <pq-jumbotron .show="${this.showJumbotron}"></pq-jumbotron>
        <pq-adblock></pq-adblock>

        <pq-step-one .size="${this.size}"></pq-step-one>
        <pq-step-two
          .size="${this.size}"
          .layout="${this.layout}"
        ></pq-step-two>
        <pq-step-three
          .size="${this.size}"
          .layout="${this.layout}"
          .paperSize="${this.paperSize}"
        ></pq-step-three>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>
    </div>`;
  }
}

customElements.define(PaperPage.it, PaperPage);
