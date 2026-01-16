# フックイベント概要デモ

このデモ環境では、Claude Code の**主要4種類のフックイベント**を体験できます。

## 10種類のフックイベント

| イベント | タイミング | マッチャー | 用途 |
|---------|-----------|:---------:|------|
| **SessionStart** | 起動時 | × | 環境の初期化 |
| **PreToolUse** | ツール実行前 | ○ | 危険操作をブロック |
| **PostToolUse** | ツール実行後 | ○ | 自動フォーマット |
| **Stop** | タスク完了時 | × | 完了通知 |
| PermissionRequest | 権限確認時 | ○ | カスタム権限 |
| Notification | 通知送信時 | ○ | 通知の加工 |
| UserPromptSubmit | プロンプト送信時 | × | 入力の加工 |
| SubagentStop | サブエージェント完了時 | × | 後処理 |
| PreCompact | コンパクト前 | × | コンテキスト保存 |
| SessionEnd | セッション終了時 | × | クリーンアップ |

## このデモで体験できる4つのフック

### 1. SessionStart - 環境初期化
Claude Code を起動すると発火します。

### 2. PreToolUse - ツール実行前チェック
Bash コマンドを実行しようとすると発火します。
終了コード2を返すと実行をブロックできます。

### 3. PostToolUse - 自動処理
ファイルを作成/編集すると発火します。
Prettier などの自動フォーマットに使えます。

### 4. Stop - 完了記録
タスク完了時に `hooks.log` に記録します。

## 動作確認手順

```bash
# 1. このフォルダで Claude Code を起動
cd ~/Desktop/udemy-demo/20260115_hook-events-overview
claude

# → SessionStart フックが発火！
```

```
# 2. Claude に指示してファイルを編集
「src/sample.js に関数を追加して」

# → PostToolUse フックが発火！
```

```
# 3. Bash コマンドを実行
「ls コマンドを実行して」

# → PreToolUse フックが発火！
```

```
# 4. タスクが完了すると
# → Stop フックが発火！

# 5. ログを確認
cat hooks.log
```

## ファイル構成

```
.claude/
├── settings.json      # フック設定
└── hooks/
    ├── session-init.sh    # SessionStart 用
    ├── pretool-log.sh     # PreToolUse 用
    ├── posttool-format.sh # PostToolUse 用
    └── stop-log.sh        # Stop 用
src/
└── sample.js          # 編集対象サンプル
hooks.log              # ← フック実行ログ（自動生成）
```

## マッチャーのポイント

```json
{
  "matcher": "Bash"       // Bash ツールのみ
  "matcher": "Write|Edit" // Write または Edit
  "matcher": ""           // すべてのツール
}
```

- PreToolUse / PostToolUse でのみ使用可能
- Stop / SessionStart ではマッチャーなし

## 注意点

- PreToolUse / PostToolUse は**サブエージェント内では発火しない**
- サブエージェント完了時は SubagentStop を使用
