# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、React + TypeScript + Viteを使用した付箋アプリケーション（sticky note app）です。vibe-codingワークスペースの他のプロジェクトとは異なり、モダンなReactフレームワークスタックを採用しています。

## 共通コマンド

### 開発コマンド
```bash
npm install          # 依存関係のインストール（初回のみ）
npm run dev         # 開発サーバーの起動（http://localhost:5173）
npm run build       # プロダクションビルドの生成
npm run preview     # ビルド結果のプレビュー
npm run lint        # ESLintによるコード検証
```

## 言語とコミュニケーション

- **すべてのコミットメッセージとファイル内コメントは日本語で記述**
- コード変数名と関数名は英語でも可、ただしドキュメントは日本語

## アーキテクチャ

### 技術スタック
- **React 19.1.0** - UIライブラリ
- **TypeScript** - 型安全なJavaScript
- **Vite** - 高速ビルドツール
- **ESLint** - コードリンター

### プロジェクト構造
```
src/
├── App.tsx         # メインReactコンポーネント
├── App.css         # コンポーネント固有のスタイル
├── index.css       # グローバルスタイル
├── main.tsx        # エントリーポイント
└── components/     # Reactコンポーネント（作成予定）
```

### 開発パターン
- **関数コンポーネント**: React Hooksを使用した関数型コンポーネント
- **TypeScript**: 型安全性を確保するための型定義
- **CSS Modules**: コンポーネント単位のスタイリング
- **Hot Module Replacement**: Viteによる高速な開発体験

### 付箋アプリケーション実装方針
- ローカルストレージを使用したデータ永続化
- ドラッグ＆ドロップによる付箋の移動
- リサイズ可能な付箋
- カラーピッカーによる付箋の色変更
- リアルタイムな編集と自動保存