import { LitElement, html } from 'lit';

const key = 'pq-jumbotron';
export class PaperQuikJumbotron extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-jumbotron';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { show: { type: Boolean } };
  }

  constructor() {
    super();
  }

  hide() {
    this.show = false;
    window.localStorage.setItem(key, 'false');
  }

  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    if (!((window.localStorage.getItem(key) ?? 'true') === 'true')) {
      return html``;
    }

    return html`<div class="panel jumbotron">
      <h1>The Paper You Need - Available Right Away</h1>
      <p></p>
      <p>
        <button class="btn btn-primary btn-lg" @click="${this.hide}">
          Get Started
        </button>
      </p>
    </div>`;
  }
}

customElements.define(PaperQuikJumbotron.it, PaperQuikJumbotron);
