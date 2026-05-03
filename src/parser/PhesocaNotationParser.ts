import { Word } from '../domain/Word.js';
import { Character, CompoundCharacter } from '../domain/Character.js';
import { kuntenFromString } from '../domain/Kunten.js';
import { isKatakana } from '../utils/string.js';

/**
 * Phesoca記法のパーサー
 *
 * 記法:
 * - 漢字: そのまま
 * - 訓点: [レ], [一], [二] など
 * - 振り仮名: (よみ)
 * - 送り仮名: カタカナ
 * - 複合文字: '熟語'(よみ)
 * - 助字: ~文字
 * - 置き字: _文字
 * - 再読文字: *文字
 */
export class PhesocaNotationParser {
  private static readonly KUNTEN_TAG_OPEN = '[';
  private static readonly KUNTEN_TAG_CLOSE = ']';
  private static readonly FURIGANA_TAG_OPEN = '(';
  private static readonly FURIGANA_TAG_CLOSE = ')';
  // 再読1回目の読み（角括弧/ギュメ）
  private static readonly SAIDOKU_READING_OPEN_ANGLE = '<';
  private static readonly SAIDOKU_READING_CLOSE_ANGLE = '>';
  private static readonly SAIDOKU_READING_OPEN_GUILLEMET = '«';
  private static readonly SAIDOKU_READING_CLOSE_GUILLEMET = '»';
  // 複合文字タグ: ASCII apostrophe を使用（状態で開き/閉じを判定）
  private static readonly COMPOUND_CHARACTER_TAG = "'";
  private static readonly JOJI_PREFIX = '~';
  private static readonly OKIJI_PREFIX = '_';
  private static readonly SAIDOKU_PREFIX = '*';

  parse(text: string): Word[][] {
    const context = new ParseContext();
    const parsedWords: WordParameter[] = [];

    for (const char of text) {
      switch (char) {
        case '\n':
        case '\r':
          // 改行は無視
          break;

        case PhesocaNotationParser.COMPOUND_CHARACTER_TAG:
          // 状態に応じて開きまたは閉じとして処理
          if (context.whileCompoundCharacter) {
            // 複合文字の終了
            context.whileCompoundCharacter = false;
          } else {
            // 複合文字の開始
            if (context.currentWord.kanji.length > 0) {
              parsedWords.push(context.currentWord);
            }
            context.currentWord = new WordParameter();
            context.whileCompoundCharacter = true;
          }
          break;

        case PhesocaNotationParser.FURIGANA_TAG_OPEN:
          context.whileFurigana = true;
          break;

        case PhesocaNotationParser.FURIGANA_TAG_CLOSE:
          context.whileFurigana = false;
          break;

        case PhesocaNotationParser.KUNTEN_TAG_OPEN:
          context.whileKunten = true;
          break;

        case PhesocaNotationParser.KUNTEN_TAG_CLOSE:
          context.whileKunten = false;
          break;

        // 再読1回目の読み（<…> / «…»）の開始
        case PhesocaNotationParser.SAIDOKU_READING_OPEN_ANGLE:
        case PhesocaNotationParser.SAIDOKU_READING_OPEN_GUILLEMET:
          context.whileSaidokuReading = true;
          break;

        // 再読1回目の読み（<…> / «…»）の終了
        case PhesocaNotationParser.SAIDOKU_READING_CLOSE_ANGLE:
        case PhesocaNotationParser.SAIDOKU_READING_CLOSE_GUILLEMET:
          context.whileSaidokuReading = false;
          break;

        case PhesocaNotationParser.JOJI_PREFIX:
          context.treatAsJoji = true;
          break;

        case PhesocaNotationParser.OKIJI_PREFIX:
          context.treatAsOkiji = true;
          break;

        case PhesocaNotationParser.SAIDOKU_PREFIX:
          context.treatAsSaidoku = true;
          break;

        default:
          this.handleCharacter(char, context, parsedWords);
      }
    }

    // 最後の文字を追加
    if (context.currentWord !== parsedWords[parsedWords.length - 1]) {
      parsedWords.push(context.currentWord);
    }

    return [this.buildSentence(parsedWords)];
  }

  private handleCharacter(
    char: string,
    context: ParseContext,
    parsedWords: WordParameter[]
  ): void {
    if (context.whileCompoundCharacter) {
      context.currentWord.kanji.push(char);
    } else if (context.whileFurigana) {
      context.currentWord.furigana.push(char);
    } else if (context.whileKunten) {
      context.currentWord.kunten.push(char);
    } else if (context.whileSaidokuReading) {
      // 再読1回目の読みを蓄積
      context.currentWord.saidokuReading = (context.currentWord.saidokuReading ?? '') + char;
    } else if (isKatakana(char)) {
      context.currentWord.okurigana.push(char);
    } else {
      // 新しい文字の開始
      parsedWords.push(context.currentWord);
      context.currentWord = new WordParameter();
      context.currentWord.kanji.push(char);

      // プレフィックスの適用
      if (context.treatAsJoji) {
        context.currentWord.isJoji = true;
        context.treatAsJoji = false;
      }
      if (context.treatAsOkiji) {
        context.currentWord.isOkiji = true;
        context.treatAsOkiji = false;
      }
      if (context.treatAsSaidoku) {
        context.currentWord.isSaidoku = true;
        context.treatAsSaidoku = false;
      }
    }
  }

  private buildSentence(parameters: WordParameter[]): Word[] {
    return parameters
      .filter(param => param.kanji.length > 0)
      .map(param => {
        const kanjiStr = param.kanji.join('');
        const kuntenStr = param.kunten.join('');
        const kunten = kuntenStr ? kuntenFromString(kuntenStr) : undefined;
        const okurigana = param.okurigana.length > 0
          ? param.okurigana.join('')
          : undefined;
        const furigana = param.furigana.length > 0
          ? param.furigana.join('')
          : undefined;

        // 複合文字の場合
        if (param.kanji.length > 1) {
          const characters = param.kanji.map(k => new Character(k));
          return new CompoundCharacter(characters, kunten, okurigana, furigana);
        }

        // 単一文字の場合
        return new Character(
          kanjiStr,
          kunten,
          okurigana,
          furigana,
          param.isJoji,
          param.isOkiji,
          param.isSaidoku,
          param.saidokuReading
        );
      });
  }
}

class ParseContext {
  whileKunten = false;
  whileFurigana = false;
  whileCompoundCharacter = false;
  whileSaidokuReading = false;
  treatAsJoji = false;
  treatAsOkiji = false;
  treatAsSaidoku = false;
  currentWord = new WordParameter();
}

class WordParameter {
  kanji: string[] = [];
  kunten: string[] = [];
  okurigana: string[] = [];
  furigana: string[] = [];
  isJoji = false;
  isOkiji = false;
  isSaidoku = false;
  saidokuReading?: string;
}
