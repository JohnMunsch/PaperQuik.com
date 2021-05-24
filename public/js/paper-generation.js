import { html } from 'lit';

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

export function paper(print, paperSize) {
  return html`<svg
    class="${print ? 'd-none d-print-block' : ''}"
    width="${paperSize.width}mm"
    height="${paperSize.height}mm"
    viewBox="0 0 ${paperSize.width} ${paperSize.height}"
    version="1.1"
  >
    <g>
      <rect
        style="fill:${print ? 'none' : 'white'};fill-rule:evenodd;"
        width="215.9"
        height="279.4"
        x="0"
        y="0"
      />
      <rect
        style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;stroke-opacity:1"
        width="191.73621"
        height="255.73621"
        x="12.131895"
        y="12.131895"
      />
    </g>
  </svg>`;
}
