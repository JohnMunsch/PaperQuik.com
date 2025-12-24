import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderThumbnails } from '../generation/paper';
import { halfLetterPortrait } from '../generation/sizes';

@customElement('thumbnail-preview')
export class ThumbnailPreview extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const printPages = renderThumbnails(halfLetterPortrait, [
      { id: 'dot-grid' },
      { id: 'ruled-lines' },
      { id: 'square-graph' },
      { id: 'dotted-ruled-lines' },
    ]);

    return html`${printPages}`;
  }
}
