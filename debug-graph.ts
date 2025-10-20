import { Character } from './src/domain/Character.js';
import { Kunten } from './src/domain/Kunten.js';

// ReadingOrderResolverの内部動作を可視化

class DebugResolver {
  private buildDependencies(words: any[]): Set<number>[] {
    const n = words.length;
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());

    console.log('=== 依存関係グラフの構築 ===\n');

    for (let i = 0; i < n; i++) {
      const word = words[i];
      const kunten = word.kunten;

      console.log(`[${i}] ${word.kanji}${kunten ? '[' + kunten.value + ']' : ''}`);

      if (!kunten) {
        console.log(`  → 訓点なし、スキップ\n`);
        continue;
      }

      // 起点（一、上など）
      if (kunten.isStartingPoint) {
        console.log(`  → 起点を検出: ${kunten.value}`);

        const endPoints = this.findMatchingEndPoints(i, words, kunten.jumpStrategy);
        console.log(`  → 終点: [${endPoints.join(', ')}]`);

        if (endPoints.length === 0) {
          console.log(`  → 終点が見つかりません\n`);
          continue;
        }

        const lastEndPoint = endPoints[endPoints.length - 1];

        // 起点 -> 最後の終点
        adj[i].add(lastEndPoint);
        console.log(`  → 依存関係追加: ${i} -> ${lastEndPoint}`);

        // 起点の次の文字から最初の終点の前まで -> 最初の終点
        if (endPoints.length > 0) {
          for (let j = i + 1; j < endPoints[0]; j++) {
            adj[j].add(endPoints[0]);
            console.log(`  → 依存関係追加: ${j} -> ${endPoints[0]} (間の文字)`);
          }
        }

        console.log();
      }
    }

    return adj;
  }

  private findMatchingEndPoints(startIndex: number, words: any[], targetStrategy: string): number[] {
    const endPoints: number[] = [];

    // 起点より前を探す
    for (let i = startIndex - 1; i >= 0; i--) {
      const kunten = words[i].kunten;
      if (kunten && kunten.jumpStrategy === targetStrategy && !kunten.isStartingPoint) {
        endPoints.push(i);
      }
    }

    endPoints.reverse();
    return endPoints;
  }

  private computeInDegree(adj: Set<number>[]): number[] {
    const n = adj.length;
    const inDegree = Array(n).fill(0);

    console.log('=== 入次数の計算 ===\n');

    for (let u = 0; u < n; u++) {
      for (const v of adj[u]) {
        inDegree[v]++;
        console.log(`${u} -> ${v} により inDegree[${v}]++`);
      }
    }

    console.log('\n入次数:', inDegree);
    console.log();

    return inDegree;
  }

  debug(words: any[]) {
    const adj = this.buildDependencies(words);

    console.log('=== 最終的な隣接リスト ===\n');
    for (let i = 0; i < adj.length; i++) {
      if (adj[i].size > 0) {
        console.log(`adj[${i}] = {${Array.from(adj[i]).join(', ')}}`);
      } else {
        console.log(`adj[${i}] = {}`);
      }
    }
    console.log();

    const inDegree = this.computeInDegree(adj);

    console.log('=== トポロジカルソート ===\n');
    const queue: number[] = [];
    for (let i = 0; i < inDegree.length; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }

    console.log('初期キュー（入次数0）:', queue);

    const result: number[] = [];
    let step = 1;

    while (queue.length > 0) {
      queue.sort((a, b) => a - b);
      const u = queue.shift()!;
      result.push(u);

      console.log(`\nステップ${step}: ${u}を取り出す`);
      console.log(`  現在の結果: [${result.join(', ')}]`);

      for (const v of adj[u]) {
        inDegree[v]--;
        console.log(`  ${u} -> ${v} を処理: inDegree[${v}] = ${inDegree[v]}`);

        if (inDegree[v] === 0) {
          queue.push(v);
          console.log(`  → ${v}をキューに追加`);
        }
      }

      step++;
    }

    console.log('\n最終結果:', result);
  }
}

// テストケース3を詳細にデバッグ
console.log('【一二点のデバッグ】登ル山[二]ニ水[一]ヲ\n');
const case3 = [
  new Character('登', undefined, 'ル'),
  new Character('山', Kunten.NI, 'ニ'),
  new Character('水', Kunten.ICHI, 'ヲ'),
];

const debugResolver = new DebugResolver();
debugResolver.debug(case3);
