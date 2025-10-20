import { Character } from '../../src/domain/Character.js';
import { KakikudashiConvertor } from '../../src/convertor/KakikudashiConvertor.js';

describe('KakikudashiConvertor - 割注 (Warichu)', () => {
  const convertor = new KakikudashiConvertor();

  test('基本的な割注の変換', () => {
    const input = [
      new Character('山', undefined, undefined, undefined, false, false, false, undefined, '高い山'),
      new Character('川')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('山（高い山）川');
  });

  test('送り仮名と割注の組み合わせ', () => {
    const input = [
      new Character('見', undefined, 'ル', undefined, false, false, false, undefined, '見ること')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('見る（見ること）');
  });

  test('振り仮名と割注の組み合わせ', () => {
    const input = [
      new Character('春', undefined, undefined, 'はる', false, false, false, undefined, '春の季節')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('春（春の季節）');
  });

  test('助字と割注の組み合わせ', () => {
    const input = [
      new Character('不', undefined, undefined, 'ず', true, false, false, undefined, '否定の助字')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('ず（否定の助字）');
  });

  test('複数の割注', () => {
    const input = [
      new Character('山', undefined, undefined, undefined, false, false, false, undefined, '高い山'),
      new Character('川', undefined, undefined, undefined, false, false, false, undefined, '流れる水')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('山（高い山）川（流れる水）');
  });

  test('割注なしの文字', () => {
    const input = [
      new Character('山'),
      new Character('川')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('山川');
  });

  test('空の割注', () => {
    const input = [
      new Character('山', undefined, undefined, undefined, false, false, false, undefined, ''),
      new Character('川')
    ];

    const result = convertor.convert(input);
    expect(result).toBe('山（）川');
  });
});
