import { Word } from '../domain/Word.js';
import { Character } from '../domain/Character.js';
import { Kunten, CombinedKunten, KuntenInterface } from '../domain/Kunten.js';
import { JumpStrategy, ReadingUnit, ReadingPhase } from '../domain/types.js';

/**
 * Pass 1: 読み順解決
 *
 * Geminiのアドバイスに基づいた実装：
 * 依存関係グラフ + トポロジカルソートによる読み順決定
 *
 * アルゴリズム:
 * 1. 各文字の依存関係を構築（「この文字を読むには、どの文字を先に読む必要があるか」）
 * 2. 依存関係のない文字から順に読む（トポロジカルソート）
 */
export class ReadingOrderResolver {
  resolve(words: Word[]): ReadingUnit[] {
    const n = words.length;
    if (n === 0) return [];

    // ステップ1: 依存関係リストの構築
    const dependencies = this.buildDependencies(words);

    // ステップ2: 読み順の解決（トポロジカルソート）
    const readingOrder = this.topologicalSort(words, dependencies);

    // ReadingUnitに変換（再読文字の処理を含む）
    return this.convertToReadingUnits(words, readingOrder);
  }

  /**
   * ステップ1: 隣接リスト（依存関係）を構築
   * adj[i] = { i を読んだ後に読める文字のインデックス集合 }
   * つまり、i -> j という依存関係を表す
   */
  private buildDependencies(words: Word[]): Set<number>[] {
    const n = words.length;
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());

    for (let i = 0; i < n; i++) {
      const word = words[i];
      const kunten = word.kunten;

      // 訓点なしまたは句読点・改行 → 依存関係なし
      if (this.shouldReadAsIs(word, kunten)) {
        continue;
      }

      // レ点: i番目にレ点がある場合の処理
      // レ点が連続する場合は、一番下まで行ってから順に上に返る
      // 例: 不[レ]覚[レ]暁 → 暁→覚→不 の順で読む
      if (kunten instanceof Kunten && kunten === Kunten.RE) {
        // レ点の基本ルール: 次の文字を先に読む
        // 次の文字 (i+1) が存在する場合、i+1 -> i の依存関係を作成
        if (i + 1 < n) {
          adj[i + 1].add(i);
        } else if (i > 0) {
          // 最後の文字がレ点の場合のみ、前の文字への依存を作成
          const prevWord = words[i - 1];
          if (!this.isPunctuation(prevWord)) {
            adj[i].add(i - 1);
          }
        }
        continue;
      }

      // 複合訓点（一レ点、上レ点など）
      if (kunten instanceof CombinedKunten) {
        this.addCombinedKuntenDependencies(i, kunten, words, adj);
        continue;
      }

      // 起点（一、上、甲など）
      if (kunten instanceof Kunten && kunten.isStartingPoint) {
        this.addStartingPointDependencies(i, kunten, words, adj);
        continue;
      }
    }

    return adj;
  }

  /**
   * 起点（一、上、甲など）の依存関係を追加
   *
   * ルール: 起点を先に読み、終点を後に読む
   * 例: 施[二]人[一] → 人（起点）を先に読み、施（終点）を後に読む
   * つまり、起点 -> 終点 の依存関係（Geminiのアドバイスによる修正）
   */
  private addStartingPointDependencies(
    startIndex: number,
    startKunten: Kunten,
    words: Word[],
    adj: Set<number>[]
  ): void {
    const endPoints = this.findMatchingEndPoints(
      startIndex,
      words,
      startKunten.jumpStrategy
    );

    if (endPoints.length === 0) return;

    const lastEndPoint = endPoints[endPoints.length - 1];

    // 起点 -> 最後の終点（正しい依存方向）
    adj[startIndex].add(lastEndPoint);

    // 複数の終点がある場合、順序を保つ
    // [一] -> [二] -> [三] の順
    for (let i = 0; i < endPoints.length - 1; i++) {
      adj[endPoints[i]].add(endPoints[i + 1]);
    }

    // 起点の次の文字から最初の終点の前まで -> 最初の終点
    if (endPoints.length > 0) {
      for (let j = startIndex + 1; j < endPoints[0]; j++) {
        adj[j].add(endPoints[0]);
      }
    }
  }

  /**
   * 複合訓点（一レ点など）の依存関係を追加
   *
   * 一レ点の場合:
   * - 次の文字を読む（レ点の効果）
   * - 終点を読む（一点の効果）
   * - その後、起点を読む
   */
  private addCombinedKuntenDependencies(
    currentIndex: number,
    combinedKunten: CombinedKunten,
    words: Word[],
    adj: Set<number>[]
  ): void {
    const hasRe = combinedKunten.secondaryKunten === Kunten.RE;
    const isStartingPoint = combinedKunten.primaryKunten.isStartingPoint;

    if (hasRe && isStartingPoint) {
      // 一レ点の場合: 次の文字 -> 終点 -> 間の文字 -> 起点
      if (currentIndex + 1 < words.length) {
        const endPoints = this.findMatchingEndPoints(
          currentIndex,
          words,
          combinedKunten.primaryKunten.jumpStrategy
        );

        if (endPoints.length > 0) {
          const lastEndPoint = endPoints[endPoints.length - 1];

          // 次の文字 -> 終点
          adj[currentIndex + 1].add(lastEndPoint);

          // 終点 -> 起点
          adj[lastEndPoint].add(currentIndex);

          // 間の文字 -> 終点
          for (let j = currentIndex + 2; j < lastEndPoint; j++) {
            adj[j].add(lastEndPoint);
          }
        }
      }
    }
  }

  /**
   * ステップ2: トポロジカルソート
   * Kahn's アルゴリズムによる実装
   */
  private topologicalSort(
    words: Word[],
    adj: Set<number>[]
  ): number[] {
    const n = words.length;

    // 入次数を計算
    const inDegree = Array(n).fill(0);
    for (let u = 0; u < n; u++) {
      for (const v of adj[u]) {
        inDegree[v]++;
      }
    }

    // 入次数が0のノードをキューに追加
    const queue: number[] = [];
    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }
    queue.sort((a, b) => a - b); // 元の順序を保持

    // トポロジカルソート実行
    const result: number[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      result.push(u);

      // u の後続ノードの入次数を減らす
      for (const v of adj[u]) {
        inDegree[v]--;
        if (inDegree[v] === 0) {
          queue.push(v);
          queue.sort((a, b) => a - b);
        }
      }
    }

    // 循環依存のチェック
    if (result.length !== n) {
      console.warn('Cyclic dependency detected or incomplete sort');
      // 処理されていないノードを追加
      for (let i = 0; i < n; i++) {
        if (!result.includes(i)) {
          result.push(i);
        }
      }
    }

    return result;
  }

  /**
   * ReadingUnitに変換（再読文字の処理を含む）
   */
  private convertToReadingUnits(
    words: Word[],
    readingOrder: number[]
  ): ReadingUnit[] {
    const units: ReadingUnit[] = [];

    for (const index of readingOrder) {
      const word = words[index];

      // 再読文字の場合
      if (word instanceof Character && word.isSaidoku) {
        // 1回目の読み
        units.push({
          index,
          phase: ReadingPhase.SAIDOKU_FIRST,
        });
        // 2回目の読み（後で追加される）
        units.push({
          index,
          phase: ReadingPhase.SAIDOKU_SECOND,
        });
      } else {
        // 通常の読み
        units.push({
          index,
          phase: ReadingPhase.NORMAL,
        });
      }
    }

    return units;
  }

  /**
   * 訓点の影響を受けずにそのまま読むべきか判定
   */
  private shouldReadAsIs(word: Word, kunten?: KuntenInterface): boolean {
    if (!kunten) return true;

    // 句読点・改行は訓点の影響を受けない
    if (this.isPunctuation(word)) {
      return true;
    }

    return false;
  }

  /**
   * 句読点かどうかを判定
   */
  private isPunctuation(word: Word): boolean {
    if (!(word instanceof Character)) return false;

    // 句読点文字（、。）やその他の区切り文字
    const punctuationMarks = ['、', '。', '，', '．', '；', '：'];
    return punctuationMarks.includes(word.kanji);
  }

  /**
   * 指定したjumpStrategyに一致する終点のインデックスを探す
   *
   * 漢文では終点（二、三など）は起点（一）より**前**に出現する
   * 例: 施[二]人[一] → 施が終点、人が起点
   */
  private findMatchingEndPoints(
    startIndex: number,
    words: Word[],
    targetStrategy: JumpStrategy
  ): number[] {
    const endPoints: number[] = [];

    // 起点より前を探す（漢文の一般的なパターン）
    for (let i = startIndex - 1; i >= 0; i--) {
      const kunten = words[i].kunten;
      if (
        kunten instanceof Kunten &&
        kunten.jumpStrategy === targetStrategy &&
        !kunten.isStartingPoint
      ) {
        endPoints.push(i);
      }
    }

    // 逆順で見つけたので、元の順序（小さいindexが先）に戻す
    endPoints.reverse();

    return endPoints;
  }
}
