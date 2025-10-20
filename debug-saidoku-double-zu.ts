import { PhesocaNotationParser } from "./src/parser/PhesocaNotationParser.js";
import { KakikudashiConvertor } from "./src/convertor/KakikudashiConvertor.js";

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();

console.log("=== 再読文字の「ず」問題検証 ===\n");

console.log("入力: *未(いま)ダ<ズ>[レ]知ラズ。");
const input1 = `*未(いま)ダ<ズ>[レ]知ラズ。`;
const result1 = parser.parse(input1);
const words1 = result1[0];

console.log("\nパース結果:");
words1.forEach((word, i) => {
  console.log(`[${i}] ${word.kanji}`, {
    kunten: word.kunten ? (word.kunten as any).value || word.kunten : undefined,
    okurigana: word.okurigana,
    furigana: word.furigana,
    isSaidoku: (word as any).isSaidoku,
    saidokuReading: (word as any).saidokuReading,
  });
});

const output1 = convertor.convert(words1);
console.log("\n変換結果:");
console.log(`"${output1}"`);

console.log("\n期待される動作:");
console.log('「未だ知らずず」が出力されている');
console.log('- 「未だ」= 再読2回目（漢字+送り仮名）');
console.log('- 「知らず」= 知[レ]の読み + okurigana「ズ」');
console.log('- 「ず」= 再読1回目（saidokuReading）');

console.log("\n問題の分析:");
console.log('「知」の送り仮名「ラズ」の「ズ」と、再読1回目の「ズ」が重複している可能性');
console.log('入力記法の意図を確認する必要がある：');
console.log('  案1: 知の送り仮名は「ラ」のみで、「ズ」は不要');
console.log('  案2: 再読1回目の<ズ>は不要（デフォルト辞書で「ず」を取得）');
console.log('  案3: 仕様通りの動作で、「知らずず」が正しい');
