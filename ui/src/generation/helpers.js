import { svg } from 'lit';

export function calculateBoxes(paperSize, margins) {
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

export function background(backgroundBox) {
  return svg`<rect class="background"
    style="fill-rule:evenodd;"
    width="${backgroundBox.width}"
    height="${backgroundBox.height}"
    x="${backgroundBox.x}"
    y="${backgroundBox.y}"
  />`;
}

export function header(headerBox) {
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
      (col) => svg`<circle cx="${bodyBox.x + col}"
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
  let cols = [];

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

export function body(bodyBox, layout) {
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

export function footer(footerBox) {
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
