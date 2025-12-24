import {
  type Box,
  type BookLayout,
  halfInch,
  type Margins,
  type PageLayout,
} from '../generation/paper';
import { halfLetterPortrait, type PaperSize } from '../generation/paper-sizes';

const margins: Margins = {
  top: halfInch,
  right: halfInch,
  bottom: halfInch,
  left: halfInch,
};

const book: BookLayout = {
  paperSize: halfLetterPortrait,
  pages: Array(2).fill(generateLayout(margins, 'dot-grid')),
};

function calculateBoxes(paperSize: PaperSize, margins: Margins) {
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

function generateLayout(margins: Margins, body: string): PageLayout {
  let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(
    halfLetterPortrait,
    margins
  );

  return {
    elements: [
      { id: 'background', box: backgroundBox },
      { id: 'header', box: headerBox },
      { id: body, box: bodyBox },
      { id: 'footer', box: footerBox },
    ],
  };
}

export { book };
