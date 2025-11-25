import { LitElement, html } from 'lit';

export class PaperQuikFooter extends LitElement {
  static get it() {
    return 'pq-footer';
  }

  static get properties() {
    return { name: { type: String } };
  }

  constructor() {
    super();
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<footer>
      <small>&copy; Copyright 2025, John Munsch</small>
    </footer> `;
  }
}

customElements.define(PaperQuikFooter.it, PaperQuikFooter);
