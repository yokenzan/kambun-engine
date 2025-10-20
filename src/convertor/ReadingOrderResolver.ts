import { Word } from "../domain/Word.js";
import { Character } from "../domain/Character.js";
import { Kunten, CombinedKunten, KuntenInterface } from "../domain/Kunten.js";
import { JumpStrategy, ReadingUnit, ReadingPhase } from "../domain/types.js";

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
   * 例: 登山[二]水[一] → 水[一](起点) → 山[二](終点) → 登(その他)
   *
   * 依存関係:
   * 1. 起点 → 直近の終点（例: 水 → 山）
   * 2. 終点間の順序（例: 山[二] → 川[三]）
   * 3. 最後の終点 → 終点より前の文字（例: 山 → 登）
   */
  private addStartingPointDependencies(
    startIndex: number,
    startKunten: Kunten,
    words: Word[],
    adj: Set<number>[],
  ): void {
    const endPoints = this.findMatchingEndPoints(
      startIndex,
      words,
      startKunten.jumpStrategy,
    );

    if (endPoints.length === 0) return;

    // endPoints は index 昇順（テキストの前方が先）
    // 例: [0, 1] = [山[三], 川[二]]
    // 読み順: 起点[一] → 川[二] → 山[三]

    // 1. 起点 → 直近の終点（index が最大の終点）
    const nearestEndPoint = endPoints[endPoints.length - 1];
    adj[startIndex].add(nearestEndPoint);

    // 2. 終点間の順序を保つ: 後方の終点 → 前方の終点
    // 例: 川[二](index 1) → 山[三](index 0)
    for (let i = 0; i < endPoints.length - 1; i++) {
      adj[endPoints[i + 1]].add(endPoints[i]);
    }

    // 3. 読み順で最後の終点 → 終点より前で句読点に遮断されない文字
    // 例: 登山[二]水[一] → 山[二] → 登（句読点なし、依存あり）
    // 例: 其ノ初メ，...起[二]...中[一] → 起[二]から後方探索、句読点「，」で停止、依存なし
    const lastEndPointInReadingOrder = endPoints[0]; // index が最小 = 読み順で最後

    // 終点から後方（インデックスの小さい方向）に探索し、句読点で停止
    for (let i = lastEndPointInReadingOrder - 1; i >= 0; i--) {
      // 句読点が見つかったら探索を停止（句を越えない）
      const word = words[i];
      if (word instanceof Character && this.isPunctuation(word)) {
        break;
      }

      // 起点より後ろならスキップ（すでに依存関係で処理済み）
      if (i >= startIndex) continue;

      // 終点でない文字を最後の終点の後に読む
      if (!endPoints.includes(i)) {
        adj[lastEndPointInReadingOrder].add(i);
      }
    }
  }

  /**
   * 複合訓点（一レ点など）の依存関係を追加
   *
   * 複合訓点は起点+レ点の組み合わせ（例: 一レ、上レ）
   * 読み順: 次の文字 → 終点（もしあれば） → 起点
   */
  private addCombinedKuntenDependencies(
    currentIndex: number,
    combinedKunten: CombinedKunten,
    words: Word[],
    adj: Set<number>[],
  ): void {
    const hasRe = combinedKunten.secondaryKunten === Kunten.RE;
    const isStartingPoint = combinedKunten.primaryKunten.isStartingPoint;

    if (hasRe && isStartingPoint) {
      if (currentIndex + 1 >= words.length) return;

      // 終点を前後両方から探す（上中下点は後方にある場合がある）
      const endPointsAll = this.findMatchingEndPointsAll(
        currentIndex,
        words,
        combinedKunten.primaryKunten.jumpStrategy,
      );

      if (endPointsAll.length > 0) {
        // 終点がある場合: 次の文字 → 終点 → 起点
        const nearestEndPoint = endPointsAll[endPointsAll.length - 1];

        // 次の文字 → 直近の終点（自己ループを避ける）
        if (currentIndex + 1 !== nearestEndPoint) {
          adj[currentIndex + 1].add(nearestEndPoint);
        }

        // 終点間の順序
        for (let i = 0; i < endPointsAll.length - 1; i++) {
          adj[endPointsAll[i + 1]].add(endPointsAll[i]);
        }

        // 最後の終点 → 起点
        const lastEndPointInReadingOrder = endPointsAll[0];
        adj[lastEndPointInReadingOrder].add(currentIndex);

        // 終点から後方に探索し、句読点で停止
        for (let i = lastEndPointInReadingOrder - 1; i >= 0; i--) {
          // 句読点が見つかったら探索を停止
          const word = words[i];
          if (word instanceof Character && this.isPunctuation(word)) {
            break;
          }

          // 起点より後ろならスキップ
          if (i >= currentIndex) continue;

          if (!endPointsAll.includes(i)) {
            adj[lastEndPointInReadingOrder].add(i);
          }
        }
      } else {
        // 終点がない場合: 次の文字 → 起点より後の全ての文字 → 起点
        // 例: 不[一レ]可勝 → 可 → 勝 → 不

        // 次の文字から起点より後の全ての文字への依存
        for (let i = currentIndex + 2; i < words.length; i++) {
          adj[currentIndex + 1].add(i);
        }

        // 起点より後の最後の文字 → 起点
        if (currentIndex + 1 < words.length) {
          const lastIndex = words.length - 1;
          adj[lastIndex].add(currentIndex);
        }
      }
    }
  }

  /**
   * ステップ2: トポロジカルソート
   * Kahn's アルゴリズムによる実装
   */
  private topologicalSort(words: Word[], adj: Set<number>[]): number[] {
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
      console.warn("Cyclic dependency detected or incomplete sort");
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
    readingOrder: number[],
  ): ReadingUnit[] {
    const units: ReadingUnit[] = [];
    const saidokuFirstReadings: ReadingUnit[] = [];

    for (const index of readingOrder) {
      const word = words[index];

      // 再読文字の場合
      if (word instanceof Character && word.isSaidoku) {
        // 2回目の読みを通常位置に配置
        units.push({
          index,
          phase: ReadingPhase.SAIDOKU_SECOND,
        });
        // 1回目の読みは後で追加するため保持
        saidokuFirstReadings.push({
          index,
          phase: ReadingPhase.SAIDOKU_FIRST,
        });
      } else {
        // 通常の読み
        units.push({
          index,
          phase: ReadingPhase.NORMAL,
        });
      }
    }

    // 再読文字の2回目の読みをスコープの先頭に移動
    // スコープは再読文字から見て「後に回す」依存の対象語群
    if (saidokuFirstReadings.length > 0) {
      this.moveSaidokuSecondToScopeStart(words, units);
    }

    // 句点の前に再読1回目の読みを挿入
    const kutenIndex = units.findIndex((unit) => {
      const word = words[unit.index];
      return word instanceof Character && word.kanji === "。";
    });

    if (kutenIndex !== -1) {
      // 句点の前に挿入
      units.splice(kutenIndex, 0, ...saidokuFirstReadings);
    } else {
      // 句点がない場合は末尾に追加
      units.push(...saidokuFirstReadings);
    }

    return units;
  }

  /**
   * 再読文字の2回目の読みをスコープの先頭に移動
   */
  private moveSaidokuSecondToScopeStart(
    words: Word[],
    units: ReadingUnit[],
  ): void {
    // 再読文字の2回目の読みを特定
    const saidokuSecondUnits = units.filter(
      (unit) => unit.phase === ReadingPhase.SAIDOKU_SECOND,
    );

    for (const saidokuUnit of saidokuSecondUnits) {
      const saidokuWord = words[saidokuUnit.index];
      if (!(saidokuWord instanceof Character) || !saidokuWord.isSaidoku)
        continue;

      // スコープの開始位置を特定
      // 簡便化のため、トポロジカル順でsaidokuUnitより前に読まれる連続区間の先頭とする
      const saidokuIndex = units.indexOf(saidokuUnit);
      let scopeStart = 0;

      // 句読点で区切られた連続区間の先頭を探す
      for (let i = saidokuIndex - 1; i >= 0; i--) {
        const word = words[units[i].index];
        if (word instanceof Character && this.isPunctuation(word)) {
          scopeStart = i + 1;
          break;
        }
      }

      // 再読文字の2回目の読みをスコープの先頭に移動
      units.splice(saidokuIndex, 1);
      units.splice(scopeStart, 0, saidokuUnit);
    }
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
    const punctuationMarks = ["、", "。", "，", "．", "；", "："];
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
    targetStrategy: JumpStrategy,
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

  /**
   * 指定したjumpStrategyに一致する終点を前後両方から探す
   *
   * 上中下点などは終点が起点より後に来ることがある
   * 例: 有[上レ]リ客[下] → 客が終点、有が起点
   */
  private findMatchingEndPointsAll(
    startIndex: number,
    words: Word[],
    targetStrategy: JumpStrategy,
  ): number[] {
    const endPoints: number[] = [];

    // 前後両方を探す
    for (let i = 0; i < words.length; i++) {
      if (i === startIndex) continue; // 起点自身は除外

      const kunten = words[i].kunten;
      if (
        kunten instanceof Kunten &&
        kunten.jumpStrategy === targetStrategy &&
        !kunten.isStartingPoint
      ) {
        endPoints.push(i);
      }
    }

    // index 昇順にソート（前方が先）
    endPoints.sort((a, b) => a - b);

    return endPoints;
  }
}
