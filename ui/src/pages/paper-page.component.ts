import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './shared-components/pq-adblock.ts';
import './shared-components/pq-footer.ts';
import './shared-components/pq-menu.ts';

@customElement('paper-page')
export class PaperPage extends LitElement {
  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    // ${paper(true, this.paperSize, this.layout)}
    return html`<div>
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container d-print-none">
        <pq-adblock></pq-adblock>

        <pq-adblock></pq-adblock>
        <pq-footer></pq-footer>
      </div>
    </div>`;
  }
}
