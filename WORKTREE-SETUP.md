# Git Worktree 並行開発環境

このリポジトリは Git Worktree を利用した並行開発環境を整えています。

## 概要

Git Worktree を使用することで、複数のブランチを同時に作業できます。ブランチを切り替える必要がなく、各ブランチが独立したディレクトリで作業できます。

## ディレクトリ構成

```
wenyanwen/
├── typescript-kambun/           # メインリポジトリ (master ブランチ)
│   ├── src/
│   ├── tests/
│   └── scripts/
│       └── worktree-manager.sh  # Worktree 管理スクリプト
└── typescript-kambun-worktrees/ # Worktree 格納ディレクトリ
    ├── feature-saidoku-bracket-notation/  # feature/saidoku-bracket-notation ブランチ
    ├── feature-new-parser/                # その他のフィーチャーブランチ...
    └── ...
```

## 使い方

### 1. Worktree 一覧表示

```bash
# 方法1: スクリプト使用
./scripts/worktree-manager.sh list

# 方法2: Git コマンド直接使用
git worktree list
```

### 2. 既存ブランチの Worktree 追加

```bash
# 方法1: スクリプト使用（推奨）
./scripts/worktree-manager.sh add feature/new-feature

# 方法2: Git コマンド直接使用
git worktree add ../typescript-kambun-worktrees/feature-new-feature feature/new-feature
```

### 3. 新規ブランチと Worktree を同時作成

```bash
# 方法1: スクリプト使用（推奨）
./scripts/worktree-manager.sh create feature/awesome-feature

# 方法2: Git コマンド直接使用
git worktree add -b feature/awesome-feature ../typescript-kambun-worktrees/feature-awesome-feature
```

### 4. Worktree 削除

```bash
# 方法1: スクリプト使用（推奨）
./scripts/worktree-manager.sh remove feature/old-feature

# 方法2: Git コマンド直接使用
git worktree remove ../typescript-kambun-worktrees/feature-old-feature
```

## ワークフロー例

### シナリオ: 2つの機能を並行開発

```bash
# 1. 現在の状況確認
./scripts/worktree-manager.sh list

# 2. 新しいパーサーの開発用 worktree 作成
./scripts/worktree-manager.sh create feature/xml-parser

# 3. 別の機能の開発用 worktree 作成
./scripts/worktree-manager.sh create feature/improve-algorithm

# 4. パーサー開発に移動して作業
cd ../typescript-kambun-worktrees/feature-xml-parser
npm install  # 必要に応じて依存関係をインストール
npm test

# 5. 別のターミナルでアルゴリズム改善作業
cd ../typescript-kambun-worktrees/feature-improve-algorithm
npm install
npm run dev

# 6. master ブランチで緊急修正が必要になった場合
cd ../../typescript-kambun  # メインリポジトリに戻る
# master ブランチで作業可能（他の worktree に影響なし）
```

## 利点

✅ **ブランチ切り替え不要**: 各ブランチが独立したディレクトリで作業できる
✅ **並行開発**: 複数の機能を同時に開発・テスト可能
✅ **ビルド保持**: 各 worktree で独立したビルド成果物を保持
✅ **テスト隔離**: 異なるブランチのテストを同時実行可能

## 注意事項

### 依存関係のインストール

各 worktree は独立しているため、新しい worktree を作成したら依存関係のインストールが必要です:

```bash
cd ../typescript-kambun-worktrees/feature-new-feature
npm install
```

### node_modules と build 成果物

各 worktree に独立した `node_modules/` と `dist/` ディレクトリが作成されます。
`.gitignore` でこれらは無視されます。

### ディスク容量

複数の worktree を持つと、それぞれに `node_modules/` が作成されるため、ディスク容量に注意してください。

### Worktree の削除

作業が完了したら、不要な worktree を削除することを推奨:

```bash
./scripts/worktree-manager.sh remove feature/completed-feature
```

## Git コマンド リファレンス

```bash
# Worktree 一覧
git worktree list

# Worktree 追加（既存ブランチ）
git worktree add <path> <branch>

# Worktree 追加（新規ブランチ）
git worktree add -b <new-branch> <path>

# Worktree 削除
git worktree remove <path>

# Worktree 情報削除（ディレクトリが既に削除されている場合）
git worktree prune
```

## トラブルシューティング

### エラー: "fatal: '<branch>' is already checked out at '<path>'"

同じブランチを複数の worktree でチェックアウトすることはできません。
別のブランチ名を使用するか、既存の worktree を削除してください。

### Worktree が残っている状態でディレクトリを削除してしまった

```bash
# Git の worktree リストをクリーンアップ
git worktree prune
```

### IDE で複数の worktree を開く

VS Code や IntelliJ IDEA などの IDE は、各 worktree を独立したプロジェクトとして開くことができます。
