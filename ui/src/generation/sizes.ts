export interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const letterPortrait: PaperSize = {
  id: 'letterPortrait',
  name: 'Letter',
  width: 215.9,
  height: 279.4,
};

export const letterLandscape: PaperSize = {
  id: 'letterLandscape',
  name: 'Letter Landscape',
  width: letterPortrait.height,
  height: letterPortrait.width,
};

export const legalPortrait: PaperSize = {
  id: 'legalPortrait',
  name: 'Legal',
  width: 215.9,
  height: 355.6,
};

export const legalLandscape: PaperSize = {
  id: 'legalLandscape',
  name: 'Legal Landscape',
  width: legalPortrait.height,
  height: legalPortrait.width,
};

export const halfLetterPortrait: PaperSize = {
  id: 'halfLetterPortrait',
  name: 'Half Letter',
  width: letterPortrait.width / 2,
  height: letterPortrait.height,
};

export const a4: PaperSize = {
  id: 'a4',
  name: 'A4',
  width: 210.0,
  height: 297.0,
};

export const a4Landscape: PaperSize = {
  id: 'a4Landscape',
  name: 'A4 Landscape',
  width: 297.0,
  height: 210.0,
};

export const a5Portrait: PaperSize = {
  id: 'a5Portrait',
  name: 'A5',
  width: 148,
  height: 210,
};

export const paperSizes = [
  letterPortrait,
  letterLandscape,
  legalPortrait,
  legalLandscape,
  halfLetterPortrait,
  a4,
  a4Landscape,
  a5Portrait,
];

export enum PageSide {
  Recto = 'recto', // (Front/Right)
  Verso = 'verso', // (Back/Left)
}

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
