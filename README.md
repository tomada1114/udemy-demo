# Udemy講座デモ用リポジトリ

Udemy講座「**Claude Code カスタマイズ完全ガイド**」で使用するデモ用ソースコードです。

## 対応講座

- **講座名**: 【Claude Code カスタマイズ完全ガイド】6つの拡張機能で専用AIを構築
- **プラットフォーム**: Udemy

## ディレクトリ構成

各ディレクトリは講座内のレクチャーに対応しています。

| ディレクトリ | 対応レクチャー | 内容 |
|-------------|---------------|------|
| `20260105_claude_md_example_tips` | セクション3-4 | /initコマンドでCLAUDE.md作成（React+Vite+TSプロジェクト） |
| `20260106_claude_dynamic_rules_demo` | セクション4-3 | .claude/rules/の動的読み込み（paths指定による条件付きルール適用） |
| `20260111_custom-command-basics` | セクション5-1 | カスタムコマンド基礎（/create-testでテスト自動生成） |
| `20260112_yaml-frontmatter-demo` | セクション5-2 | YAMLフロントマター（description, allowed-tools, model） |
| `20260112_command-argument-patterns` | セクション5-3 | 引数パターン（$ARGUMENTS vs $1/$2/$3） |
| `20260112_prefix-patterns-demo` | セクション5-4 | @プレフィックス（ファイル参照）と!プレフィックス（Bash実行） |
| `20260113_subagent-yaml-frontmatter` | セクション6-2 | サブエージェントのYAMLフロントマター |
| `20260113_command-subagent-integration` | セクション6-4 | カスタムコマンドから複数サブエージェントを並列呼び出し |
| `20260114_skill_creator_demo` | セクション7-3 | Skill Creatorでマテリアルデザインスキル作成 |
| `20260115_skill-with-scripts` | セクション7-5 | scripts/ディレクトリ活用（AIとスクリプトの協調） |
| `20260115_hook-events-overview` | セクション8-2〜8-6 | 主要4種類のフックイベント |

## 使い方

1. 試したいデモのディレクトリに移動
2. 各ディレクトリ内のREADME.mdで詳細な手順を確認
3. Claude Codeを起動して動作確認

```bash
# 例: カスタムコマンド基礎デモ
cd 20260111_custom-command-basics
npm install  # 依存関係がある場合
claude       # Claude Codeを起動
```

## 前提条件

- Claude Code がインストールされていること
- Claude サブスクリプション（Pro または Max）
- Node.js（一部のデモで必要）

## ライセンス

本リポジトリのソースコードは学習目的で自由にご利用いただけます。
