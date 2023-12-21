import { LitElement, html } from 'lit';

export class SequencePage extends LitElement {
  items = [
    {
      name: 'Single Page Full Year Calendar 2024',
      layout: '',
      side: 'verso',
      pages: 1,
    },
    {
      name: 'Single Page Full Year Calendar 2025',
      layout: '',
      side: 'recto',
      pages: 1,
    },
    {
      name: 'Monthly Horizontal Calendar 2024',
      layout: '',
      side: 'verso',
      pages: 6,
    },
    {
      name: 'Double Page Single Month Calendar Jan 2024',
      layout: '',
      side: 'verso',
      pages: 2,
    },
    { name: 'Coming Up Jan 2024', layout: '', side: 'verso', pages: 1 },
    {
      name: 'Single Page Per Day Jan 2024 1-31',
      layout: '',
      side: 'recto',
      pages: 31,
    },
    { name: 'Dot Grids', layout: '', side: 'recto', pages: 10 },
  ];

  static get it() {
    return 'sequence-page';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { name: { type: String } };
  }

  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }

  sequenceItem(item) {
    return html`<tr>
      <td>
        <a href="" @click="${(e, item) => this.editItem(item)}">
          ${item.name}</a
        >
      </td>
      <td>${item.side}</td>
      <td>${item.pages}</td>
    </tr>`;
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
            <tbody>
              ${this.items.map((item) => this.sequenceItem(item))}
            </tbody>
          </table>

          <pq-adblock></pq-adblock>

          <pq-footer></pq-footer>
        </div>
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="itemModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Sequence Item
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <label class="form-label">Name: </label>
                <input type="text" class="form-control" />
                <label class="form-label">Layout: </label>
                <select name="layouts" class="form-control" id="layout-select">
                  <option value="">--Please choose an option--</option>
                  <option value="blank">Blank</option>
                  <option value="dot-grid">Dot Grid</option>
                  <option value="dotted-ruled-lines">Dotted Ruled</option>
                  <option value="ruled-lines">Ruled</option>
                  <option value="square-graph">Square Graph</option>
                </select>
                <label class="form-label">Side: </label>
                <select name="sides" class="form-control" id="side-select">
                  <option value="">--Please choose an option--</option>
                  <option value="verso">Verso</option>
                  <option value="recto">Recto</option>
                </select>
                <div class="row">
                  <div class="col">
                    <label class="form-label">Number of Pages: </label>
                    <input type="number" min="1" class="form-control" />
                  </div>
                  <div class="col">
                    <label class="form-label">Start Date: </label>
                    <input type="date" class="form-control" />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="${this.saveChanges}"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  editItem(item) {
    const itemModal = new bootstrap.Modal('#itemModal', {});
    itemModal.show();
  }

  saveChanges() {
    console.log('saveChanges');
  }
}

customElements.define(SequencePage.it, SequencePage);
