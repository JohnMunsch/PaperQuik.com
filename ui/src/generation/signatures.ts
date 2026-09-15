export interface ReorderForSignaturesOptions<T> {
  /**
   * Value or factory function to supply for blank filler pages when
   * a signature is not completely full. If not specified, `undefined` is used.
   */
  blankPage?: T | (() => T);
}

function resolveBlankValue<T>(
  blankOption?: T | (() => T) | ReorderForSignaturesOptions<T>
): () => T | undefined {
  if (blankOption === undefined) {
    return () => undefined;
  }
  if (
    typeof blankOption === 'object' &&
    blankOption !== null &&
    'blankPage' in blankOption
  ) {
    const bp = blankOption.blankPage;
    if (typeof bp === 'function') {
      return bp as () => T;
    }
    return () => bp as T;
  }
  if (typeof blankOption === 'function') {
    return blankOption as () => T;
  }
  return () => blankOption as T;
}

/**
 * Reorders a sequential array of pages into signature imposition order
 * for double-sided booklet printing.
 *
 * For each physical sheet in a signature (consisting of front and back sides,
 * with left and right halves on each side):
 * - Sheet 1 Front: [Last page, Page 1]
 * - Sheet 1 Back:  [Page 2, Second-to-last page]
 * - Sheet 2 Front: [Third-to-last page, Page 3]
 * - Sheet 2 Back:  [Page 4, Fourth-to-last page]
 * ...and so on, nesting inwards towards the centerfold.
 *
 * When a signature has fewer pages than its maximum capacity, it pads only to
 * the nearest multiple of 4 (the minimum number of physical sheets needed),
 * ensuring the pages remain in continuous reading order from the front cover,
 * with any blank pages placed naturally at the back of the signature.
 *
 * @param pages The sequential array of pages to impose.
 * @param pagesPerSignature The target number of pages per signature (e.g. 8, 16, 32).
 *                          Will be normalized to the nearest multiple of 4 (minimum 4).
 * @param blankPageOrOptions Optional blank page value, generator function, or options object.
 * @returns An array of pages in left-to-right printing order for each sheet side.
 */
export function reorderForSignatures<T>(
  pages: readonly T[],
  pagesPerSignature: number,
  blankPage: T | (() => T)
): T[];

export function reorderForSignatures<T>(
  pages: readonly T[],
  pagesPerSignature: number,
  options: { blankPage: T | (() => T) }
): T[];

export function reorderForSignatures<T>(
  pages: readonly T[],
  pagesPerSignature: number,
  options?: ReorderForSignaturesOptions<T>
): (T | undefined)[];

export function reorderForSignatures<T>(
  pages: readonly T[],
  pagesPerSignature: number,
  blankPageOrOptions?: T | (() => T) | ReorderForSignaturesOptions<T>
): (T | undefined)[] {
  if (!pages || pages.length === 0) {
    return [];
  }

  const createBlank = resolveBlankValue(blankPageOrOptions);

  // Normalize pagesPerSignature to the nearest multiple of 4, minimum 4.
  const normalizedPagesPerSig = Math.max(
    4,
    Math.ceil(pagesPerSignature / 4) * 4
  );

  const result: (T | undefined)[] = [];

  for (
    let sigStart = 0;
    sigStart < pages.length;
    sigStart += normalizedPagesPerSig
  ) {
    const chunk = pages.slice(sigStart, sigStart + normalizedPagesPerSig);

    // Number of sheets needed for this chunk (minimum sheets to fit remaining pages)
    const sheetsNeeded = Math.ceil(chunk.length / 4);
    const slotsCount = sheetsNeeded * 4;

    // Pad chunk to slotsCount
    const signaturePages: (T | undefined)[] = new Array(slotsCount);
    for (let i = 0; i < slotsCount; i++) {
      if (i < chunk.length) {
        signaturePages[i] = chunk[i];
      } else {
        signaturePages[i] = createBlank();
      }
    }

    // Impose each sheet in this signature: outermost sheet (s = 0) to innermost sheet (s = sheetsNeeded - 1)
    for (let s = 0; s < sheetsNeeded; s++) {
      // Front side: Left is back-half page, Right is front-half page
      const frontLeft = signaturePages[slotsCount - 1 - 2 * s];
      const frontRight = signaturePages[2 * s];

      // Back side: Left is inside front page, Right is inside back page
      const backLeft = signaturePages[1 + 2 * s];
      const backRight = signaturePages[slotsCount - 2 - 2 * s];

      result.push(frontLeft, frontRight, backLeft, backRight);
    }
  }

  return result;
}

export const reorderForSignature = reorderForSignatures;
