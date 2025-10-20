import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';

const parser = new PhesocaNotationParser();

console.log("=== パーサー詳細デバッグ ===");

// テストケース1: 角括弧記法
const input1 = '*将(まさ)ニ<ス>[レ]来タラムト。';
console.log(`入力1: ${input1}`);
const words1 = parser.parse(input1)[0];
words1.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - saidokuReading: "${word.saidokuReading}"`);
});

console.log('\n---');

// テストケース2: ギュメ記法
const input2 = '*盍ゾ«ル»[三]各〻言ハ[二]爾ノ志ヲ[一]。';
console.log(`入力2: ${input2}`);
const words2 = parser.parse(input2)[0];
words2.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - saidokuReading: "${word.saidokuReading}"`);
});

console.log('\n---');

// テストケース3: より複雑なギュメ記法
const input3 = '*盍ゾ«ざル»[三]';
console.log(`入力3: ${input3}`);
const words3 = parser.parse(input3)[0];
words3.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - saidokuReading: "${word.saidokuReading}"`);
});
