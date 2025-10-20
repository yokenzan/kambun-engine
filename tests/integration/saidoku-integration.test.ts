import { describe, test, expect } from 'vitest';
import { PhesocaNotationParser } from '../../src/parser/PhesocaNotationParser.js';
import { KakikudashiConvertor } from '../../src/convertor/KakikudashiConvertor.js';

/**
 * 再読文字の統合テスト
 * issue #2 のテストケースを検証
 */
describe('Saidoku Integration Tests', () => {
  const parser = new PhesocaNotationParser();
  const convertor = new KakikudashiConvertor();

  test('再読文字: *将(まさ)ニ<ス>[レ]来タラムト。', () => {
    const input = '*将(まさ)ニ<ス>[レ]来タラムト。';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 期待される出力: 「将に来たらむとす。」
    expect(result).toBe('将に来たらむとす。');
  });

  test('再読文字: *盍ゾ«ざル»[三]各〻言ハ[二]爾ノ志ヲ[一]。', () => {
    const input = '*盍ゾ«ざル»[三]各〻言ハ[二]爾ノ志ヲ[一]。';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 期待される出力: 「盍ぞ各〻爾の志を言はざる。」
    expect(result).toBe('盍ぞ各〻爾の志を言はざる。');
  });

  test('再読文字（レ点なし）: *将(まさ)ニ<ス>行カント。', () => {
    const input = '*将(まさ)ニ<ス>行カント。';
    const words = parser.parse(input)[0];
    const result = convertor.convert(words);

    // 期待される出力: 「将に行かんとす。」
    expect(result).toBe('将に行かんとす。');
  });

  test('再読文字のパース検証: *将(まさ)ニ<ス>[レ]来タラムト。', () => {
    const input = '*将(まさ)ニ<ス>[レ]来タラムト。';
    const words = parser.parse(input)[0];

    // パース結果の検証
    expect(words).toHaveLength(3);
    
    // 再読文字「将」の検証
    const saidokuWord = words[0];
    expect(saidokuWord.kanji).toBe('将');
    expect(saidokuWord.furigana).toBe('まさ');
    expect(saidokuWord.okurigana).toBe('ニ');
    expect(saidokuWord.isSaidoku).toBe(true);
    expect(saidokuWord.saidokuReading).toBe('ス');
    expect(saidokuWord.kunten?.value).toBe('レ');

    // 通常文字「来」の検証
    const normalWord = words[1];
    expect(normalWord.kanji).toBe('来');
    expect(normalWord.okurigana).toBe('タラムト');

    // 句点「。」の検証
    const kuten = words[2];
    expect(kuten.kanji).toBe('。');
  });

  test('再読文字のパース検証: *盍ゾ«ざル»[三]各〻言ハ[二]爾ノ志ヲ[一]。', () => {
    const input = '*盍ゾ«ざル»[三]各〻言ハ[二]爾ノ志ヲ[一]。';
    const words = parser.parse(input)[0];

    // パース結果の検証
    expect(words).toHaveLength(7);
    
    // 再読文字「盍」の検証
    const saidokuWord = words[0];
    expect(saidokuWord.kanji).toBe('盍');
    expect(saidokuWord.okurigana).toBe('ゾ');
    expect(saidokuWord.isSaidoku).toBe(true);
    expect(saidokuWord.saidokuReading).toBe('ざル');
    expect(saidokuWord.kunten?.value).toBe('三');
  });
});
