import { describe, test, expect } from 'vitest';
import { Character } from '../../src/domain/Character.js';
import { ReadingOrderResolver } from '../../src/convertor/ReadingOrderResolver.js';
import { ReadingPhase } from '../../src/domain/types.js';

describe('ReadingOrderResolver - 再読文字', () => {
  const resolver = new ReadingOrderResolver();

  test('基本的な再読文字: *未<ず> → ず...未だ', () => {
    const input = [
      new Character('未', undefined, undefined, undefined, false, false, true, 'ず'),
      new Character('。'),
    ];

    const result = resolver.resolve(input);

    // 2回目が先、1回目が句点の前
    expect(result).toEqual([
      { index: 0, phase: ReadingPhase.SAIDOKU_SECOND },
      { index: 0, phase: ReadingPhase.SAIDOKU_FIRST },
      { index: 1, phase: ReadingPhase.NORMAL },
    ]);
  });

  test('複数の再読文字が含まれる文', () => {
    const input = [
      new Character('未', undefined, undefined, undefined, false, false, true, 'ず'),
      new Character('将', undefined, undefined, undefined, false, false, true, 'ん'),
      new Character('。'),
    ];

    const result = resolver.resolve(input);

    // 両方の2回目が先、1回目が句点の前
    expect(result[0].phase).toBe(ReadingPhase.SAIDOKU_SECOND);
    expect(result[1].phase).toBe(ReadingPhase.SAIDOKU_SECOND);
    // 1回目の読みは句点の前
    expect(result[result.length - 2].phase).toBe(ReadingPhase.SAIDOKU_FIRST);
  });

  test('句読点がない場合の再読文字', () => {
    const input = [
      new Character('未', undefined, undefined, undefined, false, false, true, 'ず'),
    ];

    const result = resolver.resolve(input);

    // 2回目が先、1回目が末尾
    expect(result).toEqual([
      { index: 0, phase: ReadingPhase.SAIDOKU_SECOND },
      { index: 0, phase: ReadingPhase.SAIDOKU_FIRST },
    ]);
  });

  test('文頭の再読文字', () => {
    const input = [
      new Character('未', undefined, undefined, undefined, false, false, true, 'ず'),
      new Character('知', undefined, 'ラ'),
      new Character('。'),
    ];

    const result = resolver.resolve(input);

    // スコープの先頭（文頭）に2回目が配置される
    expect(result[0]).toEqual({ index: 0, phase: ReadingPhase.SAIDOKU_SECOND });
  });
});
