import { LitElement, css, html } from 'lit';

export class PaperQuikMenu extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-menu';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { active: String };
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
    return html` <style>
        nav {
          background-color: #bf5a16;
          color: white;
        }
      </style>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">PaperQuik</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a
                  class="nav-link ${this.active === 'paper' ? 'active' : ''}"
                  aria-current="page"
                  href="/paper"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link ${this.active === 'about' ? 'active' : ''}"
                  href="/about"
                  >About</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>`;
  }
}

customElements.define(PaperQuikMenu.it, PaperQuikMenu);
