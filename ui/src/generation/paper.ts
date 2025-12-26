import { svg, type TemplateResult } from 'lit';

import type { PaperSize } from './paper-sizes';

// All units are in mm except where we are making unitless thumbnails.
export const halfInch = 12.131895;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PageElement {
  id: string;
  name?: string;
  box?: Box;
}

export interface PageLayout {
  elements: PageElement[];
  data?: object;
}

export interface BookLayout {
  paperSize: PaperSize;
  pages: PageLayout[];
}

export const bodyElements: PageElement[] = [
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

export function renderThumbnails(book: BookLayout) {
  return book.pages.map((layout) => {
    return renderPage(false, book.paperSize, layout);
  });
}

export function renderPrintablePages(
  printPaperSize: PaperSize,
  book: BookLayout
) {
  const printPages: TemplateResult[] = [];

  // TODO: This works differently when the print pager size is the same as the paper size.
  for (let i = 0; i < book.pages.length; i += 2) {
    const versoOffset = 0;
    const rectoOffset = book.paperSize.width;

    printPages.push(svg`
      <svg version="1.1" width="${printPaperSize.width}mm"
           height="${printPaperSize.height}mm">
        ${renderPage(true, book.paperSize, book.pages[i], versoOffset)}
        ${renderPage(true, book.paperSize, book.pages[i + 1], rectoOffset)}
      </svg>`);
  }

  return printPages;
}

export function renderPage(
  print: boolean,
  paperSize: PaperSize,
  pageLayout: PageLayout,
  xOffset?: number
) {
  const units = print ? 'mm' : '';

  if (!paperSize || !pageLayout) {
    return svg``;
  }

  // Render the sections within the page.
  return svg`
    <svg
      class="${print ? 'd-print-block' : 'preview'}"
      version="1.1"
      width="${paperSize.width}${units}"
      height="${paperSize.height}${units}"
      x="${xOffset}${units}"
    >
      <g>
        ${pageLayout.elements.map((element) => {
          return renderElement(units, element);
        })}
      </g>
    </svg>`;
}

export function renderElement(units: string, element: PageElement) {
  switch (element.id) {
    case 'background':
      return background(units, element.box!);
    case 'header':
      return header(units, element.box!);
    case 'blank':
    case 'dot-grid':
    case 'ruled-lines':
    case 'square-graph':
    case 'dotted-ruled-lines':
      return body(units, element.id, element.box!);
    case 'footer':
      return footer(units, element.box!);
    default:
      return svg``;
  }
}

export function background(units: string, backgroundBox: Box) {
  return svg`<rect class="background"
    style="fill-rule:evenodd;"
    width="${backgroundBox.width}${units}"
    height="${backgroundBox.height}${units}"
    x="${backgroundBox.x}${units}"
    y="${backgroundBox.y}${units}"
  />`;
}

export function header(units: string, headerBox: Box) {
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill: none;fill-rule:evenodd;"
                   width="${headerBox.width}${units}"
                   height="${headerBox.height}${units}"
                   x="${headerBox.x}${units}"
                   y="${headerBox.y}${units}"/>
    <line x1="${headerBox.x}${units}" y1="${headerBox.y}${units}"
          x2="${headerBox.x + headerBox.width}${units}"
          y2="${headerBox.y}${units}"
          stroke="black" stroke-width="0.1"/>
    <line x1="${headerBox.x}${units}" y1="${
    headerBox.y + headerBox.height
  }${units}"
          x2="${headerBox.x + headerBox.width}${units}"
          y2="${headerBox.y + headerBox.height}${units}"
          stroke="black" stroke-width="0.1" />
    <line x1="${headerBox.x + headerBox.width * 0.2}${units}"
          y1="${headerBox.y + 1}${units}"
          x2="${headerBox.x + headerBox.width * 0.2}${units}"
          y2="${headerBox.y + headerBox.height - 1}${units}"
          stroke="black" stroke-width="0.1" />
    <text
       style="font-size:2.5${units};font-family:Lato;fill:#000000;"
       x="${headerBox.x + 2}${units}"
       y="${headerBox.y + 3}${units}">Date/Number</text>
    <text
       style="font-size:2.5${units};font-family:Lato;fill:#000000;"
       x="${headerBox.x + headerBox.width * 0.2 + 2}${units}"
       y="${headerBox.y + 3}${units}">Title/Subject</text>`;
}

function dotGrid(units: string, bodyBox: Box, rows: number[], cols: number[]) {
  return svg`${rows.map((row) => {
    return cols.map(
      (col) => svg`<circle cx="${bodyBox.x + col}${units}"
                        cy="${bodyBox.y + row}${units}" r=".2${units}"/>`
    );
  })}`;
}

function ruledLines(units: string, bodyBox: Box, rows: number[]) {
  return svg`${rows.map(
    (row) => svg`<line x1="${bodyBox.x}${units}"
          y1="${bodyBox.y + row}${units}"
          x2="${bodyBox.x + bodyBox.width}${units}"
          y2="${bodyBox.y + row}${units}"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function squareGraphColumns(units: string, bodyBox: Box, cols: number[]) {
  return svg`${cols.map(
    (col) => svg`<line x1="${bodyBox.x + col}${units}"
          y1="${bodyBox.y}${units}"
          x2="${bodyBox.x + col}${units}"
          y2="${bodyBox.y + bodyBox.height}${units}"
          stroke="black" stroke-width="0.1" />`
  )}`;
}

function body(units: string, layout: string, bodyBox: Box) {
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

  const border = svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${bodyBox.width}${units}"
      height="${bodyBox.height}${units}"
      x="${bodyBox.x}${units}"
      y="${bodyBox.y}${units}"
    />`;

  switch (layout) {
    case 'blank':
      return border;
    case 'dot-grid':
      return svg`${border}${dotGrid(units, bodyBox, rows, cols)}`;
    case 'dotted-ruled-lines':
      return svg`${border}${dotGrid(units, bodyBox, rows, cols)}${ruledLines(
        units,
        bodyBox,
        rows
      )}`;
    case 'ruled-lines':
      return svg`${border}${ruledLines(units, bodyBox, rows)}`;
    case 'square-graph':
      return svg`${border}${ruledLines(units, bodyBox, rows)}
      ${squareGraphColumns(units, bodyBox, cols)}`;
  }
}

export function footer(units: string, footerBox: Box) {
  // The rect is hidden because it's used strictly for debugging.
  return svg`<rect style="fill:none;fill-rule:evenodd;"
                   width="${footerBox.width}${units}"
                   height="${footerBox.height}${units}"
                   x="${footerBox.x}${units}"
                   y="${footerBox.y}${units}" />
  <text text-anchor="end"
        style="font-size:2.5${units};fill:#000000;"
        x="${footerBox.x + footerBox.width}${units}"
        y="${footerBox.y + footerBox.height + 1}${units}" class="logo">
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
