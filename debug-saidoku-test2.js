import { PhesocaNotationParser } from './dist/parser/PhesocaNotationParser.js';
import { KakikudashiConvertor } from './dist/convertor/KakikudashiConvertor.js';

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();

console.log("=== 再読文字デバッグ2 ===");

const input = '*盍ゾ«ル»[三]各〻言ハ[二]爾ノ志ヲ[一]。';
console.log(`入力: ${input}`);

const words = parser.parse(input)[0];
console.log(`単語数: ${words.length}`);

words.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji} - furigana: ${word.furigana} - okurigana: ${word.okurigana} - kunten: ${word.kunten?.value} - isSaidoku: ${word.isSaidoku} - saidokuReading: ${word.saidokuReading}`);
});

const result = convertor.convert(words);
console.log(`結果: ${result}`);
