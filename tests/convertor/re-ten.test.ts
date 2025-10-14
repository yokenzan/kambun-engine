import { describe, test, expect } from 'vitest';
import { Character } from '../../src/domain/Character.js';
import { Kunten } from '../../src/domain/Kunten.js';
import { KakikudashiConvertor } from '../../src/convertor/KakikudashiConvertor.js';

describe('KakikudashiConvertor - レ点', () => {
  const convertor = new KakikudashiConvertor();

  test('基本的なレ点: 愛ス[レ]人ヲ → 人を愛す', () => {
    const input = [
      new Character('愛', undefined, 'ス'),
      new Character('人', Kunten.RE, 'ヲ'),
    ];

    expect(convertor.convert(input)).toBe('人を愛す');
  });

  test('レ点: 不[レ]見 → 見不（みず）', () => {
    const input = [
      new Character('不', Kunten.RE),
      new Character('見'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('見不');
  });

  test('複数のレ点: 不[レ]見[レ]山ヲ → 山を見不', () => {
    const input = [
      new Character('不', Kunten.RE),
      new Character('見', Kunten.RE),
      new Character('山', undefined, 'ヲ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('山を見不');
  });

  test('送り仮名とレ点の組み合わせ', () => {
    const input = [
      new Character('愛', Kunten.RE, 'シ'),
      new Character('人', undefined, 'ヲ'),
    ];

    expect(() => convertor.convert(input)).toThrow('Not implemented yet');
    // 実装後は以下が期待される結果
    // expect(convertor.convert(input)).toBe('人を愛し');
  });
});
