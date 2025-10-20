import { describe, test, expect } from "vitest";
import { PhesocaNotationParser } from "../../src/parser/PhesocaNotationParser.js";
import { Character } from "../../src/domain/Character.js";
import { Kunten } from "../../src/domain/Kunten.js";

describe("PhesocaNotationParser", () => {
  const parser = new PhesocaNotationParser();

  test("基本的な漢字のパース", () => {
    const result = parser.parse("山川");
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect(sentence[0]).toBeInstanceOf(Character);
    expect((sentence[0] as Character).kanji).toBe("山");
    expect((sentence[1] as Character).kanji).toBe("川");
  });

  test("送り仮名のパース", () => {
    const result = parser.parse("見ル");
    const sentence = result[0];

    expect(sentence).toHaveLength(1);
    const char = sentence[0] as Character;
    expect(char.kanji).toBe("見");
    expect(char.okurigana).toBe("ル");
  });

  test("訓点のパース", () => {
    const result = parser.parse("不[レ]見");
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kanji).toBe("不");
    expect((sentence[0] as Character).kunten).toBe(Kunten.RE);
    expect((sentence[1] as Character).kanji).toBe("見");
  });

  test("振り仮名のパース", () => {
    const result = parser.parse("春(はる)");
    const sentence = result[0];

    expect(sentence).toHaveLength(1);
    const char = sentence[0] as Character;
    expect(char.kanji).toBe("春");
    expect(char.furigana).toBe("はる");
  });

  test("複合的なパース: 訓点+送り仮名+振り仮名", () => {
    const result = parser.parse("愛(あい)ス[レ]人(ひと)ヲ");
    const sentence = result[0];

    expect(sentence).toHaveLength(2);

    const char1 = sentence[0] as Character;
    expect(char1.kanji).toBe("愛");
    expect(char1.furigana).toBe("あい");
    expect(char1.okurigana).toBe("ス");
    expect(char1.kunten).toBe(Kunten.RE);

    const char2 = sentence[1] as Character;
    expect(char2.kanji).toBe("人");
    expect(char2.furigana).toBe("ひと");
    expect(char2.okurigana).toBe("ヲ");
  });

  test("一二点のパース", () => {
    const result = parser.parse("登ル[二]山ニ[一]");
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kunten).toBe(Kunten.NI);
    expect((sentence[1] as Character).kunten).toBe(Kunten.ICHI);
  });

  test("置き字のパース", () => {
    const result = parser.parse("学_而時");
    const sentence = result[0];

    expect(sentence).toHaveLength(3);
    expect((sentence[0] as Character).kanji).toBe("学");
    expect((sentence[0] as Character).isOkiji).toBe(false);

    expect((sentence[1] as Character).kanji).toBe("而");
    expect((sentence[1] as Character).isOkiji).toBe(true);

    expect((sentence[2] as Character).kanji).toBe("時");
  });

  test("助字のパース", () => {
    const result = parser.parse("~者(は)曰ハク");
    const sentence = result[0];

    expect(sentence).toHaveLength(2);
    expect((sentence[0] as Character).kanji).toBe("者");
    expect((sentence[0] as Character).isJojiOrJodoushi).toBe(true);
    expect((sentence[0] as Character).furigana).toBe("は");
  });
});
