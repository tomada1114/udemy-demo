# YAMLフロントマター デモ

カスタムコマンドのYAMLフロントマターを学ぶためのデモ環境です。

## 学習内容

- `description`: サジェストに表示される説明
- `argument-hint`: 引数のヒント表示
- `allowed-tools`: ツール制限（読み取り専用など）

## ファイル構成

```
.
├── .claude/
│   └── commands/
│       ├── check-file.md    # 読み取り専用コマンド
│       ├── review-code.md   # コードレビューコマンド
│       └── simple-task.md   # 最小限のフロントマター
├── src/
│   └── sample.js            # レビュー対象サンプル
├── CLAUDE.md
└── README.md
```

## デモ手順

### 1. description の確認

```bash
/help
```

コマンド一覧に説明（description）が表示されます。

### 2. argument-hint の確認

`/check-file` または `/review-code` を入力すると、
サジェストに引数ヒントが表示されます。

### 3. allowed-tools の確認

```bash
/review-code src/sample.js
```

このコマンドは `Read, Glob, Grep` のみ許可されているため、
ファイルを変更しようとしてもできません。
