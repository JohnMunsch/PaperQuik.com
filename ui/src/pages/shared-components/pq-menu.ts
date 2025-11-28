import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class PaperQuikMenu extends LitElement {
  @property()
  active: string = 'paper';

  static get it() {
    return 'pq-menu';
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`<nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/paper"
          ><img src="/img/noun_print_3053742.svg" /> PaperQuik</a
        >
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
            <!-- li class="nav-item">
              <a
                class="nav-link ${this.active === 'sequence' ? 'active' : ''}"
                href="/sequence"
                >Sequence</a
              >
            </li -->
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
