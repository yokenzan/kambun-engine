import { Word } from "./src/domain/Word.js";
import { Character } from "./src/domain/Character.js";
import { Kunten, CombinedKunten, KuntenInterface } from "./src/domain/Kunten.js";
import { JumpStrategy } from "./src/domain/types.js";

// ReadingOrderResolverの依存グラフ構築ロジックを抽出
class DependencyGraphDebugger {
  buildDependencies(words: Word[]): Set<number>[] {
    const n = words.length;
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());

    for (let i = 0; i < n; i++) {
      const word = words[i];
      const kunten = word.kunten;

      console.log(`\n[${i}] ${word.kanji}${kunten ? `[${this.kuntenToString(kunten)}]` : ""}`);

      if (!kunten) {
        console.log("  → 訓点なし、スキップ");
        continue;
      }

      // レ点
      if (kunten instanceof Kunten && kunten === Kunten.RE) {
        console.log("  → レ点処理");
        if (i + 1 < n) {
          adj[i + 1].add(i);
          console.log(`  → adj[${i + 1}].add(${i}): ${i + 1}を読んだ後に${i}を読む`);
        }
        continue;
      }

      // 複合訓点
      if (kunten instanceof CombinedKunten) {
        console.log(`  → 複合訓点: ${this.kuntenToString(kunten.primaryKunten)} + ${this.kuntenToString(kunten.secondaryKunten)}`);
        this.addCombinedKuntenDependencies(i, kunten, words, adj);
        continue;
      }

      // 起点
      if (kunten instanceof Kunten && kunten.isStartingPoint) {
        console.log(`  → 起点: ${this.kuntenToString(kunten)}`);
        this.addStartingPointDependencies(i, kunten, words, adj);
        continue;
      }
    }

    return adj;
  }

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

    console.log(`    終点を検索: strategy=${startKunten.jumpStrategy}`);
    console.log(`    見つかった終点: [${endPoints.join(", ")}]`);

    if (endPoints.length === 0) {
      console.log("    終点なし、依存関係なし");
      return;
    }

    const lastEndPoint = endPoints[endPoints.length - 1];

    // 起点 -> 最後の終点
    adj[startIndex].add(lastEndPoint);
    console.log(`    adj[${startIndex}].add(${lastEndPoint}): 起点 → 最後の終点`);

    // 複数の終点がある場合、順序を保つ
    for (let i = 0; i < endPoints.length - 1; i++) {
      adj[endPoints[i]].add(endPoints[i + 1]);
      console.log(`    adj[${endPoints[i]}].add(${endPoints[i + 1]}): 終点間の順序`);
    }

    // 起点の次の文字から最初の終点の前まで -> 最初の終点
    if (endPoints.length > 0) {
      for (let j = startIndex + 1; j < endPoints[0]; j++) {
        adj[j].add(endPoints[0]);
        console.log(`    adj[${j}].add(${endPoints[0]}): 間の文字 → 最初の終点`);
      }
    }
  }

  private addCombinedKuntenDependencies(
    currentIndex: number,
    combinedKunten: CombinedKunten,
    words: Word[],
    adj: Set<number>[],
  ): void {
    const hasRe = combinedKunten.secondaryKunten === Kunten.RE;
    const isStartingPoint = combinedKunten.primaryKunten.isStartingPoint;

    console.log(`    hasRe=${hasRe}, isStartingPoint=${isStartingPoint}`);

    if (hasRe && isStartingPoint) {
      if (currentIndex + 1 < words.length) {
        const endPoints = this.findMatchingEndPoints(
          currentIndex,
          words,
          combinedKunten.primaryKunten.jumpStrategy,
        );

        console.log(`    終点を検索: [${endPoints.join(", ")}]`);

        if (endPoints.length > 0) {
          const lastEndPoint = endPoints[endPoints.length - 1];

          // 次の文字 -> 終点
          adj[currentIndex + 1].add(lastEndPoint);
          console.log(`    adj[${currentIndex + 1}].add(${lastEndPoint}): 次の文字 → 終点`);

          // 終点 -> 起点
          adj[lastEndPoint].add(currentIndex);
          console.log(`    adj[${lastEndPoint}].add(${currentIndex}): 終点 → 起点`);

          // 間の文字 -> 終点
          for (let j = currentIndex + 2; j < lastEndPoint; j++) {
            adj[j].add(lastEndPoint);
            console.log(`    adj[${j}].add(${lastEndPoint}): 間の文字 → 終点`);
          }
        }
      }
    }
  }

  private findMatchingEndPoints(
    startIndex: number,
    words: Word[],
    targetStrategy: JumpStrategy,
  ): number[] {
    const endPoints: number[] = [];

    // 起点より前を探す
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

    endPoints.reverse();
    return endPoints;
  }

  private kuntenToString(kunten: KuntenInterface): string {
    if (kunten instanceof Kunten) {
      return kunten.value;
    } else if (kunten instanceof CombinedKunten) {
      return `${kunten.primaryKunten.value}${kunten.secondaryKunten.value}`;
    }
    return "?";
  }
}

const analyzer = new DependencyGraphDebugger();

console.log("====================================");
console.log("テスト2: 一二点 (登ル山[二]ニ水[一]ヲ)");
console.log("====================================");
const test2 = [
  new Character("登", undefined, "ル"),
  new Character("山", Kunten.NI, "ニ"),
  new Character("水", Kunten.ICHI, "ヲ"),
];
const adj2 = analyzer.buildDependencies(test2);
console.log("\n依存グラフ:");
adj2.forEach((deps, i) => {
  console.log(`  adj[${i}] = {${Array.from(deps).join(", ")}}`);
});

console.log("\n\n====================================");
console.log("テスト3: 一レ点 (不[一レ]可勝[一]ゲテ)");
console.log("====================================");
const test3 = [
  new Character("不", CombinedKunten.ICHI_RE),
  new Character("可"),
  new Character("勝", Kunten.ICHI, "ゲテ"),
];
const adj3 = analyzer.buildDependencies(test3);
console.log("\n依存グラフ:");
adj3.forEach((deps, i) => {
  console.log(`  adj[${i}] = {${Array.from(deps).join(", ")}}`);
});
