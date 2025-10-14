import { KuntenInterface } from './Kunten.js';

/**
 * 単語のインターフェース
 * ひとまとまりとして扱いたい文字、単語、句読点など
 */
export interface Word {
  /** 長さ */
  readonly length: number;
  /** 漢字 */
  readonly kanji: string;
  /** 訓点 */
  readonly kunten?: KuntenInterface;
  /** 振り仮名 */
  readonly furigana?: string;
  /** 送り仮名 */
  readonly okurigana?: string;
}
