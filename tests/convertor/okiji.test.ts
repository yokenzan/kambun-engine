import { describe, test, expect } from 'vitest';
import { Character } from '../../src/domain/Character.js';
import { Kunten } from '../../src/domain/Kunten.js';

// まだ実装されていないクラスのモック
class KakikudashiConvertor {
  convert(words: Character[]): string {
    throw new Error('Not implemented yet');
  }
}

describe('KakikudashiConvertor - 置き字', () => {
  const convertor = new KakikudashiConvertor();

  test('置き字は出力されない: 学_而時習之 → 学時之習', () => {
    const input = [
      new Character('学'),
      new Character('而', undefined, undefined, undefined, false, true),  // isOkiji = true
      new Character('時'),
      new Character('習'),
      new Character('之'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('学時習之');
  });

  test('置き字と返り点の組み合わせ', () => {
    const input = [
      new Character('読', undefined, 'ム'),
      new Character('書', Kunten.NI, 'ヲ'),
      new Character('於', undefined, undefined, undefined, false, true),  // 置き字
      new Character('家', Kunten.ICHI, 'ニ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('家に書を読む');
  });

  test('助字の処理: ~者(は) → は', () => {
    const input = [
      new Character('子', undefined, undefined, undefined, true),  // isJojiOrJodoushi = true
      new Character('曰', undefined, 'ハク'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果（助字は振り仮名で読む）
    // expect(convertor.convert(input)).toBe('子曰はく');
  });
});
