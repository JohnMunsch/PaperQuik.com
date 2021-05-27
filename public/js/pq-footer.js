import { LitElement, html } from 'lit';

export class PaperQuikFooter extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-footer';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
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
      <p>© 2021 John Munsch</p>
    </footer>`;
  }
}

customElements.define(PaperQuikFooter.it, PaperQuikFooter);
