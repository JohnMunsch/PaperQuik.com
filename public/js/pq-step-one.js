import { LitElement, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { paperSizes } from './paper-generation.js';

export class PaperQuikStepOne extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-step-one';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { size: { type: String } };
  }

  constructor() {
    super();
  }

  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  paperIconStyle(paperSize) {
    return {
      width: `${paperSize.width / 2.8}px`,
      height: `${paperSize.height / 2.8}px`,
    };
  }

  render() {
    return html`<div class="panel panel-default size-section">
      <div class="panel-heading">
        <h2>1: Pick a paper size</h2>
      </div>
      <div class="panel-body">
        ${paperSizes.map((paperSize) => {
          return html`<a href="/paper/${paperSize.id}">
            <div
              class="paperIcon ${paperSize.id === this.size
                ? 'selected'
                : 'notSelected'}"
              style="${styleMap(this.paperIconStyle(paperSize))}"
            >
              <span class="paperName">${paperSize.name}</span>
            </div>
          </a>`;
        })}
      </div>
    </div>`;
  }
}

customElements.define(PaperQuikStepOne.it, PaperQuikStepOne);
