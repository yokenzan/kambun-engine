import { PhesocaNotationParser } from "./src/parser/PhesocaNotationParser.js";
import { ReadingOrderResolver } from "./src/convertor/ReadingOrderResolver.js";
import { Character } from "./src/domain/Character.js";

const parser = new PhesocaNotationParser();
const resolver = new ReadingOrderResolver();

const input = `夫レ演義~者(は)，其ノ初メ起リテ[二]_于元ノ羅貫中ヨリ[一]，_而距(いた)リ[レ]今ニ猶ホ盛行~也(なり)。`;

const result = parser.parse(input);
const words = result[0];

console.log("=== 単語リスト ===");
words.forEach((word, i) => {
  const kunten = word.kunten ? (word.kunten as any).value || word.kunten : undefined;
  const isOkiji = (word as any).isOkiji;
  console.log(`[${i}] ${word.kanji}${kunten ? `[${kunten}]` : ""}${isOkiji ? " (置き字)" : ""}`);
});

const readingOrder = resolver.resolve(words);

console.log("\n=== 読み順 ===");
readingOrder.forEach((unit, i) => {
  const word = words[unit.index];
  console.log(`${i + 1}. [${unit.index}] ${word.kanji}`);
});

console.log("\n=== 重要な箇所の分析 ===");
console.log("起点: [12] 中[一]ヨリ");
console.log("終点: [7] 起[二]リテ");
console.log("問題の語: [5-6] 其ノ初メ");
console.log("\n期待: 其ノ初メ(5-6) → 元の羅貫中より(9-12) → 起りて(7)");
console.log("実際の順番を確認:");
const indices = readingOrder.map(u => u.index);
console.log(`  5の位置: ${indices.indexOf(5) + 1}番目`);
console.log(`  6の位置: ${indices.indexOf(6) + 1}番目`);
console.log(`  7の位置: ${indices.indexOf(7) + 1}番目`);
console.log(`  12の位置: ${indices.indexOf(12) + 1}番目`);
