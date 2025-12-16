import { svg } from 'lit';

import { calculateBoxes, background, header, body, footer } from './helpers';
import type { PaperSize } from './sizes';

const halfInch = 12.131895;

export function renderBook(
  print: boolean,
  paperSize: PaperSize,
  pages: string[]
) {
  return pages.map((page) => renderPage(print, paperSize, page));
}

export function renderPage(
  print: boolean,
  paperSize: PaperSize,
  layout: string
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
      viewBox="0 0 ${paperSize.width}mm ${paperSize.height}mm"
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
