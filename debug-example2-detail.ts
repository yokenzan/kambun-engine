import { PhesocaNotationParser } from "./src/parser/PhesocaNotationParser.js";
import { KakikudashiConvertor } from "./src/convertor/KakikudashiConvertor.js";

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();

console.log("=== 例文2の詳細分析 ===\n");

const input = `夫レ演義~者(は)，其ノ初メ起リテ[二]_于元ノ羅貫中ヨリ[一]，_而距(いた)リ[レ]今ニ猶ホ盛行~也(なり)。`;

console.log("入力:");
console.log(input);
console.log();

const result = parser.parse(input);
const words = result[0];

console.log("パース結果:");
words.forEach((word, i) => {
  const kunten = word.kunten ? (word.kunten as any).value || word.kunten : undefined;
  const isOkiji = (word as any).isOkiji;
  console.log(`[${i}] ${word.kanji}${kunten ? `[${kunten}]` : ""}${word.okurigana || ""}${isOkiji ? " (置き字)" : ""}`);
});
console.log();

const output = convertor.convert(words);
console.log("実際の出力:");
console.log(output);
console.log();

console.log("期待される出力:");
console.log("夫れ演義は，其の初め元の羅貫中より起りて，今に距り猶ほ盛行なり。");
console.log();

console.log("分析:");
console.log("問題箇所: 「其ノ初メ起リテ[二]_于元ノ羅貫中ヨリ[一]」");
console.log();
console.log("期待される読み順:");
console.log("1. 其ノ初メ（起点[一]より前、句読点「，」より後）");
console.log("2. 元ノ羅貫中ヨリ[一]（起点）");
console.log("3. 起リテ[二]（終点）");
console.log();
console.log("実際の読み順:");
console.log("おそらく「元の羅貫中より」→「起りて」→「其の初め」");
