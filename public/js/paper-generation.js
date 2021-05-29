import { svg } from 'lit';

const halfInch = 12.131895;

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
  const gap = 2.5;

  const backgroundBox = {
    x: 0,
    y: 0,
    width: paperSize.width,
    height: paperSize.height,
  };

  const headerBox = {
    x: margins.left,
    y: margins.top,
    width: paperSize.width - (margins.left + margins.right),
    height: 15,
  };

  const footerBox = {
    x: margins.left,
    y: paperSize.height - margins.bottom - 2,
    width: paperSize.width - (margins.left + margins.right),
    height: 2,
  };

  const bodyBox = {
    x: margins.left,
    y: margins.top + headerBox.height + gap,
    width: paperSize.width - (margins.left + margins.right),
    height:
      paperSize.height -
      (margins.top +
        headerBox.height +
        gap +
        footerBox.height +
        margins.bottom),
  };

  return {
    backgroundBox,
    headerBox,
    bodyBox,
    footerBox,
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
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill: none;fill-rule:evenodd;"
                   width="${headerBox.width}"
                   height="${headerBox.height}"
                   x="${headerBox.x}"
                   y="${headerBox.y}"/>
    <line x1="${headerBox.x}" y1="${headerBox.y}"
          x2="${headerBox.x + headerBox.width}"
          y2="${headerBox.y}"
          stroke="black" stroke-width="0.1"/>
    <line x1="${headerBox.x}" y1="${headerBox.y + headerBox.height}"
          x2="${headerBox.x + headerBox.width}"
          y2="${headerBox.y + headerBox.height}"
          stroke="black" stroke-width="0.1" />
    <line x1="${headerBox.x + headerBox.width * 0.2}"
          y1="${headerBox.y + 1}"
          x2="${headerBox.x + headerBox.width * 0.2}"
          y2="${headerBox.y + headerBox.height - 1}"
          stroke="black" stroke-width="0.1" />
    <text
       style="font-size:0.6mm;font-family:Lato;fill:#000000;"
       x="${headerBox.x + 2}"
       y="${headerBox.y + 3}">Date/Number</text>
    <text
       style="font-size:0.6mm;
       font-family:Lato;fill:#000000;"
       x="${headerBox.x + headerBox.width * 0.2 + 2}"
       y="${headerBox.y + 3}">Title/Subject</text>`;
}

function body(bodyBox) {
  return svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${bodyBox.width}"
      height="${bodyBox.height}"
      x="${bodyBox.x}"
      y="${bodyBox.y}"
    />
  `;
}

function footer(footerBox) {
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill:none;fill-rule:evenodd;"
                   width="${footerBox.width}"
                   height="${footerBox.height}"
                   x="${footerBox.x}"
                   y="${footerBox.y}" />
  <text text-anchor="end"
        x="${footerBox.x + footerBox.width}"
        y="${footerBox.y + footerBox.height}" class="logo">
  PAPERQUIK.com</text>`;
}

export function paper(print, paperSize) {
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
