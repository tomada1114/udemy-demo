#!/usr/bin/env python3
"""
ドキュメント品質チェックスクリプト

AIが文書を作成した後、このスクリプトで機械的なチェックを行います。
- 用語の統一（表記揺れ検出）
- 必須セクションの確認
"""
import sys
from pathlib import Path


def check_document(file_path: str) -> int:
    """ドキュメントをチェックし、問題があれば報告する"""

    try:
        content = Path(file_path).read_text(encoding='utf-8')
    except FileNotFoundError:
        print(f"エラー: ファイルが見つかりません: {file_path}")
        return 1

    issues = []

    # ========================================
    # 1. 用語の統一チェック（表記揺れ検出）
    # ========================================
    replacements = {
        "Javascript": "JavaScript",
        "Github": "GitHub",
        "Typescript": "TypeScript",
        "Nodejs": "Node.js",
        "VScode": "VS Code",
    }

    for wrong, correct in replacements.items():
        if wrong in content:
            issues.append(f"表記揺れ: '{wrong}' → '{correct}' に統一してください")

    # ========================================
    # 2. 必須セクションチェック
    # ========================================
    required_sections = ["## 概要", "## 使い方", "## 注意事項"]
    missing = [section for section in required_sections if section not in content]

    if missing:
        issues.append(f"不足セクション: {', '.join(missing)}")

    # ========================================
    # 結果出力
    # ========================================
    print(f"\n📄 チェック対象: {file_path}")
    print("-" * 40)

    if issues:
        print("❌ 問題が見つかりました:\n")
        for issue in issues:
            print(f"  • {issue}")
        print()
        return 1
    else:
        print("✅ すべてのチェックをパスしました\n")
        return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python doc_check.py <file_path>")
        print("Example: python doc_check.py README.md")
        sys.exit(1)

    sys.exit(check_document(sys.argv[1]))
