# Writing Style Analyzer

AI時代の個人らしさを守る文体分析アプリケーション

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC)

## 概要

Writing Style Analyzerは、ユーザーが入力した文章から独自の文体・ライティングルール・特徴・雰囲気を抽出し、AIツールで活用しやすいMarkdown形式で出力するWebアプリケーションです。

Google Gemini AIを活用して、あなたの文体の特徴を詳細に分析し、今後のライティングで参考にできる具体的なルールを生成します。

## 特徴

### ✨ 主要機能
- **文体分析**: 最大2000文字のテキストから文体の特徴を抽出
- **ルール生成**: AIツールで使えるライティングルールを自動生成  
- **Markdown出力**: 分析結果をMarkdown形式で表示
- **ワンクリックコピー**: 結果を簡単にクリップボードにコピー
- **履歴管理**: 最大5件の分析履歴をローカルに保存

### 🎨 デザイン
- **Apple風デザインシステム**: 美しいGlassmorphismUI
- **8色テーマシステム**: サンシャイン、オーシャン、フォレストなど
- **3層背景グラデーション**: 奥行きのある美しい背景
- **60fpsアニメーション**: スムーズなマイクロインタラクション
- **レスポンシブデザイン**: モバイルファーストアプローチ

### ♿ アクセシビリティ
- **WCAG 2.1 AA準拠**: 適切なコントラスト比と操作性
- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **スクリーンリーダー対応**: 適切なARIA属性の実装

## 技術スタック

### フロントエンド
- **Next.js 15.3.4** - React ベースのフルスタックフレームワーク
- **React 19** - 最新のReactフレームワーク
- **TypeScript 5.x** - 型安全な開発環境
- **Tailwind CSS 4.x** - 最新のユーティリティファーストCSS

### UI/UXライブラリ
- **shadcn/ui** - モダンUIコンポーネント
- **Lucide React** - 美しいアイコンライブラリ
- **React Markdown** - Markdown表示機能
- **Sonner** - 通知システム

### AI・API
- **Google Gemini AI** - 文体分析エンジン
- **Gemini 2.5 Flash Lite Preview** - 最新の高速分析モデル

### 開発・テスト
- **Vitest** - 高速テストフレームワーク
- **React Testing Library** - Reactコンポーネントテスト
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター

## セットアップ

### 前提条件
- Node.js 18.x 以上
- npm または yarn または pnpm

### インストール

1. **リポジトリをクローン**
```bash
git clone <repository-url>
cd writing_style_analyzer
```

2. **依存関係をインストール**
```bash
npm install
```

3. **環境変数を設定**
```bash
cp .env.local.example .env.local
```

`.env.local` ファイルを編集し、Gemini API キーを設定：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **開発サーバーを起動**
```bash
npm run dev
```

5. **ブラウザでアクセス**
```
http://localhost:3000
```

### Gemini API キーの取得

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたAPIキーを `.env.local` に設定

## 使用方法

### 基本的な使い方

1. **ホームページから開始**
   - 「分析を始める」ボタンをクリック

2. **テキストを入力**
   - 分析したい文章を入力（最大2000文字）
   - ブログ記事、メール、SNS投稿など、あなたらしい文章を推奨

3. **分析実行**
   - 「文体を分析」ボタンをクリック
   - または `Cmd/Ctrl + Enter` でキーボードショートカット

4. **結果確認**
   - AI分析結果がMarkdown形式で表示
   - 「コピー」ボタンで結果をクリップボードにコピー

5. **履歴管理**
   - 過去5件の分析結果が自動的に保存
   - ローカルストレージで管理

### キーボードショートカット
- `Cmd/Ctrl + Enter`: 分析実行
- `Escape`: モーダルを閉じる

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# ESLint実行
npm run lint

# テスト実行
npm run test

# テスト実行（一回のみ）
npm run test:run

# テストUI起動
npm run test:ui
```

## プロジェクト構造

```
src/
├── app/                     # Next.js App Router
│   ├── api/analyze/        # 分析APIエンドポイント
│   ├── analyzer/           # 分析ページ
│   └── page.tsx            # ホームページ
├── components/             # Reactコンポーネント
│   ├── features/          # 機能別コンポーネント
│   │   ├── TextInput/     # テキスト入力機能
│   │   └── Analysis/      # 分析結果表示
│   ├── layout/            # レイアウトコンポーネント
│   ├── common/            # 共通コンポーネント
│   └── ui/                # shadcn/ui コンポーネント
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ・設定
├── types/                  # TypeScript型定義
└── test/                   # テストファイル
```

## 開発ガイドライン

### コーディング規約
- **TypeScript**: 型安全性重視、`any`型禁止
- **関数コンポーネント**: React Hooks活用
- **ESLint**: 設定済みルールに従う
- **コメント**: 日本語での詳細な説明

### デザインシステム
- **8色テーマ**: 統一されたカラーパレット
- **Glassmorphism**: 半透明・backdrop-blur効果
- **レスポンシブ**: モバイルファースト設計
- **アニメーション**: 60fps、意味のある動作

### テスト戦略
- **単体テスト**: 各コンポーネント・フック
- **統合テスト**: ユーザーフロー全体
- **アクセシビリティテスト**: WCAG準拠確認

## パフォーマンス

### Core Web Vitals 最適化
- **LCP**: 画像最適化、コード分割
- **FID**: 軽量なJavaScript、レスポンシブ設計
- **CLS**: 安定したレイアウト設計

### 最適化技術
- **React.memo**: 不要な再レンダリング防止
- **useMemo/useCallback**: 重い計算のメモ化
- **動的インポート**: 必要時のみコンポーネント読み込み

## デプロイ

### Vercel (推奨)
```bash
# Vercelにデプロイ
npx vercel

# 環境変数設定
vercel env add GEMINI_API_KEY
```

### その他のプラットフォーム
- **Netlify**: 静的サイトホスティング
- **Cloudflare Pages**: エッジでの高速配信
- **AWS Amplify**: AWSエコシステム統合

## トラブルシューティング

### よくある問題

**Q: Gemini API エラーが発生する**
```bash
# APIキーが正しく設定されているか確認
echo $GEMINI_API_KEY

# .env.local ファイルの場所を確認
ls -la .env.local
```

**Q: Tailwind CSSが適用されない**
```bash
# キャッシュをクリア
npm run build
```

**Q: テストが失敗する**
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

ご質問やサポートが必要な場合は、以下の方法でお問い合わせください：

- **Issue**: GitHub Issuesで報告
- **Discord**: コミュニティチャンネル
- **Email**: support@example.com

## 謝辞

- **Google Gemini AI**: 高品質な文体分析を可能にする強力なAI
- **Vercel**: 素晴らしいホスティングプラットフォーム
- **shadcn/ui**: 美しく使いやすいUIコンポーネント
- **Next.js チーム**: 優れた開発体験を提供するフレームワーク

---

**Writing Style Analyzer** - あなたの文体を、AIと共に進化させよう。