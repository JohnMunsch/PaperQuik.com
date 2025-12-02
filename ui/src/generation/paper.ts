import { svg } from "lit";

import type { Margins, PaperSizeNames } from "./helpers.ts";
import { calculateBoxes, background, header, body, footer } from "./helpers.ts";
import { paperSizes } from "./sizes.ts";

const halfInch = 12.131895;
const margins: Margins = {
  top: halfInch,
  right: halfInch,
  bottom: halfInch,
  left: halfInch,
};

export function paper(
  print: boolean,
  paperSizeName: PaperSizeNames | undefined,
  layout: string | undefined
) {
  if (!paperSizeName || !layout) {
    return svg``;
  }

  let paperSize = paperSizes.find((size) => size.name === paperSizeName);
  if (!paperSize) {
    console.error(`Paper size ${paperSizeName} not found.`);
    return svg``;
  }

  let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
    paperSize,
    margins
  );

  // Render the sections within the page.
  return svg`
    <svg
      class="${print ? "d-none d-print-block" : "preview"}"
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
