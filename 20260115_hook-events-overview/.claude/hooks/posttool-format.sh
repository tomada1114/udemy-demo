#!/bin/bash
# 要jq: brew install jq (mac) / choco install jq (win)
# PostToolUse: ツール実行後に発火
# マッチャー: "Write|Edit" - ファイル作成/編集後に発火
# Prettierで自動フォーマットを実行

# stdinからJSONを読み取り、ファイルパスを抽出
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# ログファイルのパス
log_file="$CLAUDE_PROJECT_DIR/hooks.log"

# ファイルパスが空の場合は終了
if [ -z "$file_path" ]; then
  exit 0
fi

# Prettierがサポートする拡張子かチェック
supported_extensions="js|ts|jsx|tsx|json|css|scss|md|yaml|yml|html"
if ! echo "$file_path" | grep -qE "\.($supported_extensions)$"; then
  {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏭️  Prettier スキップ（非対象ファイル）"
    echo "   ファイル: $file_path"
    echo "   時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
  } >> "$log_file"
  exit 0
fi

# 除外パターンのチェック
if echo "$file_path" | grep -qE "(node_modules/|\.min\.(js|css)$)"; then
  {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏭️  Prettier スキップ（除外パターン）"
    echo "   ファイル: $file_path"
    echo "   時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
  } >> "$log_file"
  exit 0
fi

# Prettierでフォーマット実行
format_output=$(npx prettier --write "$file_path" 2>&1)
format_exit_code=$?

# ログに記録
{
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ $format_exit_code -eq 0 ]; then
    echo "✅ Prettier フォーマット完了"
  else
    echo "⚠️  Prettier フォーマット失敗（コード: $format_exit_code）"
  fi
  echo "   ファイル: $file_path"
  echo "   時刻: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
} >> "$log_file"

exit 0
