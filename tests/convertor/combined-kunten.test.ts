import { describe, test, expect } from 'vitest';
import { Character } from '../../src/domain/Character.js';
import { CombinedKunten, Kunten } from '../../src/domain/Kunten.js';

// まだ実装されていないクラスのモック
class KakikudashiConvertor {
  convert(words: Character[]): string {
    throw new Error('Not implemented yet');
  }
}

describe('KakikudashiConvertor - 複合訓点', () => {
  const convertor = new KakikudashiConvertor();

  test('一レ点: 不[一レ]可[二]勝[一]数 → 勝げて数ふべからず', () => {
    const input = [
      new Character('不', CombinedKunten.ICHI_RE),
      new Character('可', Kunten.NI),
      new Character('勝', undefined, 'ゲテ'),
      new Character('数', Kunten.ICHI, 'フベ'),
      new Character('シ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('勝げて数ふべからず');
  });

  test('上レ点: 有[上レ]客[下] → 客有り', () => {
    const input = [
      new Character('有', CombinedKunten.JOU_RE, 'リ'),
      new Character('客', Kunten.GE),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('客有り');
  });

  test('甲レ点', () => {
    const input = [
      new Character('莫', CombinedKunten.KOU_RE, 'シ'),
      new Character('為', Kunten.OTSU, 'ス'),
      new Character('悪', undefined, 'ヲ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('悪を為すこと莫し');
  });
});
