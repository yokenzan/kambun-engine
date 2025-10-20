import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';
import { ReadingOrderResolver } from './dist/convertor/ReadingOrderResolver.js';

const parser = new PhesocaNotationParser();
const resolver = new ReadingOrderResolver();

const input = '将(まさ)ニ<<ス>>[レ]来タラムト。';
const result = parser.parse(input);
const words = result[0];

console.log('Input:', input);
console.log('Parsed words:');
words.forEach((word, i) => {
  console.log(`${i}: ${word.kanji} - kunten: ${word.kunten?.value} - kunten type: ${word.kunten?.constructor.name}`);
});

console.log('\nChecking kunten details:');
words.forEach((word, i) => {
  if (word.kunten) {
    console.log(`Word ${i} kunten:`, {
      value: word.kunten.value,
      isStartingPoint: word.kunten.isStartingPoint,
      jumpStrategy: word.kunten.jumpStrategy
    });
  }
});

console.log('\nResolving reading order...');
const readingOrder = resolver.resolve(words);
console.log('Reading order:', readingOrder);