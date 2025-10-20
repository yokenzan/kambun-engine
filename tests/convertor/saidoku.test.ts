import { describe, test, expect } from "vitest";
import { Character } from "../../src/domain/Character.js";
import { Kunten } from "../../src/domain/Kunten.js";

// まだ実装されていないクラスのモック
class KakikudashiConvertor {
  convert(words: Character[]): string {
    throw new Error("Not implemented yet");
  }
}

describe("KakikudashiConvertor - 再読文字", () => {
  const convertor = new KakikudashiConvertor();

  test("未（いまだ）: *未(いま)ダ[レ]見ズ → いまだ見ず", () => {
    const input = [
      new Character(
        "未",
        undefined,
        "ダ",
        "いま",
        false,
        false,
        true, // isSaidoku
        "ず", // saidokuReading
      ),
      new Character("見", Kunten.RE),
    ];

    expect(() => convertor.convert(input)).toThrow("Not implemented yet");
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('いまだ見ず');
  });

  test("将（まさに）: *将(まさ)ニ[レ]来ラントス → まさに来らんとす", () => {
    const input = [
      new Character(
        "将",
        undefined,
        "ニ",
        "まさ",
        false,
        false,
        true,
        "んとす",
      ),
      new Character("来", Kunten.RE, "ラ"),
    ];

    expect(() => convertor.convert(input)).toThrow("Not implemented yet");
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('まさに来らんとす');
  });

  test("宜（よろしく）: *宜(よろ)シク[レ]弁ズベシ → よろしく弁ずべし", () => {
    const input = [
      new Character(
        "宜",
        undefined,
        "シク",
        "よろ",
        false,
        false,
        true,
        "べし",
      ),
      new Character("弁", Kunten.RE, "ズ"),
    ];

    expect(() => convertor.convert(input)).toThrow("Not implemented yet");
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('よろしく弁ずべし');
  });
});
