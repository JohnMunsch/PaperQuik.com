import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type BookLayout, renderPrintablePages } from '../generation/render';
import { letterLandscape } from '../generation/paper-sizes';

@customElement('print-preview')
export class PrintPreview extends LitElement {
  @property()
  book: BookLayout | null = null;

  createRenderRoot() {
    return this;
  }

  render() {
    const printPages = this.book
      ? renderPrintablePages(letterLandscape, this.book)
      : [];

    return html`${printPages}`;
  }
}
