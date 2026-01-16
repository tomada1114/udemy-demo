# scripts/ディレクトリ活用デモ

Udemy講座「セクション7-4: scripts/ディレクトリの活用」のデモ環境です。

## このデモで学ぶこと

**AI + スクリプトの協調**

| 担当 | 役割 | 理由 |
|------|------|------|
| AI | 文書の本文執筆・修正 | 判断・文章生成が必要 |
| スクリプト | 用語統一・必須項目チェック | 機械的に確定できる |

## 動作確認手順

1. このフォルダで `claude` を起動

```bash
cd ~/Desktop/udemy-demo/20260115_skill-with-scripts
claude
```

2. 以下のように依頼

```
sample-doc.mdをチェックして、問題があれば修正してください
```

3. 期待される動作
   - doc-checker Skill が自動で読み込まれる
   - AI がスクリプトを実行してチェック結果を確認
   - 表記揺れ・不足セクションが検出される
   - AI が問題を修正

## ファイル構成

```
.
├── README.md                              # このファイル
├── sample-doc.md                          # テスト用（意図的に問題含む）
└── .claude/skills/doc-checker/
    ├── SKILL.md                           # スキル定義
    └── scripts/doc_check.py               # チェックスクリプト
```

## sample-doc.md に含まれる問題

### 表記揺れ（5箇所）
- `Javascript` → `JavaScript`
- `Typescript` → `TypeScript`
- `Github` → `GitHub`
- `Nodejs` → `Node.js`
- `VScode` → `VS Code`

### 不足セクション（1箇所）
- `## 注意事項` が不足

## ポイント

1. **Progressive Disclosure**
   - スクリプト自体は最初からAIに読み込まれない
   - SKILL.md が読み込まれた後、必要に応じてスクリプトを実行

2. **決定論的処理**
   - 用語統一・必須項目チェックは毎回同じ結果
   - AIの判断に依存しない確実な検証

3. **トークン節約**
   - 機械的な処理をAIにやらせない
   - スクリプトで効率的に処理

## 手動でスクリプトを実行する場合

```bash
python .claude/skills/doc-checker/scripts/doc_check.py sample-doc.md
```
