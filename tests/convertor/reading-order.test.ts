import { describe, test, expect } from "vitest";
import { ReadingOrderResolver } from "../../src/convertor/ReadingOrderResolver.js";
import { Character } from "../../src/domain/Character.js";
import { Kunten, CombinedKunten } from "../../src/domain/Kunten.js";
import { ReadingPhase } from "../../src/domain/types.js";

describe("ReadingOrderResolver", () => {
  const resolver = new ReadingOrderResolver();

  test("訓点なし → 順番通り", () => {
    const input = [new Character("山"), new Character("川")];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 0, phase: ReadingPhase.NORMAL },
      { index: 1, phase: ReadingPhase.NORMAL },
    ]);
  });

  test("レ点 → 順序反転", () => {
    const input = [
      new Character("愛", undefined, "ス"),
      new Character("人", Kunten.RE),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 1, phase: ReadingPhase.NORMAL }, // 人
      { index: 0, phase: ReadingPhase.NORMAL }, // 愛ス
    ]);
  });

  test("複数のレ点", () => {
    const input = [
      new Character("不", Kunten.RE),
      new Character("見", Kunten.RE),
      new Character("山", undefined, "ヲ"),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 1, phase: ReadingPhase.NORMAL }, // 見
      { index: 0, phase: ReadingPhase.NORMAL }, // 不
      { index: 2, phase: ReadingPhase.NORMAL }, // 山ヲ
    ]);
  });

  test("一二点", () => {
    const input = [
      new Character("登", undefined, "ル"),
      new Character("山", Kunten.NI, "ニ"),
      new Character("水", Kunten.ICHI, "ヲ"),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 2, phase: ReadingPhase.NORMAL }, // 水ヲ
      { index: 1, phase: ReadingPhase.NORMAL }, // 山ニ
      { index: 0, phase: ReadingPhase.NORMAL }, // 登ル
    ]);
  });

  test("一レ点", () => {
    const input = [
      new Character("不", CombinedKunten.ICHI_RE),
      new Character("可"),
      new Character("勝", Kunten.ICHI, "ゲテ"),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 1, phase: ReadingPhase.NORMAL }, // 可（一レ点で隣を先読み）
      { index: 2, phase: ReadingPhase.NORMAL }, // 勝ゲテ（一点の終点）
      { index: 0, phase: ReadingPhase.NORMAL }, // 不（起点）
    ]);
  });

  test("上レ点", () => {
    const input = [
      new Character("有", CombinedKunten.JOU_RE, "リ"),
      new Character("客", Kunten.GE),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 1, phase: ReadingPhase.NORMAL }, // 客（レ点の効果）
      { index: 0, phase: ReadingPhase.NORMAL }, // 有リ（起点）
    ]);
  });
});
