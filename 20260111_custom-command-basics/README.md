# カスタムコマンド基本デモ

## このデモで学ぶこと

- カスタムコマンドとは何か
- `.claude/commands/` フォルダの構造
- コマンドの作り方と使い方

## ファイル構成

```
.
├── .claude/
│   └── commands/
│       └── create-test.md    # /create-test で呼び出し
├── CLAUDE.md
├── README.md
├── package.json              # Jest（テストランナー）
└── src/
    └── example.js            # テスト対象のサンプル
```

## セットアップ

```bash
cd ~/Desktop/udemy-demo/20260111_custom-command-basics
npm install
```

## 動作確認手順

1. このフォルダで Claude Code を起動

```bash
claude
```

2. `/create-test` コマンドを実行

```bash
/create-test src/example.js
```

3. `__tests__/example.test.js` が生成されることを確認

4. テストを実行して動作確認

```bash
npm test
```

## ポイント

- **ファイル名 = コマンド名**: `create-test.md` → `/create-test`
- **Markdownで記述**: プロンプトをそのまま書くだけ
- **引数を渡せる**: `$ARGUMENTS` で受け取り
