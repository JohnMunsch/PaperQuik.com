export interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const letter: PaperSize = {
  id: 'letter',
  name: 'Letter',
  width: 215.9,
  height: 279.4,
};
export const letterl: PaperSize = {
  id: 'letterl',
  name: 'Letter',
  width: letter.height,
  height: letter.width,
};
export const legal: PaperSize = {
  id: 'legal',
  name: 'Legal',
  width: 215.9,
  height: 355.6,
};
export const legall: PaperSize = {
  id: 'legall',
  name: 'Legal',
  width: legal.height,
  height: legal.width,
};
export const halfletter: PaperSize = {
  id: 'halfletter',
  name: 'Half Letter',
  width: letter.width / 2,
  height: letter.height,
};
export const a4: PaperSize = {
  id: 'a4',
  name: 'A4',
  width: 210.0,
  height: 297.0,
};
export const a4l: PaperSize = {
  id: 'a4l',
  name: 'A4',
  width: 297.0,
  height: 210.0,
};
export const a5: PaperSize = {
  id: 'a5',
  name: 'A5',
  width: 148,
  height: 210,
};

export const paperSizes = [
  letter,
  letterl,
  legal,
  legall,
  halfletter,
  a4,
  a4l,
  a5,
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
