import { svg } from 'lit';

export const paperLayouts = [
  {
    id: 'blank',
    name: 'Blank',
  },
  {
    id: 'dot-grid',
    name: 'Dot Grid',
  },
  {
    id: 'dotted-ruled-lines',
    name: 'Dotted Ruled',
  },
  {
    id: 'ruled-lines',
    name: 'Ruled Lines',
  },
  {
    id: 'square-graph',
    name: 'Square Graph',
  },
];

// All measurements are in mm and IDs are just randomly generated here:
export const paperSizes = [
  {
    id: 'letter',
    name: 'Letter',
    width: 215.9,
    height: 279.4,
  },
  {
    id: 'letterl',
    name: 'Letter',
    width: 279.4,
    height: 215.9,
  },
  {
    id: 'legal',
    name: 'Legal',
    width: 215.9,
    height: 355.6,
  },
  {
    id: 'legall',
    name: 'Legal',
    width: 355.6,
    height: 215.9,
  },
  {
    id: 'a4',
    name: 'A4',
    width: 210.0,
    height: 297.0,
  },
  {
    id: 'a4l',
    name: 'A4',
    width: 297.0,
    height: 210.0,
  },
  {
    id: 'a5',
    name: 'A5',
    width: 148,
    height: 210,
  },
];

function calculateBoxes(paperSize, margins) {
  return {
    backgroundBox: {
      x: 0,
      y: 0,
      width: paperSize.width,
      height: paperSize.height,
    },
    headerBox: {
      x: 0,
      y: 0,
      width: paperSize.width,
      height: 0,
    },
    bodyBox: {
      x: margins.left,
      y: margins.top,
      width: paperSize.width - (margins.left + margins.right),
      height: paperSize.height - (margins.top + margins.bottom),
    },
    footerBox: {
      x: margins.left,
      y: margins.top,
      width: paperSize.width - (margins.left + margins.right),
      height: paperSize.height - (margins.top + margins.bottom),
    },
  };
}

function background(backgroundBox) {
  return svg`<rect class="background"
    style="fill-rule:evenodd;"
    width="${backgroundBox.width}"
    height="${backgroundBox.height}"
    x="${backgroundBox.x}"
    y="${backgroundBox.y}"
  />`;
}

function header(headerBox) {
  return svg``;
}

function body(bodyBox) {
  return svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;stroke-opacity:1"
      width="${bodyBox.width}"
      height="${bodyBox.height}"
      x="${bodyBox.x}"
      y="${bodyBox.y}"
    />
  `;
}

function footer(footerBox) {
  return svg`<text text-anchor="end"
  x="${footerBox.x + footerBox.width}" y="${footerBox.y}" class="logo">
  PAPERQUIK.com</text>`;
}

export function paper(print, paperSize) {
  if (!paperSize) {
    return svg``;
  }

  const margins = {
    top: 12.131895,
    right: 12.131895,
    bottom: 12.131895,
    left: 12.131895,
  };

  let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
    paperSize,
    margins
  );

  // Render the sections within the page.
  // Header - Body - Footer
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
        ${body(bodyBox)}
        ${footer(footerBox)}
      </g>
    </svg>`;
}
