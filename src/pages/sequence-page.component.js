import { LitElement, css, html } from 'lit';

export class SequencePage extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'sequence-page';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { name: { type: String } };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div>
        <pq-menu class="d-print-none" active="sequence"></pq-menu>
        <div class="container d-print-none">
          <pq-adblock></pq-adblock>

          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Side</th>
                <th scope="col">Pages</th>
              </tr>
            </thead>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Single Page Full Year Calendar 2024</a
                >
              </td>
              <td>verso</td>
              <td>1</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Single Page Full Year Calendar 2025</a
                >
              </td>
              <td>recto</td>
              <td>1</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Monthly Horizontal Calendar 2024</a
                >
              </td>
              <td>verso</td>
              <td>6</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Double Page Single Month Calendar Jan 2024</a
                >
              </td>
              <td>recto</td>
              <td>2</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Coming Up Jan 2024</a
                >
              </td>
              <td>verso</td>
              <td>1</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Single Page Per Day Jan 2024 1-31</a
                >
              </td>
              <td>recto</td>
              <td>31</td>
            </tr>
            <tr>
              <td>
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Dot Grids</a
                >
              </td>
              <td>verso</td>
              <td>10</td>
            </tr>
          </table>

          <pq-adblock></pq-adblock>

          <pq-footer></pq-footer>
        </div>
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

customElements.define(SequencePage.it, SequencePage);
