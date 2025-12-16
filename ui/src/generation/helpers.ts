import { svg } from 'lit';

import type { PaperSize } from './sizes';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateBoxes(paperSize: PaperSize, margins) {
  const gap = 2.5;

  const backgroundBox: Box = {
    x: 0,
    y: 0,
    width: paperSize.width,
    height: paperSize.height,
  };

  const headerBox: Box = {
    x: margins.left,
    y: margins.top,
    width: paperSize.width - (margins.left + margins.right),
    height: 15,
  };

  const footerBox: Box = {
    x: margins.left,
    y: paperSize.height - margins.bottom - 2,
    width: paperSize.width - (margins.left + margins.right),
    height: 2,
  };

  const bodyBox: Box = {
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

export function background(backgroundBox: Box) {
  return svg`<rect class="background"
    style="fill-rule:evenodd;"
    width="${backgroundBox.width}mm"
    height="${backgroundBox.height}mm"
    x="${backgroundBox.x}mm"
    y="${backgroundBox.y}mm"
  />`;
}

export function header(headerBox: Box) {
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill: none;fill-rule:evenodd;"
                   width="${headerBox.width}mm"
                   height="${headerBox.height}mm"
                   x="${headerBox.x}mm"
                   y="${headerBox.y}mm"/>
    <line x1="${headerBox.x}mm" y1="${headerBox.y}mm"
          x2="${headerBox.x + headerBox.width}mm"
          y2="${headerBox.y}mm"
          stroke="black" stroke-width="0.1"/>
    <line x1="${headerBox.x}mm" y1="${headerBox.y + headerBox.height}mm"
          x2="${headerBox.x + headerBox.width}mm"
          y2="${headerBox.y + headerBox.height}mm"
          stroke="black" stroke-width="0.1" />
    <line x1="${headerBox.x + headerBox.width * 0.2}mm"
          y1="${headerBox.y + 1}mm"
          x2="${headerBox.x + headerBox.width * 0.2}mm"
          y2="${headerBox.y + headerBox.height - 1}mm"
          stroke="black" stroke-width="0.1" />
    <text
       style="font-size:0.5em;font-family:Lato;fill:#000000;"
       x="${headerBox.x + 2}mm"
       y="${headerBox.y + 3}mm">Date/Number</text>
    <text
       style="font-size:0.5em;
       font-family:Lato;fill:#000000;"
       x="${headerBox.x + headerBox.width * 0.2 + 2}mm"
       y="${headerBox.y + 3}mm">Title/Subject</text>`;
}

function dotGrid(bodyBox: Box, rows: number[], cols: number[]) {
  return svg`${rows.map((row) => {
    return cols.map(
      (col) => svg`<circle cx="${bodyBox.x + col}mm"
                        cy="${bodyBox.y + row}mm" r=".2mm"/>`
    );
  })}`;
}

function ruledLines(bodyBox: Box, rows: number[]) {
  return svg`${rows.map(
    (row) => svg`<line x1="${bodyBox.x}mm"
          y1="${bodyBox.y + row}mm"
          x2="${bodyBox.x + bodyBox.width}mm"
          y2="${bodyBox.y + row}mm"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function squareGraphColumns(bodyBox: Box, cols: number[]) {
  return svg`${cols.map(
    (col) => svg`<line x1="${bodyBox.x + col}mm"
          y1="${bodyBox.y}mm"
          x2="${bodyBox.x + col}mm"
          y2="${bodyBox.y + bodyBox.height}mm"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function bodyLayout(bodyBox: Box, layout: string) {
  const rowHeight = 5;
  const colWidth = 5;

  let rows: number[] = [];
  let cols: number[] = [];

  // Figure out if the last row has extra space and split that extra between
  // the top and bottom.
  // let row = ((bodyBox.height % rowHeight) + rowHeight) / 2;
  let row = rowHeight;

  while (row + rowHeight < bodyBox.height) {
    rows.push(row);
    row += rowHeight;
  }

  // Figure out if the last col has extra space and split that extra between
  // the left and right.
  let col = 0;
  let adjustment = ((bodyBox.width % colWidth) + colWidth) / 2;

  while (col + adjustment < bodyBox.width) {
    cols.push(col + adjustment);
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

export function body(bodyBox: Box, layout: string) {
  return svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${bodyBox.width}mm"
      height="${bodyBox.height}mm"
      x="${bodyBox.x}mm"
      y="${bodyBox.y}mm"
    />
    ${bodyLayout(bodyBox, layout)}`;
}

export function footer(footerBox: Box) {
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill:none;fill-rule:evenodd;"
                   width="${footerBox.width}mm"
                   height="${footerBox.height}mm"
                   x="${footerBox.x}mm"
                   y="${footerBox.y}mm" />
  <text text-anchor="end"
        style="font-size:0.5em;fill:#000000;"
        x="${footerBox.x + footerBox.width}mm"
        y="${footerBox.y + footerBox.height}mm" class="logo">
  PAPERQUIK.com</text>`;
}

// From https://www.abeautifulsite.net/posts/getting-localized-month-and-day-names-in-the-browser/
export function getDayNames(locale = 'en', format = 'long') {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: format,
    timeZone: 'UTC',
  });
  const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
    const dd = day < 10 ? `0${day}` : day;
    return new Date(`2017-01-${dd}T00:00:00+00:00`);
  });
  return days.map((date) => formatter.format(date));
}

export function getMonthNames(locale = 'en', format = 'long') {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: 'UTC',
  });
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
    const mm = month < 10 ? `0${month}` : month;
    return new Date(`2017-${mm}-01T00:00:00+00:00`);
  });
  return months.map((date) => formatter.format(date));
}
