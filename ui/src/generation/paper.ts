import { svg } from 'lit';

import { calculateBoxes, background, header, body, footer } from './helpers';
import type { PaperSize } from './sizes';

const halfInch = 12.131895;

export function paper(
  print: boolean,
  paperSize: PaperSize,
  layout: string,
  x: number = 0
) {
  if (!paperSize) {
    return svg``;
  }

  const margins = {
    top: halfInch,
    right: halfInch,
    bottom: halfInch,
    left: halfInch,
  };

  let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
    paperSize,
    margins
  );

  // Render the sections within the page.
  return svg`
    <svg
      class="${print ? 'd-print-block' : 'preview'}"
      width="${paperSize.width}mm"
      height="${paperSize.height}mm"
      version="1.1"
      x="${x}mm"
    >
      <g>
        ${background(backgroundBox)}
        ${header(headerBox)}
        ${body(bodyBox, layout)}
        ${footer(footerBox)}
      </g>
    </svg>`;
}
