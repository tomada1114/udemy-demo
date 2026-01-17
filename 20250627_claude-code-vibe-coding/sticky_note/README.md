# 付箋メモアプリ

インタラクティブな付箋メモアプリケーションです。ドラッグ＆ドロップ、カラー変更、自動保存機能を備えています。

![付箋メモアプリ](./docs/screenshot.png)

## 機能

### ✨ 主要機能
- 📝 **付箋の追加・編集・削除** - ワンクリックで付箋を追加、リアルタイム編集
- 📌 **重要メモ固定機能** - 最大3個のメモを上部に固定表示（モバイル対応）
- 🎨 **8色のグラデーションパレット** - Apple風の美しいカラーテーマ
- 🖱️ **精密ドラッグ＆ドロップ** - カスタム実装による正確な位置制御
- 💾 **自動保存機能** - localStorageによる永続化
- 📱 **レスポンシブデザイン** - PC・タブレット・スマートフォン対応
- 🍎 **Apple風デザイン** - glassmorphismとマイクロインタラクション

### 🔧 技術機能
- ⚡ **高速レンダリング** - React 19とViteによる最適化
- 🎯 **TypeScript対応** - 型安全な開発
- 🧪 **テストカバレッジ** - Vitestによる包括的テスト
- 🎨 **モダンUI** - Tailwind CSS 4.xとshadcn/ui

## 技術スタック

- **Frontend**: React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4.x, shadcn/ui
- **Notifications**: react-hot-toast
- **Build Tool**: Vite 7.0
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint with TypeScript support

## セットアップ

### 前提条件
- Node.js 18+ 
- npm 8+

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

アプリケーションは `http://localhost:5173` で起動します。

### その他のコマンド

```bash
# テスト実行
npm test

# テストUI表示
npm run test:ui

# ESLint実行
npm run lint

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## プロジェクト構造

```
src/
├── components/           # Reactコンポーネント
│   ├── StickyNote.tsx   # 付箋コンポーネント
│   ├── PinnedNote.tsx   # 固定メモコンポーネント
│   └── PinnedNotesArea.tsx # 固定エリアコンポーネント
├── constants/           # 定数定義
│   └── colors.ts        # 8色グラデーションパレット設定
├── hooks/               # カスタムフック
│   └── useStickyNotes.ts # 付箋管理ロジック（固定機能含む）
├── types/               # TypeScript型定義
│   └── StickyNote.ts    # 付箋データ型（isPinned追加）
├── test/                # テスト設定
│   └── setup.ts         # テストセットアップ（matchMediaモック含む）
├── App.tsx              # メインアプリ
├── StickyNotesApp.tsx   # 付箋アプリコンポーネント
└── main.tsx             # エントリーポイント
```

## 使用方法

### 1. 付箋の追加
- ヘッダーの「付箋を追加」ボタンをクリック
- 新しい付箋が画面上にランダムな位置で作成されます

### 2. 付箋の編集
- 付箋のテキストエリアをクリックしてメモを入力
- 変更は自動的に保存されます

### 3. 付箋の移動
- 付箋をドラッグして好きな位置に移動
- 画面端での制限により、付箋が画面外に出ることはありません

### 4. 重要メモの固定
- 付箋左上のピンアイコンをクリック
- 最大3個まで上部の固定エリアに表示
- 制限に達した場合は通知で案内
- 固定メモは編集・削除・固定解除が可能

### 5. 色の変更
- 付箋左上のパレットアイコンをクリック
- 8色のグラデーションパレットから選択

### 6. 付箋の削除
- 付箋右上の×ボタンで個別削除
- ヘッダーの「全て削除」ボタンで一括削除

## データ永続化

- 付箋データは`localStorage`に自動保存されます
- ブラウザをリロードしても、付箋の位置・内容・色が保持されます
- データ形式：JSON配列として`sticky-notes`キーで保存

## テスト

### テストファイル
- `src/App.test.tsx` - アプリケーション基本テスト
- `src/StickyNotesApp.test.tsx` - 付箋機能の包括テスト

### テスト内容
- 付箋の追加・編集・削除機能
- ドラッグ＆ドロップ機能
- カラー変更機能
- 固定機能（最大3個制限・通知機能含む）
- localStorage保存機能

```bash
# 全テスト実行
npm test

# 特定テストファイル実行
npm test StickyNotesApp.test.tsx
```

## パフォーマンス最適化

- **React.memo**: 不必要な再レンダリングを防止
- **useCallback**: イベントハンドラーの最適化
- **CSS変数**: Tailwind CSSによる効率的なスタイリング
- **Code Splitting**: Viteによる最適化されたバンドル

## ブラウザ対応

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## 開発者向け情報

### 設定ファイル
- `vite.config.ts` - Vite設定（Tailwind CSS 4.x対応）
- `tsconfig.json` - TypeScript設定（import alias設定済み）
- `eslint.config.js` - ESLint設定（React + TypeScript）
- `tailwind.config.js` - Tailwind CSS設定

### 環境固有の注意点
- Tailwind CSS 4.xを使用（3.xとは設定方法が異なります）
- shadcn/uiコンポーネントは必要に応じて追加可能
- TypeScriptの`verbatimModuleSyntax`が有効（type-only importが必要）

### デバッグ
```bash
# 開発者ツールでlocalStorageを確認
localStorage.getItem('sticky-notes')

# 付箋データをクリア
localStorage.removeItem('sticky-notes')
```