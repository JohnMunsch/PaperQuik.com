import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { PaperSizeNames } from "../generation/helpers.js";
import { paper } from "../generation/paper.js";

import "./shared-components/pq-adblock.js";
import "./shared-components/pq-footer.js";
import "./paper-page-components/pq-jumbotron.js";
import "./paper-page-components/steps/pq-step-one.js";
import "./paper-page-components/steps/pq-step-two.js";
import "./paper-page-components/steps/pq-step-three.js";
import "./shared-components/pq-menu.js";

@customElement("paper-page")
export class PaperPage extends LitElement {
  @property() layout?: string;
  @property() size?: PaperSizeNames;
  @state() showJumbotron: boolean = true;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div>
      ${paper(true, this.size, this.layout)}
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container d-print-none">
        <pq-jumbotron .show="${this.showJumbotron}"></pq-jumbotron>
        <pq-adblock></pq-adblock>

        <pq-step-one .size="${this.size}"></pq-step-one>
        <pq-step-two
          .size="${this.size}"
          .layout="${this.layout}"
        ></pq-step-two>
        <pq-step-three
          .size="${this.size}"
          .layout="${this.layout}"
          .paperSize="${this.paperSize}"
        ></pq-step-three>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>
    </div>`;
  }
}
