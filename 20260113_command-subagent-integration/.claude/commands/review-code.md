---
description: コードを複数の観点からレビューする
allowed-tools:
  - Task
  - Read
  - Glob
  - Grep
argument-hints: <file_path>
---

# コードレビュー

指定されたファイルを3つの観点からレビューしてください。

## 対象ファイル
$ARGUMENTS

## レビュー手順

以下の3つの専門サブエージェントを **並列で** 起動し、それぞれの観点からレビューを実行してください：

1. **security-reviewer** - セキュリティの観点からレビュー
2. **readability-reviewer** - 可読性の観点からレビュー
3. **performance-reviewer** - パフォーマンスの観点からレビュー

## 出力形式

各サブエージェントの結果を統合し、以下の形式で報告してください：

### セキュリティ
（security-reviewerの結果）

### 可読性
（readability-reviewerの結果）

### パフォーマンス
（performance-reviewerの結果）

### 総合評価
（3つの観点を踏まえた総合的なコメント）
