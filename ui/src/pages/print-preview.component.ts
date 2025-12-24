import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import {
  type Box,
  calculateBoxes,
  halfInch,
  type Margins,
  type PageLayout,
  renderPrintablePages,
} from '../generation/paper';
import { letterLandscape, halfLetterPortrait } from '../generation/sizes';

@customElement('print-preview')
export class PrintPreview extends LitElement {
  #margins: Margins = {
    top: halfInch,
    right: halfInch,
    bottom: halfInch,
    left: halfInch,
  };
  #backgroundBox: Box;
  #headerBox: Box;
  #bodyBox: Box;
  #footerBox: Box;

  constructor() {
    super();

    let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
      halfLetterPortrait,
      this.#margins
    );

    this.#backgroundBox = backgroundBox;
    this.#headerBox = headerBox;
    this.#bodyBox = bodyBox;
    this.#footerBox = footerBox;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const printPages = renderPrintablePages(
      letterLandscape,
      halfLetterPortrait,
      [this.ruledLayout(), this.ruledLayout()]
    );

    return html`${printPages}`;
  }

  private ruledLayout(): PageLayout {
    return {
      pageElements: [
        { id: 'background', box: this.#backgroundBox },
        { id: 'header', box: this.#headerBox },
        { id: 'ruled-lines', box: this.#bodyBox },
        { id: 'footer', box: this.#footerBox },
      ],
    };
  }
}
