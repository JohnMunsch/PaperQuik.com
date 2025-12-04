import type { PaperSize } from "./helpers.ts";
import { PaperSizeNames } from "./helpers.ts";

export const paperSizes: PaperSize[] = [
  {
    id: PaperSizeNames.Letter,
    name: "Letter",
    width: 215.9,
    height: 279.4,
  },
  {
    id: PaperSizeNames.LetterLandscape,
    name: "Letter",
    width: 279.4,
    height: 215.9,
  },
  {
    id: PaperSizeNames.Legal,
    name: "Legal",
    width: 215.9,
    height: 355.6,
  },
  {
    id: PaperSizeNames.LegalLandscape,
    name: "Legal",
    width: 355.6,
    height: 215.9,
  },
  {
    id: PaperSizeNames.A4,
    name: "A4",
    width: 210,
    height: 297,
  },
  {
    id: PaperSizeNames.A4Landscape,
    name: "A4",
    width: 297,
    height: 210,
  },
  {
    id: PaperSizeNames.A5,
    name: "A5",
    width: 148,
    height: 210,
  },
];

// a0 - 841 x 1189
// a1 - 594 x 841
// a2 - 420 x 594
// a3 - 297 x 420
// a4 - 210 x 297
// a5 - 148 x 210
// a6 - 105 x 148

// b0 - 1000 x 1414
// b1 - 707 x 1000
// b2 - 500 x 707
// b3 - 353 x 500
// b4 - 250 x 353
// b5 - 176 x 250
// b6 - 125 x 176
