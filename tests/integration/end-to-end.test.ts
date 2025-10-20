import { describe, test, expect } from "vitest";
import { PhesocaNotationParser } from "../../src/parser/PhesocaNotationParser.js";
import { KakikudashiConvertor } from "../../src/convertor/KakikudashiConvertor.js";

/**
 * エンドツーエンド統合テスト
 * Phesoca記法のパース → 書き下し変換
 */
describe("End-to-End Integration Tests", () => {
  const parser = new PhesocaNotationParser();
  const convertor = new KakikudashiConvertor();

  test("シンプルな例: 山川", () => {
    const input = "山川";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe("山川");
  });

  test("送り仮名: 見ル", () => {
    const input = "見ル";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe("見る");
  });

  test("レ点: 愛ス[レ]人ヲ", () => {
    const input = "愛ス[レ]人ヲ";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // レ点により「人を」が先に来る
    expect(result).toBe("人を愛す");
  });

  test("振り仮名: 春(はる)眠(ねむ)リ", () => {
    const input = "春(はる)眠(ねむ)リ";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe("春眠り");
  });

  test("複合文字: '春眠'(しゅんみん)", () => {
    const input = "'春眠'(しゅんみん)";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe("春眠");
  });

  test("助字: ~不(ず)", () => {
    const input = "~不(ず)";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 助字は振り仮名で読む
    expect(result).toBe("ず");
  });

  test("置き字: 学ビテ_而時ニ", () => {
    const input = "学ビテ_而時ニ";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 「而」（置き字）は読まない
    expect(result).toBe("学びて時に");
  });

  test("複合例: '春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ", () => {
    const input = "'春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 暁を → 覚え → ず
    expect(result).toBe("春眠、暁を覚えず");
  });
});
