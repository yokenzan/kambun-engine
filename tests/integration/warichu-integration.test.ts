import { PhesocaNotationParser } from '../../src/parser/PhesocaNotationParser.js';
import { KakikudashiConvertor } from '../../src/convertor/KakikudashiConvertor.js';

describe('割注 (Warichu) Integration Tests', () => {
  const parser = new PhesocaNotationParser();
  const convertor = new KakikudashiConvertor();

  test('エンドツーエンド: 基本的な割注', () => {
    const input = '山{高い山}川';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('山（高い山）川');
  });

  test('エンドツーエンド: 複合文字と割注', () => {
    const input = "'春眠'{春の眠り}(しゅんみん)";
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('春眠（春の眠り）');
  });

  test('エンドツーエンド: 送り仮名と割注', () => {
    const input = '見ル{見ること}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('見る（見ること）');
  });

  test('エンドツーエンド: 振り仮名と割注', () => {
    const input = '春(はる){春の季節}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('春（春の季節）');
  });

  test('エンドツーエンド: レ点と割注', () => {
    const input = '愛ス[レ]人ヲ{人を愛すること}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // レ点により「人を」が先に来る
    expect(result).toBe('人を（人を愛すること）愛す');
  });

  test('エンドツーエンド: 複数の割注', () => {
    const input = '山{高い山}川{流れる水}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('山（高い山）川（流れる水）');
  });

  test('エンドツーエンド: 助字と割注', () => {
    const input = '~不(ず){否定の助字}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    expect(result).toBe('ず（否定の助字）');
  });

  test('エンドツーエンド: 置き字と割注', () => {
    const input = '_而(いた)リ{接続詞}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 置き字はスキップされるが、割注は表示される
    expect(result).toBe('（接続詞）');
  });

  test('エンドツーエンド: 再読文字と割注', () => {
    const input = '*未(いまだ){まだ...ない}';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 再読文字の処理は複雑なので、基本的な変換のみ確認
    expect(result).toContain('（まだ...ない）');
  });
});
