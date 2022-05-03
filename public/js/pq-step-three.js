import { LitElement, html } from 'lit';

import { paper } from './generation/paper-generation.js';

export class PaperQuikStepThree extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'pq-step-three';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return {
      size: { type: String },
      layout: { type: String },
      paperSize: { type: Object },
    };
  }

  constructor() {
    super();
  }

  printModal() {
    var myModal = new bootstrap.Modal(
      document.getElementById('exampleModal'),
      {}
    );
    myModal.show();
  }

  print() {
    var myModal = new bootstrap.Modal(
      document.getElementById('exampleModal'),
      {}
    );
    myModal.hide();

    window.print();
  }

  // Remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  modal() {
    return html` <!-- Modal -->
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
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">This is my modal body!</div>
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
                @click="${this.print}"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  render() {
    return html`<div class="panel panel-default print-section">
        <div class="panel-heading">
          <h2>3: Print your paper</h2>
        </div>
        <div class="panel-body">
          ${this.size && this.layout
            ? html`<div class="row">
                <div class="col-md-8 preview">
                  ${paper(false, this.paperSize, this.layout)}
                </div>
                <div class="col-md-4">
                  <button
                    class="btn btn-primary btn-block"
                    @click="${this.printModal}"
                  >
                    Print your paper
                  </button>

                  <div id="mc_embed_signup">
                    <form
                      action="http://johnmunsch.us8.list-manage.com/subscribe/post?u=bd3c8c7355797b6633a3503e7&amp;id=e3f181919d"
                      method="post"
                      id="mc-embedded-subscribe-form"
                      name="mc-embedded-subscribe-form"
                      class="validate"
                      target="_blank"
                      novalidate
                    >
                      <label for="mce-EMAIL"
                        >Subscribe to learn when PaperQuik updates</label
                      >
                      <input
                        type="email"
                        value=""
                        name="EMAIL"
                        class="email"
                        id="mce-EMAIL"
                        placeholder="email address"
                        required
                      />
                      <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                      <div style="position: absolute; left: -5000px;">
                        <input
                          type="text"
                          name="b_bd3c8c7355797b6633a3503e7_e3f181919d"
                          value=""
                        />
                      </div>
                      <div class="clear">
                        <button
                          type="submit"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                          class="btn btn-primary"
                        >
                          Subscribe
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>`
            : html`<div>
                You must pick a paper size and layout before you can print your
                page.
              </div>`}
        </div>
      </div>
      ${this.modal()}`;
  }
}

customElements.define(PaperQuikStepThree.it, PaperQuikStepThree);
