import { svg } from 'lit';

const halfInch = 12.131895;

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

function dotGrid(bodyBox, rows, cols) {
  return svg`${rows.map((row) => {
    return cols.map(
      (col) =>
        svg`<circle cx="${bodyBox.x + col}"
                        cy="${bodyBox.y + row}" r=".2"/>`
    );
  })}`;
}

function ruledLines(bodyBox, rows) {
  return svg`${rows.map(
    (row) => svg`<line x1="${bodyBox.x}"
          y1="${bodyBox.y + row}"
          x2="${bodyBox.x + bodyBox.width}"
          y2="${bodyBox.y + row}"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function squareGraphColumns(bodyBox, cols) {
  return svg`${cols.map(
    (col) => svg`<line x1="${bodyBox.x + col}"
          y1="${bodyBox.y}"
          x2="${bodyBox.x + col}"
          y2="${bodyBox.y + bodyBox.height}"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function bodyLayout(bodyBox, layout) {
  const rowHeight = 5;
  const colWidth = 5;

  let rows = [];
  let row = rowHeight;

  let cols = [];
  let col = colWidth;

  while (row < bodyBox.height) {
    rows.push(row);
    row += rowHeight;
  }

  while (col < bodyBox.width) {
    cols.push(col);
    col += colWidth;
  }

  switch (layout) {
    case 'blank':
      return svg``;
    case 'dot-grid':
      return dotGrid(bodyBox, rows, cols);
    case 'dotted-ruled-lines':
      return svg`${dotGrid(bodyBox, rows, cols)}${ruledLines(bodyBox, rows)}`;
    case 'ruled-lines':
      return ruledLines(bodyBox, rows);
    case 'square-graph':
      return svg`${ruledLines(bodyBox, rows)}
      ${squareGraphColumns(bodyBox, cols)}`;
  }
}

function body(bodyBox, layout) {
  return svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${bodyBox.width}"
      height="${bodyBox.height}"
      x="${bodyBox.x}"
      y="${bodyBox.y}"
    />
    ${bodyLayout(bodyBox, layout)}`;
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

export function paper(print, paperSize, layout) {
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
        ${body(bodyBox, layout)}
        ${footer(footerBox)}
      </g>
    </svg>`;
}
