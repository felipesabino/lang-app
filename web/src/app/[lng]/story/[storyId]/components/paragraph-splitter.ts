export interface Word {
  text: string;
  bufferStart: number;
  bufferEnd: number;
}

export interface Paragraph {
  words: Word[];
  text: string;
  bufferStart: number;
  bufferEnd: number;
}

const lineBreakChar = "\n";
const spaceChar = " ";
const lineBreakSize = new TextEncoder().encode(lineBreakChar).length;
const spaceCharSize = new TextEncoder().encode(spaceChar).length;

export const ParagraphSplitter = (text: string): Paragraph[] => {
  return text
    .split(lineBreakChar)
    .reduce((accumulator, currentValue, currentIndex) => {
      const bufferStart = currentIndex === 0 ? 0 : accumulator[currentIndex - 1].bufferEnd + lineBreakSize;
      accumulator.push({
        words: WordSplitter(currentValue, bufferStart),
        text: currentValue,
        bufferStart,
        bufferEnd: new TextEncoder().encode(currentValue).length + bufferStart,
      });
      return accumulator;
    }, [] as Paragraph[])
    .filter((paragraph) => paragraph.text.trim().length > 0);
};

const WordSplitter = (text: string, paragraphBufferStart: number): Word[] => {
  return text.split(spaceChar).reduce((accumulator, currentValue, currentIndex) => {
    const bufferStart =
      currentIndex === 0 ? paragraphBufferStart : accumulator[currentIndex - 1].bufferEnd + spaceCharSize;
    accumulator.push({
      text: currentValue,
      bufferStart,
      bufferEnd: new TextEncoder().encode(currentValue).length + bufferStart,
    });
    return accumulator;
  }, [] as Word[]);
};
