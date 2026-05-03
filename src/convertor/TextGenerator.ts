import { Word } from '../domain/Word.js';
import { Character, CompoundCharacter } from '../domain/Character.js';
import { ReadingUnit, ReadingPhase } from '../domain/types.js';
import { toHiragana } from '../utils/string.js';

/**
 * Pass 2: 文字列生成
 * 読み順インデックスリストから書き下し文を生成
 */
export class TextGenerator {
  generate(words: Word[], readingOrder: ReadingUnit[]): string {
    return readingOrder
      .map((unit) => this.wordToString(words[unit.index], unit.phase))
      .join('');
  }

  private wordToString(word: Word, phase: ReadingPhase): string {
    // 置き字はスキップ
    if (word instanceof Character && word.isOkiji) {
      return '';
    }

    // 再読文字の処理
    if (word instanceof Character && word.isSaidoku) {
      if (phase === ReadingPhase.SAIDOKU_FIRST) {
        // 1回目の読み（否定形など）
        return this.saidokuFirstReading(word);
      } else if (phase === ReadingPhase.SAIDOKU_SECOND) {
        // 2回目の読み（本来の読み）
        return this.saidokuSecondReading(word);
      }
    }

    // 通常の文字列変換
    return this.normalReading(word);
  }

  private normalReading(word: Word): string {
    if (word instanceof CompoundCharacter) {
      return word.kanji + this.convertOkurigana(word.okurigana);
    }

    if (word instanceof Character) {
      // 助字・助動詞は振り仮名で読む
      if (word.isJojiOrJodoushi) {
        const reading = word.furigana ? toHiragana(word.furigana) : word.kanji;
        const okurigana = this.convertOkurigana(word.okurigana);
        return reading + okurigana;
      }

      // 通常の文字
      return word.kanji + this.convertOkurigana(word.okurigana);
    }

    return word.kanji;
  }

  private saidokuFirstReading(word: Character): string {
    // 再読文字の1回目の読み（例：「未」→「ず」）
    if (word.saidokuReading) {
      return toHiragana(word.saidokuReading);
    }

    // saidokuReadingがない場合は振り仮名を使用
    if (word.furigana) {
      return toHiragana(word.furigana) + this.convertOkurigana(word.okurigana);
    }

    return '';
  }

  private saidokuSecondReading(word: Character): string {
    // 再読文字の2回目の読み（例：「未」→「いまだ」、「将」→「将に」）
    // 漢字 + 送り仮名を出力
    return word.kanji + this.convertOkurigana(word.okurigana);
  }

  private convertOkurigana(okurigana?: string): string {
    return okurigana ? toHiragana(okurigana) : '';
  }
}
