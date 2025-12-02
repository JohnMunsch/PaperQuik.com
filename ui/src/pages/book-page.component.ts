import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { PaperSizeNames } from "../generation/helpers.ts";
import "./shared-components/pq-menu.ts";
import "./shared-components/pq-footer.ts";
import "./book-page-components/page-thumbnail.component.ts";

export interface Page {
  layout: string;
}

export interface Book {
  paperSize: PaperSizeNames;
  pages: Array<Page>;
}

@customElement("book-page")
export class BookPage extends LitElement {
  @property() book?: Book = {
    paperSize: PaperSizeNames.A4,
    pages: [
      {
        layout: "square-graph",
      },
    ],
  };

  createRenderRoot() {
    return this;
  }

  renderPageThumbnails(book: Book) {
    return html`${book.pages.map(
      (page) =>
        html`<page-thumbnail
          .paperSize="${book.paperSize}"
          .page="${page}"
        ></page-thumbnail>`
    )}`;
  }

  render() {
    return html`
      <style>
        .book-preview {
          min-height: 30vh;
          min-width: 100%;
          margin-bottom: 1rem;
          background-color: oklch(0.8789 0.0014 106.43);
        }
      </style>
      <pq-menu></pq-menu>
      <div class="container">
        <pq-adblock></pq-adblock>
        <h2>Book Preview</h2>

        <div class="book-preview">${this.renderPageThumbnails(this.book)}</div>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>
    `;
  }
}
