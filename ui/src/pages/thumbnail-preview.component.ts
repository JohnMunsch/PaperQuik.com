import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type BookLayout, renderThumbnails } from '../generation/paper';
import { book } from '../generation/sample-book';

@customElement('thumbnail-preview')
export class ThumbnailPreview extends LitElement {
  @property()
  book: BookLayout = book;

  createRenderRoot() {
    return this;
  }

  render() {
    const thumbnails = renderThumbnails(this.book);

    return html`${thumbnails}`;
  }
}
