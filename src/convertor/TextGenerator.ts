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
    // 置き字はスキップ（ただし割注がある場合は表示）
    if (word instanceof Character && word.isOkiji) {
      return word.warichu !== undefined ? `（${word.warichu}）` : '';
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
    let result = '';
    
    if (word instanceof CompoundCharacter) {
      result = word.kanji + this.convertOkurigana(word.okurigana);
    } else if (word instanceof Character) {
      // 助字・助動詞は振り仮名で読む
      if (word.isJojiOrJodoushi) {
        const reading = word.furigana ? toHiragana(word.furigana) : word.kanji;
        const okurigana = this.convertOkurigana(word.okurigana);
        result = reading + okurigana;
      } else {
        // 通常の文字
        result = word.kanji + this.convertOkurigana(word.okurigana);
      }
    } else {
      result = word.kanji;
    }

    // 割注がある場合は追加（空文字列も含む）
    if (word.warichu !== undefined) {
      result += `（${word.warichu}）`;
    }

    return result;
  }

  private saidokuFirstReading(word: Character): string {
    // 再読文字の1回目の読み（例：「未」→「ず」）
    if (word.saidokuReading) {
      return toHiragana(word.saidokuReading);
    } else if (word.furigana) {
      return toHiragana(word.furigana) + this.convertOkurigana(word.okurigana);
    }

    return '';
  }

  private saidokuSecondReading(word: Character): string {
    // 再読文字の2回目の読み（例：「未」→「いまだ」、「将」→「将に」）
    let result = word.kanji + this.convertOkurigana(word.okurigana);

    if (word.warichu !== undefined) {
      result += `（${word.warichu}）`;
    }

    return result;
  }

  private convertOkurigana(okurigana?: string): string {
    return okurigana ? toHiragana(okurigana) : '';
  }
}
