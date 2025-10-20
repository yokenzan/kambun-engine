import { describe, test, expect } from "vitest";
import { PhesocaNotationParser } from "../../src/parser/PhesocaNotationParser.js";
import { KakikudashiConvertor } from "../../src/convertor/KakikudashiConvertor.js";

/**
 * Main.ktの統合テストケース
 * Kotlin版のMain.ktで使用されている実際の例文を使用
 */
describe("Main.kt Integration Tests", () => {
  const parser = new PhesocaNotationParser();
  const convertor = new KakikudashiConvertor();

  test("例文1: 春眠不覚暁 + 己所不欲勿施於人", () => {
    const input = `'春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ。
己ノ所(ところ)[レ]~不(ざ)ル[レ]欲セ、勿(なか)レ[レ]施(ほどこ)ス[二]_於人(ひと)ニ[一]。`;

    const result = parser.parse(input);
    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();

    // パースが成功することを確認（詳細な検証は後で）
    expect(result[0].length).toBeGreaterThan(0);
  });

  test("例文2: 夫演義者（三国演義序文）", () => {
    const input = `夫レ演義~者(は)，其ノ初メ起リテ[二]_于元ノ羅貫中ヨリ[一]，_而距(いた)リ[レ]今ニ猶ホ盛行~也(なり)。`;

    const result = parser.parse(input);
    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(result[0].length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe(
      "夫れ演義は，其の初め元の羅貫中より起りて，今に距り猶ほ盛行なり。",
    );
  });

  test("例文3: 蓋貫中者（三国演義序文・続き）", () => {
    const input = `蓋シ貫中~者(は)，當時賢才ナルコト'白眉'ニシテ[二]_于眾ニオイテ[一]，_而功名~不(ず)[レ]如カ，故ニ其ノ心~不(ず)[レ]平ラカナラ，遂ニ私カニ著ス[二]《三國志演義》~與(と)《忠義水滸傳》トヲ[一]，乃チ託シ[二]事ヲ_於彼ニ[一]，舒(の)ベ[二]志ヲ_於己ニ[一]，而テ示ス[二]諸(これ)ヲ天下~之(の)人ニ[一]~也(なり)。`;

    const result = parser.parse(input);
    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(result[0].length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe(
      "蓋し貫中は，當時賢才なること眾において白眉にして，功名如かず，故に其の心平らかならず，遂に私かに《三國志演義》と《忠義水滸傳》とを著す，乃ち事を彼に託し，志を己に舒べ，而て諸を天下の人に示すなり。",
    );
  });

  test("例文4: 先儒皆称之曰（三国演義序文・さらに続き）", () => {
    const input = `先儒皆稱(たた)[レ]ヘテ之ヲ曰ハク:「是ノ二書~者(は)，貫中一生ノ精神ニシテ，半世ノ英氣ナリ。而テ文章~之(の)雄，才華~之(の)秀，見ユル[二]_于其ノ中ニ[一]~也(ナリ)。且ツ其ノ為セル[レ]文ヲ~之(の)法，敘(の)ブル[レ]事ヲ~之(の)式，別レテ成ス[二]一體ヲ[一]。而テ其ノ揮筆~之(の)下，有リ~也(や)無シ~也(や)，事ハ盡クス[二]天下~之(の)事ヲ[一]；雅ナル~也(や)俗ナル~也(や)，語リハ盡クス[二]人間~之(の)語リヲ[一]_焉。至レバ[二]_于變化~之(の)妙，'宛轉'(えんてん)~之(の)奇，自然ニシテ_而然ルニ[一]_者，非ザル[三]近代諸家雜書~之(の)所ニ[二]能ク比ブル[一]~也(なり)。故ニ中華~之(の)讀ム[レ]_焉(これ)ヲ者ハ，類(おほむ)ネ多ク忘レテ[レ]食ヲ_而~不(ず)[レ]厭(あ)カ，秉リテ[レ]燭ヲ_而~不(ざ)ル[レ]倦(あ)カ~也(なり)。」`;

    const result = parser.parse(input);
    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(result[0].length).toBeGreaterThan(0);
  });

  test("シンプルな例: 春眠不覚暁", () => {
    const input = `'春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ。`;

    const result = parser.parse(input);
    const words = result[0];

    // 基本的なパースの検証
    expect(words.length).toBeGreaterThan(0);

    // 最初の単語が「春眠」であることを確認
    expect(words[0].kanji).toBe("春眠");
    expect(words[0].furigana).toBe("しゅんみん");
  });

  test("シンプルな例: 己所不欲勿施於人", () => {
    const input = `己ノ所(ところ)[レ]~不(ざ)ル[レ]欲セ、勿(なか)レ[レ]施(ほどこ)ス[二]_於人(ひと)ニ[一]。`;

    const result = parser.parse(input);
    const words = result[0];

    expect(words.length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe("己の欲せざる所、人に施す勿れ。");
  });

  test("再読文字: *将(まさ)ニ<ス>[レ]来タラムト", () => {
    const input = `*将(まさ)ニ<ス>[レ]来タラムト。`;

    const result = parser.parse(input);
    const words = result[0];

    expect(words.length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe("将に来たらむとす。");
  });

  test("再読文字: *未(いま)ダ<ズ>[レ]知ラズ", () => {
    const input = `*未(いま)ダ<ズ>[レ]知ラズ。`;

    const result = parser.parse(input);
    const words = result[0];

    expect(words.length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe("未だ知らずず。");
  });

  test("再読文字（レ点なし）: *将(まさ)ニ<ス>[レ]行カント", () => {
    const input = `*将(まさ)ニ<ス>[レ]行カント。`;

    const result = parser.parse(input);
    const words = result[0];

    expect(words.length).toBeGreaterThan(0);

    const kakikudashiResult = convertor.convert(result[0]);
    expect(kakikudashiResult).toBe("将に行かんとす。");
  });
});
