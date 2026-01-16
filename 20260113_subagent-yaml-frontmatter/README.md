# サブエージェント YAML フロントマター デモ

## 概要

このデモでは、カスタムサブエージェントの定義方法を学びます。
`.claude/agents/` にMarkdownファイルを配置することで、自分専用のサブエージェントを作成できます。

## ファイル構成

```
.
├── .claude/
│   └── agents/
│       ├── code-reviewer.md  # コードレビュー専門
│       └── explorer.md       # 調査専門（haiku）
├── src/
│   └── sample.ts             # レビュー対象サンプル
├── CLAUDE.md
└── README.md
```

## YAMLフロントマターのフィールド

| フィールド | 必須 | 説明 |
|------------|------|------|
| name | ✅ | 小文字とハイフンの識別子 |
| description | ✅ | 目的の説明（自動呼び出しの判断に使用） |
| model | - | sonnet / haiku / opus / inherit |
| tools | - | 使用可能なツールを制限 |

## 動作確認

1. このディレクトリで Claude Code を起動
   ```bash
   cd ~/Desktop/udemy-demo/20260113_subagent-yaml-frontmatter
   claude
   ```

2. サブエージェントを確認
   ```
   /agents
   ```

3. レビューを実行
   ```
   src/sample.ts をレビューして
   ```

## description の書き方のコツ

**弱い例**: コードを見るエージェント
**強い例**: PRの差分を読み込み、命名規則違反を指摘

→ 「いつ」「何を」するか具体的に書くと、自動呼び出しの精度が上がります。
