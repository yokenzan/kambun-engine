import { Word } from '../domain/Word.js';
import { ReadingOrderResolver } from './ReadingOrderResolver.js';
import { TextGenerator } from './TextGenerator.js';

/**
 * 漢文を書き下し文に変換
 * 2パスアルゴリズム:
 * - Pass 1: 読み順解決 (ReadingOrderResolver)
 * - Pass 2: 文字列生成 (TextGenerator)
 */
export class KakikudashiConvertor {
  private resolver: ReadingOrderResolver;
  private generator: TextGenerator;

  constructor() {
    this.resolver = new ReadingOrderResolver();
    this.generator = new TextGenerator();
  }

  convert(words: Word[]): string {
    // Pass 1: 読み順を解決
    const readingOrder = this.resolver.resolve(words);

    // Pass 2: 文字列を生成
    return this.generator.generate(words, readingOrder);
  }
}
