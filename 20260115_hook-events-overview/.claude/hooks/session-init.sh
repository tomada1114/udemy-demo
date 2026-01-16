#!/bin/bash
# SessionStart: セッション開始/再開時に発火
# マッチャーなし（すべてのセッション開始で発火）

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 SessionStart フックが発火しました！"
echo "   セッション開始時刻: $(date '+%Y-%m-%d %H:%M:%S')"
echo "   プロジェクト: $CLAUDE_PROJECT_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# package.jsonが存在し、node_modulesがない場合はnpm installを実行
if [ -f "$CLAUDE_PROJECT_DIR/package.json" ] && [ ! -d "$CLAUDE_PROJECT_DIR/node_modules" ]; then
    echo ""
    echo "📦 package.json を検出しました（node_modules なし）"
    echo "   npm install を実行します..."
    echo ""
    cd "$CLAUDE_PROJECT_DIR" && npm install
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ npm install が完了しました"
    else
        echo ""
        echo "❌ npm install に失敗しました"
    fi
fi

exit 0
