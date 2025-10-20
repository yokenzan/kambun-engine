import { describe, test, expect } from 'vitest';
import { ReadingOrderResolver } from '../../src/convertor/ReadingOrderResolver.js';
import { Character } from '../../src/domain/Character.js';
import { Kunten, CombinedKunten } from '../../src/domain/Kunten.js';
import { ReadingPhase } from '../../src/domain/types.js';

describe('ReadingOrderResolver', () => {
  const resolver = new ReadingOrderResolver();

  test('訓点なし → 順番通り', () => {
    const input = [
      new Character('山'),
      new Character('川'),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 0, phase: ReadingPhase.NORMAL },
      { index: 1, phase: ReadingPhase.NORMAL },
    ]);
  });

  test('レ点 → 順序反転', () => {
    const input = [
      new Character('愛', undefined, 'ス'),
      new Character('人', Kunten.RE),
    ];

    const order = resolver.resolve(input);

    expect(order).toEqual([
      { index: 1, phase: ReadingPhase.NORMAL },  // 人
      { index: 0, phase: ReadingPhase.NORMAL },  // 愛ス
    ]);
  });
});
