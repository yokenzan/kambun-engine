/**
 * 文字列変換ユーティリティ
 */

const DIFF_BETWEEN_HIRAGANA_AND_KATAKANA = 0x60;
const HIRAGANA_CODE_RANGE = { start: 0x3041, end: 0x3093 };
const KATAKANA_CODE_RANGE = { start: 0x30a0, end: 0x30ff };

/**
 * カタカナをひらがなに変換
 */
export function toHiragana(str: string): string {
  return Array.from(str)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (
        code >= KATAKANA_CODE_RANGE.start &&
        code <= KATAKANA_CODE_RANGE.end
      ) {
        return String.fromCharCode(code - DIFF_BETWEEN_HIRAGANA_AND_KATAKANA);
      }
      return char;
    })
    .join("");
}

/**
 * ひらがなをカタカナに変換
 */
export function toKatakana(str: string): string {
  return Array.from(str)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (
        code >= HIRAGANA_CODE_RANGE.start &&
        code <= HIRAGANA_CODE_RANGE.end
      ) {
        return String.fromCharCode(code + DIFF_BETWEEN_HIRAGANA_AND_KATAKANA);
      }
      return char;
    })
    .join("");
}

/**
 * ひらがなかどうか判定
 */
export function isHiragana(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= HIRAGANA_CODE_RANGE.start && code <= HIRAGANA_CODE_RANGE.end;
}

/**
 * カタカナかどうか判定
 */
export function isKatakana(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= KATAKANA_CODE_RANGE.start && code <= KATAKANA_CODE_RANGE.end;
}
