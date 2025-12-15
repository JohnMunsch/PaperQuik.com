import { LitElement, html, svg } from 'lit';
import { customElement } from 'lit/decorators.js';

import './shared-components/pq-adblock.ts';
import './shared-components/pq-footer.ts';
import './shared-components/pq-menu.ts';
import { paper } from '../generation/paper.ts';
import { a5 } from '../generation/sizes.ts';

@customElement('paper-page')
export class PaperPage extends LitElement {
  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  renderPage(x: number = 0) {
    return paper(true, a5, 'dot-grid', x);
  }

  render() {
    return html`<div>
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container">
        <pq-adblock class="d-print-none"></pq-adblock>

        <svg class="preview" version="1.1" width="297mm" height="210mm">
          ${this.renderPage()} ${this.renderPage(a5.width)}
        </svg>
        <svg class="preview" version="1.1" width="297mm" height="210mm">
          ${this.renderPage()} ${this.renderPage(a5.width)}
        </svg>

        <pq-adblock class="d-print-none"></pq-adblock>
        <pq-footer class="d-print-none"></pq-footer>
      </div>
    </div>`;
  }
}
