import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type BookLayout, renderThumbnails } from '../generation/render';

@customElement('thumbnail-preview')
export class ThumbnailPreview extends LitElement {
  @property()
  book: BookLayout | null = null;

  static styles = css`
    :host {
      display: flex;
      gap: 15px;
    }

    svg {
      filter: drop-shadow(3px 3px 3px black);

      rect.background {
        fill: white;
      }
    }
  `;

  render() {
    const thumbnails = this.book ? renderThumbnails(this.book) : [];

    return html`${thumbnails}`;
  }
}
