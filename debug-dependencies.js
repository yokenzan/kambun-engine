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
  console.log(`${i}: ${word.kanji} - kunten: ${word.kunten?.value}`);
});

// Let's manually check what the dependency graph should look like
console.log('\nExpected dependencies:');
console.log('Word 0 (将) has kunten レ');
console.log('Word 1 (来) has no kunten');
console.log('レ点 rule: next word -> current word');
console.log('So: 1 -> 0 (来 should be read before 将)');

console.log('\nActual reading order:');
const readingOrder = resolver.resolve(words);
console.log('Reading order:', readingOrder);

// Let's also check what the topological sort produces
console.log('\nTopological sort indices:');
const indices = readingOrder.map(unit => unit.index);
console.log('Indices:', indices);
console.log('This means: read word 1 first, then word 0, then word 2');
console.log('Expected: read word 0 first, then word 1, then word 2');