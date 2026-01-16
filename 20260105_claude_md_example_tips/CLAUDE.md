# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 型チェック + ビルド
npm run lint     # ESLint実行
```

## 技術スタック

React 19 + TypeScript + Vite 7

## コーディング規約

### TypeScript
- `any`禁止 → `unknown` + 型ガード
- 型推論が効く箇所は型注釈省略
- オブジェクト型は`interface`優先、Union/交差型は`type`

### React
- 関数コンポーネントのみ、named export推奨
- Props型は`ComponentNameProps`形式
- 150行超 → カスタムフック分離検討

### 命名規則
- コンポーネント/型: PascalCase
- フック: `use`プレフィックス
- 定数: UPPER_SNAKE_CASE

### インポート順序
React → 外部ライブラリ → 内部モジュール → 相対パス → CSS

## 開発ワークフロー

### コミット規約
Conventional Commits形式: `type: 説明`
- `feat:` 新機能 / `fix:` バグ修正 / `refactor:` リファクタ / `docs:` ドキュメント / `test:` テスト / `chore:` その他
- 1コミット1変更、コミット前に`npm run lint && npm run build`を実行

### ブランチ運用
- `main`: 本番リリース用、直接コミット禁止
- `feature/xxx`: 機能開発用、mainからチェックアウト

### テスト方針
- ユーティリティ関数: 単体テスト必須
- コンポーネント: ユーザー操作を伴うものはテスト推奨
- カバレッジ: Happy/Sad/Edgeパスを網羅
- テスト追加時: `npm run test -- --watch ファイル名`で確認
