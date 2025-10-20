import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';
import { KakikudashiConvertor } from './dist/convertor/KakikudashiConvertor.js';
import { ReadingOrderResolver } from './dist/convertor/ReadingOrderResolver.js';

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();
const resolver = new ReadingOrderResolver();

console.log("=== 再読文字詳細デバッグ ===");

const input = '*盍ゾ«ル»[三]各〻言ハ[二]爾ノ志ヲ[一]。';
console.log(`入力: ${input}`);

const words = parser.parse(input)[0];
console.log(`単語数: ${words.length}`);

words.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - furigana: ${word.furigana} - okurigana: ${word.okurigana} - kunten: ${word.kunten?.value} - isSaidoku: ${word.isSaidoku} - saidokuReading: ${word.saidokuReading}`);
});

const readingOrder = resolver.resolve(words);
console.log(`\n読み順:`);
readingOrder.forEach((unit, i) => {
  const word = words[unit.index];
  console.log(`[${i}] index: ${unit.index}, phase: ${unit.phase}, word: ${word.kanji}`);
});

const result = convertor.convert(words);
console.log(`\n結果: ${result}`);
