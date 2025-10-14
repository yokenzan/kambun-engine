import { describe, test, expect } from 'vitest';
import { PhesocaNotationParser } from '../../src/parser/PhesocaNotationParser.js';
import { Character, CompoundCharacter } from '../../src/domain/Character.js';
import { Kunten } from '../../src/domain/Kunten.js';

/**
 * パーサーのデバッグ用テスト
 * Geminiの指摘に基づいて問題を特定
 */
describe('PhesocaNotationParser - Debug', () => {
  const parser = new PhesocaNotationParser();

  test("DEBUG: 複合文字 '春眠'(しゅんみん) のパース", () => {
    const input = "'春眠'(しゅんみん)";
    const result = parser.parse(input);
    const words = result[0];

    console.log('=== 複合文字パース結果 ===');
    console.log('入力:', input);
    console.log('単語数:', words.length);
    words.forEach((word, i) => {
      console.log(`[${i}]`, {
        type: word.constructor.name,
        kanji: word.kanji,
        furigana: word.furigana,
        okurigana: word.okurigana,
        kunten: word.kunten,
      });
    });

    // 期待: CompoundCharacterが1つ
    expect(words.length).toBe(1);
    expect(words[0]).toBeInstanceOf(CompoundCharacter);
    expect(words[0].kanji).toBe('春眠');
    expect(words[0].furigana).toBe('しゅんみん');
  });

  test('DEBUG: レ点 愛ス人[レ]ヲ のパース', () => {
    const input = '愛ス人[レ]ヲ';
    const result = parser.parse(input);
    const words = result[0];

    console.log('=== レ点パース結果 ===');
    console.log('入力:', input);
    console.log('単語数:', words.length);
    words.forEach((word, i) => {
      console.log(`[${i}]`, {
        type: word.constructor.name,
        kanji: word.kanji,
        furigana: word.furigana,
        okurigana: word.okurigana,
        kunten: word.kunten?.toString(),
      });
    });

    // 期待: 2つの文字
    expect(words.length).toBe(2);
    expect(words[0].kanji).toBe('愛');
    expect(words[0].okurigana).toBe('ス');
    expect(words[1].kanji).toBe('人');
    expect(words[1].kunten).toBe(Kunten.RE);
    expect(words[1].okurigana).toBe('ヲ');
  });

  test('DEBUG: 助字 ~不(ず)[レ] のパース', () => {
    const input = '~不(ず)[レ]';
    const result = parser.parse(input);
    const words = result[0];

    console.log('=== 助字パース結果 ===');
    console.log('入力:', input);
    console.log('単語数:', words.length);
    words.forEach((word, i) => {
      if (word instanceof Character) {
        console.log(`[${i}]`, {
          kanji: word.kanji,
          furigana: word.furigana,
          okurigana: word.okurigana,
          kunten: word.kunten?.toString(),
          isJoji: word.isJojiOrJodoushi,
        });
      }
    });

    // 期待: 1つの文字（助字）
    expect(words.length).toBe(1);
    const char = words[0] as Character;
    expect(char.kanji).toBe('不');
    expect(char.furigana).toBe('ず');
    expect(char.kunten).toBe(Kunten.RE);
    expect(char.isJojiOrJodoushi).toBe(true);
  });

  test('DEBUG: 複雑な例のパース', () => {
    const input = "'春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ";
    const result = parser.parse(input);
    const words = result[0];

    console.log('=== 複雑な例のパース結果 ===');
    console.log('入力:', input);
    console.log('単語数:', words.length);
    words.forEach((word, i) => {
      console.log(`[${i}]`, {
        type: word.constructor.name,
        kanji: word.kanji,
        furigana: word.furigana,
        okurigana: word.okurigana,
        kunten: word.kunten?.toString(),
      });
    });
  });
});
