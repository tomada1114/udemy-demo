#!/bin/bash
# Stop: タスク完了時に発火
# マッチャーなし（応答完了のたびに発火）

# ログファイルのパス
log_file="$CLAUDE_PROJECT_DIR/hooks.log"

# ログに記録
{
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🏁 Stop フックが発火しました！"
  echo "   タスク完了時刻: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
} >> "$log_file"

exit 0
