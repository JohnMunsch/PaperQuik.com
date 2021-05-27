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
  // Empty areas (w/ optional label)
  // Dot Grid
  // Square Graph
  // Ruled Lines (5mm, 6mm, 7mm)
  // Ruled Lines w/ Dots
  // Ruled Lines w/ Gaps
  // Ruled Lines w/ Square Graph
  // Ruled Lines w/ Dot Grid
  // Music Staffs
  // Isometric Dot Grid
  // Triangle Graph
  // hexes, logarithmic, polar, number lines
  // Bookplates
  // Images
  // Foldable pocket notebooks
  // Numbers and index lines for the graph paper
  // Browser outline
  // iPad/iPhone/iPod Touch outline
  // Calendars
  // Calculator screens
  // Games (Sudoku, tic-tac-toe, hangman, battleship)
  // Score keeping sheets for games
  // Page numbers
  // Quotes
  // Support for bullet journalling ([Bullet Journal - The Analog System for the Digital Age](http://bulletjournal.com/))
  // Lists of options (day of the week/month/year, weather, mood, etc) which can be checked, underlined, or colored in to quickly mark date or other info without writing it out
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

function background(print, paperSize, margins) {
  return svg`<rect
    style="fill:${print ? 'none' : 'white'};fill-rule:evenodd;"
    width="${paperSize.width}"
    height="${paperSize.height}"
    x="0"
    y="0"
  />`;
}

function header(print, paperSize, margins) {
  return svg``;
}

function body(print, paperSize, margins) {
  return svg`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;stroke-opacity:1"
      width="${paperSize.width - (margins.left + margins.right)}"
      height="${paperSize.height - (margins.top + margins.bottom)}"
      x="${margins.left}"
      y="${margins.top}"
    />
  `;
}

function footer(print, paperSize, margins) {
  return svg`<text text-anchor="end" x="${
    paperSize.width - margins.right
  }" y="10" class="logo">
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

  // Render the sections within the page.
  // Header - Body - Footer
  return svg`
    <svg
      class="${print ? 'd-none d-print-block' : ''}"
      width="${paperSize.width}mm"
      height="${paperSize.height}mm"
      viewBox="0 0 ${paperSize.width} ${paperSize.height}"
      version="1.1"
    >
      <g>
        ${background(print, paperSize, margins)}
        ${header(print, paperSize, margins)}
        ${body(print, paperSize, margins)}
        ${footer(print, paperSize, margins)}
      </g>
    </svg>`;
}
