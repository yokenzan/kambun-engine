import { PhesocaNotationParser } from '../../src/parser/PhesocaNotationParser.js';
import { Character, CompoundCharacter } from '../../src/domain/Character.js';

describe('PhesocaNotationParser - 割注 (Warichu)', () => {
  const parser = new PhesocaNotationParser();

  test('基本的な割注のパース', () => {
    const input = '山{高い山}川';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect(sentence[0]).toBeInstanceOf(Character);
    expect((sentence[0] as Character).kanji).toBe('山');
    expect((sentence[0] as Character).warichu).toBe('高い山');
    expect((sentence[1] as Character).kanji).toBe('川');
    expect((sentence[1] as Character).warichu).toBeUndefined();
  });

  test('複合文字と割注の組み合わせ', () => {
    const input = "'春眠'{春の眠り}(しゅんみん)";
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(1);
    expect(sentence[0]).toBeInstanceOf(CompoundCharacter);
    const compound = sentence[0] as CompoundCharacter;
    expect(compound.kanji).toBe('春眠');
    expect(compound.furigana).toBe('しゅんみん');
    expect(compound.warichu).toBe('春の眠り');
  });

  test('送り仮名と割注の組み合わせ', () => {
    const input = '見ル{見ること}';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(1);
    const char = sentence[0] as Character;
    expect(char.kanji).toBe('見');
    expect(char.okurigana).toBe('ル');
    expect(char.warichu).toBe('見ること');
  });

  test('振り仮名と割注の組み合わせ', () => {
    const input = '春(はる){春の季節}';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(1);
    const char = sentence[0] as Character;
    expect(char.kanji).toBe('春');
    expect(char.furigana).toBe('はる');
    expect(char.warichu).toBe('春の季節');
  });

  test('訓点と割注の組み合わせ', () => {
    const input = '愛ス[レ]人ヲ{人を愛すること}';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kanji).toBe('愛');
    expect((sentence[0] as Character).okurigana).toBe('ス');
    expect((sentence[0] as Character).kunten).toBeDefined();
    expect((sentence[0] as Character).warichu).toBeUndefined();
    expect((sentence[1] as Character).kanji).toBe('人');
    expect((sentence[1] as Character).okurigana).toBe('ヲ');
    expect((sentence[1] as Character).warichu).toBe('人を愛すること');
  });

  test('複数の割注', () => {
    const input = '山{高い山}川{流れる水}';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kanji).toBe('山');
    expect((sentence[0] as Character).warichu).toBe('高い山');
    expect((sentence[1] as Character).kanji).toBe('川');
    expect((sentence[1] as Character).warichu).toBe('流れる水');
  });

  test('空の割注', () => {
    const input = '山{}川';
    const result = parser.parse(input);
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kanji).toBe('山');
    expect((sentence[0] as Character).warichu).toBe('');
    expect((sentence[1] as Character).kanji).toBe('川');
    expect((sentence[1] as Character).warichu).toBeUndefined();
  });
});
