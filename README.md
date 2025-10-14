# TypeScript Kambun Convertor

漢文（Classical Chinese）の書き下し変換ツール（TypeScript実装）

## 特徴

- **2パスアルゴリズム**: 読み順解決と文字列生成を分離した明確な設計
- **複合訓点対応**: 一レ点、上レ点など
- **再読文字対応**: 未、将、宜など
- **TDD実装**: テスト駆動開発によるロバストな実装

## セットアップ

```bash
npm install
```

## テスト実行

```bash
# すべてのテスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ計測
npm run test:coverage
```

## ビルド

```bash
npm run build
```

## アーキテクチャ

### 2パスアルゴリズム

1. **Pass 1: 読み順解決** (`ReadingOrderResolver`)
   - 訓点のルールに基づいて読み順を決定
   - インデックスリストを生成

2. **Pass 2: 文字列生成** (`TextGenerator`)
   - インデックスリストに従って文字列を構築
   - 送り仮名の変換、置き字のスキップなど

### ディレクトリ構造

```
src/
├── domain/          # ドメインモデル
│   ├── types.ts
│   ├── Kunten.ts
│   ├── Word.ts
│   └── Character.ts
├── parser/          # 入力パーサー
│   └── PhesocaNotationParser.ts
└── convertor/       # 変換ロジック
    ├── ReadingOrderResolver.ts
    ├── TextGenerator.ts
    └── KakikudashiConvertor.ts
```

## 実装ステータス

- [x] Phase 0: プロジェクトセットアップ
- [ ] Phase 1: ドメインモデル
- [ ] Phase 2: 基本テストケース
- [ ] Phase 3: パーサー実装
- [ ] Phase 4: Pass 1実装
- [ ] Phase 5: Pass 2実装
- [ ] Phase 6: 統合
- [ ] Phase 7: 複合訓点
- [ ] Phase 8: 再読文字
