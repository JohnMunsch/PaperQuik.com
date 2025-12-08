import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pq-footer')
export class PaperQuikFooter extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<footer>
      <small>&copy; Copyright 2025, John Munsch</small>
    </footer> `;
  }
}
