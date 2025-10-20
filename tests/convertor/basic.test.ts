import { describe, test, expect } from "vitest";
import { Character } from "../../src/domain/Character.js";
import { Kunten } from "../../src/domain/Kunten.js";
import { KakikudashiConvertor } from "../../src/convertor/KakikudashiConvertor.js";

describe("KakikudashiConvertor - 基本機能", () => {
  const convertor = new KakikudashiConvertor();

  test("訓点なしの文字列", () => {
    const input = [new Character("山"), new Character("川")];

    expect(convertor.convert(input)).toBe("山川");
  });

  test("送り仮名の変換（カタカナ→ひらがな）", () => {
    const input = [new Character("見", undefined, "ル")];

    expect(convertor.convert(input)).toBe("見る");
  });

  test("複数の文字と送り仮名", () => {
    const input = [new Character("春"), new Character("眠", undefined, "リ")];

    expect(convertor.convert(input)).toBe("春眠り");
  });
});
