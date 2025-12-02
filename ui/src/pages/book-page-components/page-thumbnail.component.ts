import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { Page } from "../book-page.component.ts";
import { paper } from "../../generation/paper.ts";
import type { PaperSizeNames } from "../../generation/helpers.ts";

@customElement("page-thumbnail")
export class PageThumbnail extends LitElement {
  @property() page?: Page;
  @property() paperSize?: PaperSizeNames;

  render() {
    return html`${paper(false, this.paperSize, this.page?.layout)}`;
  }
}
