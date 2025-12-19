import { svg, type TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import { calculateBoxes, background, header, body, footer } from './helpers';
import type { PaperSize } from './sizes';

const halfInch = 12.131895;

export function renderForPreview(paperSize: PaperSize, pages: string[]) {}

export function renderForPrinting(
  printPaperSize: PaperSize,
  paperSize: PaperSize,
  pageSpecs: string[]
) {
  const printPages: TemplateResult[] = [];

  for (let i = 0; i < pageSpecs.length; i += 2) {
    const versoOffset = 0;
    const rectoOffset = paperSize.width;

    printPages.push(svg`
      <svg version="1.1" width="${printPaperSize.width}" height="${
      printPaperSize.height
    }">
        ${renderPage(true, paperSize, pageSpecs[i], versoOffset)}
        ${renderPage(true, paperSize, pageSpecs[i + 1], rectoOffset)}
      </svg>`);
  }

  return printPages;
}

export function renderPage(
  print: boolean,
  paperSize: PaperSize,
  layout: string,
  xOffset?: number
) {
  if (!paperSize || !layout) {
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
      version="1.1"
      width="${paperSize.width}"
      height="${paperSize.height}"
      x="${xOffset}"
    >
      <g>
        ${background(backgroundBox)}
        ${header(headerBox)}
        ${body(bodyBox, layout)}
        ${footer(footerBox)}
      </g>
    </svg>`;
}
