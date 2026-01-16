#!/bin/bash
# 要jq: brew install jq (mac) / choco install jq (win)
# PreToolUse: ツール実行前に発火
# マッチャー: "Bash" - Bashコマンド実行前に発火

# stdinからJSONを読み取り、コマンドを抽出
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // empty')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ PreToolUse フックが発火しました！"
echo "   ツール: Bash"
echo "   コマンド: $command"
echo "   時刻: $(date '+%H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# .claudeディレクトリ内のファイル削除をブロック
if echo "$command" | grep -qE '\brm\b' && echo "$command" | grep -q '\.claude'; then
  echo "🚫 ブロック: .claudeディレクトリ内のファイル削除は禁止されています"
  echo "   コマンド: $command"
  exit 2
fi

# 終了コード0: 実行を許可
# 終了コード2: 実行をブロック
exit 0
