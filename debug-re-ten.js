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

console.log('\nレ点のルール:');
console.log('レ点がある文字の次の文字を先に読む');
console.log('つまり: 将[レ]来 → 来を先に読む → 来→将の順');

console.log('\n現在の出力: 来たらむと将に。す');
console.log('期待される出力: 将に来たらむとす。');

console.log('\n問題: レ点の効果が逆になっている可能性');
console.log('レ点がある場合: 次の文字 -> 現在の文字');
console.log('つまり: 来 -> 将 の順で読むべき');

console.log('\n実際の読み順:');
const readingOrder = resolver.resolve(words);
console.log('Reading order:', readingOrder);
console.log('Indices:', readingOrder.map(unit => unit.index));
console.log('これは: 来(1) -> 将(0) -> 。(2) -> 将(0)');
console.log('期待: 将(0) -> 来(1) -> 。(2) -> 将(0)');