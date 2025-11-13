import { LitElement, html } from 'lit';

import { paperLayouts } from '../generation/layouts.js';

export class PaperQuikStepTwo extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-step-two';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { size: { type: String }, layout: { type: String } };
  }

  constructor() {
    super();
  }

  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return html` <div class="panel panel-default layout-section">
      <div class="panel-heading">
        <h2>
          2: Pick a layout
          ${this.paperSize ? `for ${this.paperSize.name} size paper` : ''}
        </h2>
      </div>
      <div class="panel-body">
        ${this.size
          ? html` <div class="layouts-wrapper">
              ${paperLayouts.map((paperLayout) => {
                return html`<a href="/paper/${this.size}/${paperLayout.id}">
                  <div
                    class="layoutIcon ${paperLayout.id === this.layout
                      ? 'selected'
                      : 'notSelected'}"
                  >
                    <span class="layoutName">${paperLayout.name}</span>
                    <div
                      style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                    >
                      <img
                        style="position: relative; width: 100%;"
                        src="/img/${paperLayout.id}-paper.jpg"
                      />
                    </div>
                  </div>
                </a>`;
              })}
            </div>`
          : html`<div>
              You must pick a paper size before you pick a layout for your page.
            </div>`}
      </div>
    </div>`;
  }
}

customElements.define(PaperQuikStepTwo.it, PaperQuikStepTwo);
