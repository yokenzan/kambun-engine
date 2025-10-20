import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';
import { ReadingOrderResolver } from './dist/convertor/ReadingOrderResolver.js';
import { TextGenerator } from './dist/convertor/TextGenerator.js';

const parser = new PhesocaNotationParser();
const resolver = new ReadingOrderResolver();
const generator = new TextGenerator();

const input = '将(まさ)ニ<<ス>>[レ]来タラムト。';
const result = parser.parse(input);
const words = result[0];

console.log('Input:', input);
console.log('Parsed words:');
words.forEach((word, i) => {
  console.log(`${i}: ${word.kanji} - furigana: ${word.furigana} - okurigana: ${word.okurigana} - kunten: ${word.kunten?.value} - isSaidoku: ${word.isSaidoku} - saidokuReading: ${word.saidokuReading}`);
});

console.log('\nReading order resolution:');
const readingOrder = resolver.resolve(words);
console.log('Reading order:', readingOrder);

console.log('\nFinal output:');
const output = generator.generate(words, readingOrder);
console.log('Output:', output);