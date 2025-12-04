import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { paper } from "../../../generation/paper.ts";
import type { PaperSizeNames } from "../../../generation/helpers.ts";

@customElement("pq-step-three")
export class PaperQuikStepThree extends LitElement {
  @property() size?: PaperSizeNames;
  @property() layout?: string;

  printModal() {
    var myModal = new bootstrap.Modal(
      document.getElementById("exampleModal"),
      {}
    );
    myModal.show();
  }

  print() {
    var myModal = new bootstrap.Modal(
      document.getElementById("exampleModal"),
      {}
    );
    myModal.hide();
  }

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
    return html` <div class="panel panel-default print-section">
        <div class="panel-heading">
          <h2>3: Preview and print</h2>
        </div>
        <div class="panel-body">
          ${this.size && this.layout
            ? html`<div class="row">
                <div class="col-md-8 preview">
                  ${paper(false, this.size, this.layout)}
                </div>
                <div class="col-md-4">
                  <button
                    class="btn btn-primary btn-block"
                    @click="${() => window.print()}"
                  >
                    Print your paper
                  </button>
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
