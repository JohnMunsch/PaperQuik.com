import { LitElement, html, svg } from 'lit';
import { customElement } from 'lit/decorators.js';

import './shared-components/pq-adblock.ts';
import './shared-components/pq-footer.ts';
import './shared-components/pq-menu.ts';
import './print-preview.component.ts';

@customElement('paper-page')
export class PaperPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div>
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container">
        <pq-adblock class="d-print-none"></pq-adblock>

        <print-preview></print-preview>

        <pq-adblock class="d-print-none"></pq-adblock>
        <pq-footer class="d-print-none"></pq-footer>
      </div>
    </div>`;
  }
}
