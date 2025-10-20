import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';

const parser = new PhesocaNotationParser();
const input = '将(まさ)ニ<<ス>>[レ]来タラムト。';
const result = parser.parse(input);

console.log('Input:', input);
console.log('Parsed words:');
result[0].forEach((word, i) => {
  console.log(`${i}: ${word.kanji} - furigana: ${word.furigana} - okurigana: ${word.okurigana} - kunten: ${word.kunten?.value} - isSaidoku: ${word.isSaidoku} - saidokuReading: ${word.saidokuReading}`);
});