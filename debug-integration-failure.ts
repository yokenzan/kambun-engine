import { PhesocaNotationParser } from "./src/parser/PhesocaNotationParser.js";
import { KakikudashiConvertor } from "./src/convertor/KakikudashiConvertor.js";

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();

console.log("=== 統合テスト失敗の調査 ===\n");

console.log("テストケース: シンプルな例 - 己所不欲勿施於人");
console.log("入力: 己ノ所(ところ)[レ]~不(ざ)ル[レ]欲セ、勿(なか)レ[レ]施(ほどこ)ス[二]_於人(ひと)ニ[一]。\n");

const input = `己ノ所(ところ)[レ]~不(ざ)ル[レ]欲セ、勿(なか)レ[レ]施(ほどこ)ス[二]_於人(ひと)ニ[一]。`;
const result = parser.parse(input);
const words = result[0];

console.log("パース結果:");
words.forEach((word, i) => {
  const kunten = word.kunten ? (word.kunten as any).value || word.kunten : undefined;
  console.log(`[${i}] ${word.kanji}${kunten ? `[${kunten}]` : ""}${word.okurigana || ""}`);
});

const output = convertor.convert(words);
console.log("\n実際の出力:");
console.log(`"${output}"`);

console.log("\n期待される出力:");
console.log(`"己の欲せざる所、人に施す勿れ。"`);

console.log("\n分析:");
console.log("期待: 己の欲せざる所、人に施す勿れ。");
console.log("実際: 人に施す己の欲せざる所、勿れ。");
console.log("\n問題: 一二点の処理で、句点「、」より前の部分が一二点の後に読まれている");
console.log("原因候補:");
console.log("  1. 一二点の依存関係が句読点を考慮していない");
console.log("  2. 終点より前の文字への依存が、句読点を超えて適用されている");
