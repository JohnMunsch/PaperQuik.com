import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type BookLayout, renderPrintablePages } from '../generation/paper';
import { letterLandscape } from '../generation/paper-sizes';
import { book } from '../generation/sample-book';

@customElement('print-preview')
export class PrintPreview extends LitElement {
  @property()
  book: BookLayout = book;

  createRenderRoot() {
    return this;
  }

  render() {
    const printPages = renderPrintablePages(letterLandscape, this.book);

    return html`${printPages}`;
  }
}
