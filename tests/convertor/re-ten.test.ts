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
});
