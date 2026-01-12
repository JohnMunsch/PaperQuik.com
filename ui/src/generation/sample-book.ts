import {
  type Box,
  type BookLayout,
  halfInch,
  type Margins,
  type PageLayout,
  type PageData,
} from './render';
import { halfLetterPortrait, type PaperSize } from '../generation/paper-sizes';

const margins: Margins = {
  top: halfInch,
  right: halfInch,
  bottom: halfInch,
  left: halfInch,
};

const book: BookLayout = {
  paperSize: halfLetterPortrait,
  pages: [
    generateLayout(margins, 'cross-grid', { pageNumber: 1, sectionNumber: 1 }),
    generateLayout(margins, 'cross-grid', { pageNumber: 2, sectionNumber: 1 }),
  ],
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

  const pageNumberBox: Box = {
    x: paperSize.width / 2,
    y: paperSize.height - margins.bottom / 2,
    width: bodyBox.width,
    height: 2,
  };

  const sectionNumberBox: Box = {
    x: margins.left,
    y: paperSize.height - margins.bottom - 2,
    width: paperSize.width - (margins.left + margins.right),
    height: 2,
  };

  return {
    backgroundBox,
    headerBox,
    bodyBox,
    footerBox,
    pageNumberBox,
    sectionNumberBox,
  };
}

function generateLayout(
  margins: Margins,
  body: string,
  data?: PageData
): PageLayout {
  let {
    backgroundBox,
    headerBox,
    bodyBox,
    footerBox,
    pageNumberBox,
    sectionNumberBox,
  } = calculateBoxes(halfLetterPortrait, margins);

  return {
    data,
    elements: [
      { id: 'background', box: backgroundBox },
      { id: 'header', box: headerBox },
      { id: body, box: bodyBox },
      { id: 'footer', box: footerBox },
      { id: 'page-number', box: pageNumberBox },
      // { id: 'section-number', box: sectionNumberBox },
    ],
  };
}

export { book };
