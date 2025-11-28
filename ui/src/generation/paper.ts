import { svg } from 'lit';

import type { PaperSize } from './sizes';
import { calculateBoxes, background, header, body, footer } from './helpers';

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const halfInch = 12.131895;
const margins: Margins = {
  top: halfInch,
  right: halfInch,
  bottom: halfInch,
  left: halfInch,
};

export function paper(print: boolean, paperSize: PaperSize, layout: string) {
  if (!paperSize) {
    return svg``;
  }

  let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
    paperSize,
    margins
  );

  // Render the sections within the page.
  return svg`
    <svg
      class="${print ? 'd-none d-print-block' : 'preview'}"
      width="${paperSize.width}mm"
      height="${paperSize.height}mm"
      viewBox="0 0 ${paperSize.width} ${paperSize.height}"
      version="1.1"
    >
      <g>
        ${background(backgroundBox)}
        ${header(headerBox)}
        ${body(bodyBox, layout)}
        ${footer(footerBox)}
      </g>
    </svg>`;
}
