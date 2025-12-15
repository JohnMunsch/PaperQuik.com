import { LitElement, html, svg } from 'lit';
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

  renderA5blank(tx: number = 0, ty: number = 0) {
    return svg`<svg version="1.1" width="148mm" height="210mm" transform="translate(${tx}, ${ty})">
      <g>
        <rect class="background" style="fill-rule:evenodd;" width="148mm" height="210mm" x="0" y="0"></rect>
        <rect style="fill: none;fill-rule:evenodd;" width="123.73621mm" height="15mm" x="12.131895mm" y="12.131895mm"></rect>
    <line stroke="black" stroke-width="0.1" x1="12.131895mm" y1="12.131895mm" x2="135.868105mm" y2="12.131895mm"></line>
    <line stroke="black" stroke-width="0.1" x1="12.131895mm" y1="27.131895mm" x2="135.868105mm" y2="27.131895mm"></line>
    <line stroke="black" stroke-width="0.1" x1="36.879137mm" y1="13.131895mm" x2="36.879137mm" y2="26.131895mm"></line>
    <text style="font-size:0.6mm;font-family:Lato;fill:#000000;" x="14.131895mm" y="15.131895mm">Date/Number</text>
    <text style="font-size:0.6mm;font-family:Lato;fill:#000000;" x="38.879137mm" y="15.131895mm">Title/Subject</text>
        
    <rect style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;" width="123.73621mm" height="166.23621mm" x="12.131895mm" y="29.631895mm"></rect>
  PAPERQUIK.com</text>
      </g>
    </svg>`;
  }

  render() {
    // ${paper(true, this.paperSize, this.layout)}
    return html`<div>
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container">
        <pq-adblock class="d-print-none"></pq-adblock>

        <svg class="preview" version="1.1" width="297mm" height="210mm">
          ${this.renderA5blank(0, 0)} ${this.renderA5blank(550, 0)}
        </svg>

        <pq-adblock class="d-print-none"></pq-adblock>
        <pq-footer class="d-print-none"></pq-footer>
      </div>
    </div>`;
  }
}
