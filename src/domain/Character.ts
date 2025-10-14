import { Word } from './Word.js';
import { KuntenInterface } from './Kunten.js';

/**
 * 単一の文字
 */
export class Character implements Word {
  readonly length: number;

  constructor(
    public readonly kanji: string,
    public readonly kunten?: KuntenInterface,
    public readonly okurigana?: string,
    public readonly furigana?: string,
    /** 助字または助動詞であるか */
    public readonly isJojiOrJodoushi: boolean = false,
    /** 置き字であるか（読まない） */
    public readonly isOkiji: boolean = false,
    /** 再読文字であるか */
    public readonly isSaidoku: boolean = false,
    /** 再読文字の1回目の読み（否定形など） */
    public readonly saidokuReading?: string
  ) {
    this.length = kanji === "\n" ? 0 : kanji.length;
  }

  /** 句点『。』 */
  static readonly KUTEN = new Character("。");
  /** 読点『、』 */
  static readonly TOUTEN = new Character("、");
  /** 改行 */
  static readonly LINE_BREAK = new Character("\n");
}

/**
 * 複合文字（熟語や人名など）
 */
export class CompoundCharacter implements Word {
  readonly length: number;
  readonly kanji: string;

  constructor(
    public readonly characters: Word[],
    public readonly kunten?: KuntenInterface,
    public readonly okurigana?: string,
    public readonly furigana?: string
  ) {
    this.length = characters.reduce((sum, c) => sum + c.length, 0);
    this.kanji = characters.map(c => c.kanji).join("");
  }
}
