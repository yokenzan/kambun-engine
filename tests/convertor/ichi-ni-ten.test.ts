import { describe, test, expect } from 'vitest';
import { Character } from '../../src/domain/Character.js';
import { Kunten } from '../../src/domain/Kunten.js';

// まだ実装されていないクラスのモック
class KakikudashiConvertor {
  convert(words: Character[]): string {
    throw new Error('Not implemented yet');
  }
}

describe('KakikudashiConvertor - 一二三点', () => {
  const convertor = new KakikudashiConvertor();

  test('基本的な一二点: 登ル[二]山ニ[一] → 山に登る', () => {
    const input = [
      new Character('登', undefined, 'ル'),
      new Character('山', Kunten.NI, 'ニ'),
      new Character('水', Kunten.ICHI, 'ヲ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('水を山に登る');
  });

  test('一二三点: 読ム[三]書ヲ[二]於家ニ[一] → 家に於いて書を読む', () => {
    const input = [
      new Character('読', undefined, 'ム'),
      new Character('書', Kunten.SAN, 'ヲ'),
      new Character('於'),
      new Character('家', Kunten.NI, 'ニ'),
      new Character('テ', Kunten.ICHI),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('家にて於いて書を読む');
  });

  test('起点と終点の組み合わせ', () => {
    const input = [
      new Character('有', undefined, 'リ'),
      new Character('客', Kunten.NI),
      new Character('自', Kunten.ICHI),
      new Character('遠方'),
      new Character('来', undefined, 'タル'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('遠方より来たる客有り');
  });
});
