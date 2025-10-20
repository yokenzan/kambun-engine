import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';

const parser = new PhesocaNotationParser();

console.log("=== パーサーデバッグ ===");

const input = '*盍ゾ«ル»[三]';
console.log(`入力: ${input}`);

const words = parser.parse(input)[0];
console.log(`単語数: ${words.length}`);

words.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - furigana: ${word.furigana} - okurigana: ${word.okurigana} - kunten: ${word.kunten?.value} - isSaidoku: ${word.isSaidoku} - saidokuReading: "${word.saidokuReading}"`);
});
