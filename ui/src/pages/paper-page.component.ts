import { LitElement, html, svg } from 'lit';
import { customElement } from 'lit/decorators.js';

import './shared-components/pq-adblock.ts';
import './shared-components/pq-footer.ts';
import './shared-components/pq-menu.ts';
import { renderForPrinting } from '../generation/paper.ts';
import { halfLetterPortrait, letterLandscape } from '../generation/sizes.ts';

@customElement('paper-page')
export class PaperPage extends LitElement {
  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    const printPages = renderForPrinting(letterLandscape, halfLetterPortrait, [
      'dot-grid',
      'dot-grid',
      'dot-grid',
      'dot-grid',
    ]);

    return html`<div>
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container">
        <pq-adblock class="d-print-none"></pq-adblock>

        <div class="preview">${printPages}</div>

        <pq-adblock class="d-print-none"></pq-adblock>
        <pq-footer class="d-print-none"></pq-footer>
      </div>
    </div>`;
  }
}
