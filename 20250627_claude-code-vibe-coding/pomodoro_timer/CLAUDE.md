# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

React + TypeScript + Vite で構築されたポモドーロタイマーアプリケーション。Udemyコース「vibe-coding」の一部として、インタラクティブなWebアプリケーション開発を実証するプロジェクトです。

## 共通コマンド

- **開発サーバー起動**: `npm run dev`
- **本番ビルド**: `npm run build`
- **コード品質チェック**: `npm run lint`
- **プレビュー（本番ビルド後）**: `npm run preview`
- **テスト実行**: `npm run test`
- **テスト（UIモード）**: `npm run test:ui`
- **テストカバレッジ**: `npm run test:coverage`
- **TypeScript型チェック**: `npx tsc --noEmit`

## 技術スタック

- **フロントエンド**: React 19.1.0
- **言語**: TypeScript 5.8.3
- **ビルドツール**: Vite 7.0.0
- **スタイリング**: Tailwind CSS 4.1.11 + shadcn/ui
- **テスト**: Vitest + Testing Library
- **リンター**: ESLint 9.29.0
- **開発環境**: Vite HMR（Hot Module Replacement）

## プロジェクト構造

```
src/
├── main.tsx              # アプリケーションエントリーポイント
├── App.tsx               # メインアプリコンポーネント
├── index.css             # グローバルスタイル + shadcn/ui変数
├── components/           # Reactコンポーネント
│   ├── ui/              # shadcn/ui コンポーネント
│   │   ├── button.tsx   # ボタンコンポーネント
│   │   └── input.tsx    # 入力フィールドコンポーネント  
│   ├── PomodoroTimer.tsx    # メインタイマーコンポーネント
│   ├── TimerDisplay.tsx     # 時間表示コンポーネント
│   ├── TimerControls.tsx    # 操作ボタンコンポーネント
│   ├── TimerSettings.tsx    # 設定コンポーネント
│   └── ProgressRing.tsx     # 円形プログレスバー
├── hooks/               # カスタムフック
│   ├── useTimer.ts      # タイマーロジック（状態管理・計算）
│   └── useAudio.ts      # 音声通知機能
├── lib/                 # ユーティリティ
│   └── utils.ts         # shadcn/ui用クラスユーティリティ
├── __tests__/           # テストファイル
├── test/                # テスト設定
└── assets/              # 静的アセット
```

## 開発環境設定

### TypeScript設定
- **コンパイルターゲット**: ES2022
- **JSX**: react-jsx（React 17+ 新形式）
- **厳密モード**: 有効
- **未使用変数・パラメータ検出**: 有効
- **パスエイリアス**: `@/*` = `src/*`

### ESLint設定
- React Hooks推奨ルール適用
- React Refresh（HMR）対応
- TypeScript推奨ルール適用
- ES2020+ 構文対応

### テスト環境
- **テストランナー**: Vitest（Vite統合）
- **テスト環境**: jsdom（ブラウザ環境シミュレーション）
- **テストライブラリ**: @testing-library/react + @testing-library/user-event
- **グローバル設定**: `globals: true`でJest風API使用可能

## 開発ワークフロー

1. **開発開始**: `npm run dev` でローカル開発サーバー起動
2. **コード修正**: src/ ディレクトリ内のファイルを編集
3. **品質チェック**: `npm run lint` でコード品質確認
4. **型チェック**: TypeScriptコンパイラーによる自動型検証
5. **ビルド確認**: `npm run build` で本番ビルド成功確認

## 言語とコミュニケーション

- **コミットメッセージ**: 日本語で記述
- **コメント**: 日本語で記述
- **変数・関数名**: 英語（React/TypeScript慣例に従う）
- **ドキュメント**: 日本語

## アーキテクチャ原則

### コンポーネント設計
- **再利用可能なコンポーネント**: shadcn/uiパターンでUI部品を分離
- **カスタムフック**: ビジネスロジックを分離（useTimer、useAudio）
- **プロップス型定義**: 全てのコンポーネントで厳密な型定義
- **関数コンポーネント**: React Hooks中心の設計

### 状態管理
- **useTimer**: ポモドーロタイマーの全状態を管理
- **ローカル状態**: useState/useEffect中心のシンプルな設計
- **音声通知**: useAudioフックで通知機能を分離

### スタイリング
- **Tailwind CSS**: ユーティリティファースト
- **shadcn/ui**: CSS変数ベースのテーマシステム
- **レスポンシブ**: モバイルファーストの設計

## 注意事項

- React 19の新機能に対応した開発
- TypeScript strict modeでの開発必須
- ESLintエラーの解決を優先
- テスト実行後にlintチェックを忘れずに実行
- パスエイリアス `@/` を使用してインポート
- shadcn/uiコンポーネントのカスタマイズ時はCSS変数を活用