import { ReadingOrderResolver } from "./src/convertor/ReadingOrderResolver.js";
import { Character } from "./src/domain/Character.js";
import { Kunten, CombinedKunten } from "./src/domain/Kunten.js";

const resolver = new ReadingOrderResolver();

console.log("=== テストケース1: 複数のレ点 ===");
console.log("入力: 不[レ]見[レ]山ヲ");
const test1 = [
  new Character("不", Kunten.RE),
  new Character("見", Kunten.RE),
  new Character("山", undefined, "ヲ"),
];
const result1 = resolver.resolve(test1);
console.log("実際の結果:", result1);
console.log("期待される結果:", [
  { index: 1, phase: "NORMAL" }, // 見
  { index: 0, phase: "NORMAL" }, // 不
  { index: 2, phase: "NORMAL" }, // 山ヲ
]);
console.log("漢文レ点ルール: 一番下まで行ってから順に上に返る");
console.log("つまり: 山ヲ → 見 → 不 が正しいはず");
console.log();

console.log("=== テストケース2: 一二点 ===");
console.log("入力: 登ル山[二]ニ水[一]ヲ");
const test2 = [
  new Character("登", undefined, "ル"),
  new Character("山", Kunten.NI, "ニ"),
  new Character("水", Kunten.ICHI, "ヲ"),
];
const result2 = resolver.resolve(test2);
console.log("実際の結果:", result2);
console.log("期待される結果:", [
  { index: 2, phase: "NORMAL" }, // 水ヲ (一点: 起点)
  { index: 1, phase: "NORMAL" }, // 山ニ (二点: 終点)
  { index: 0, phase: "NORMAL" }, // 登ル
]);
console.log("一二点ルール: 起点[一]を先に読み、終点[二]を後に読む");
console.log();

console.log("=== テストケース3: 一レ点 ===");
console.log("入力: 不[一レ]可勝[一]ゲテ");
const test3 = [
  new Character("不", CombinedKunten.ICHI_RE),
  new Character("可"),
  new Character("勝", Kunten.ICHI, "ゲテ"),
];
const result3 = resolver.resolve(test3);
console.log("実際の結果:", result3);
console.log("期待される結果:", [
  { index: 1, phase: "NORMAL" }, // 可（一レ点で隣を先読み）
  { index: 2, phase: "NORMAL" }, // 勝ゲテ（一点の終点）
  { index: 0, phase: "NORMAL" }, // 不（起点）
]);
console.log("一レ点ルール: 次の文字 → 終点 → 起点");
console.log();

console.log("=== テストケース4: 上レ点 ===");
console.log("入力: 有[上レ]リ客[下]");
const test4 = [
  new Character("有", CombinedKunten.JOU_RE, "リ"),
  new Character("客", Kunten.GE),
];
const result4 = resolver.resolve(test4);
console.log("実際の結果:", result4);
console.log("期待される結果:", [
  { index: 1, phase: "NORMAL" }, // 客（レ点の効果）
  { index: 0, phase: "NORMAL" }, // 有リ（起点）
]);
console.log("上レ点ルール: レ点の効果で隣を先に読み、その後起点");
console.log();

console.log("=== 分析 ===");
console.log("もし実際の結果が全て逆順なら、依存グラフの方向が逆の可能性");
console.log("もし実際の結果が順番通りなら、依存グラフが構築されていない可能性");
