import { LitElement, css, html } from 'lit';

export class AboutPage extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'about-page';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return {};
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<pq-menu active="about"></pq-menu>`;
  }
}

customElements.define(AboutPage.it, AboutPage);
