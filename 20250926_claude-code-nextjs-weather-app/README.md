# 天気予報アプリケーション

OpenWeatherMap APIを使用したシンプルな天気予報Webアプリケーション。

## 機能

- 🔍 都市名での天気検索
- 🌡️ 現在の天気情報表示（気温、天気、湿度、風速）
- 📅 5日間の天気予報
- 🌐 日本語対応
- 📱 レスポンシブデザイン
- ⚡ 5分間のキャッシュ機能

## 技術スタック

- **フレームワーク**: Next.js 15.5.0 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **API**: OpenWeatherMap API
- **テスト**: Jest, React Testing Library

## セットアップ

### 必要条件

- Node.js 18.0.0以上
- npm または yarn
- OpenWeatherMap APIキー（[こちら](https://openweathermap.org/api)から取得）

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd weather-app
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
`.env.local`ファイルを作成し、APIキーを設定：
```env
OPEN_WEATHER_API_KEY=your_api_key_here
```

4. 開発サーバーを起動
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# テスト実行
npm test

# リントチェック
npm run lint
```

## プロジェクト構造

```
weather-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── weather/[city]/    # 現在の天気API
│   │   │   └── forecast/[city]/   # 天気予報API
│   │   ├── page.tsx               # メインページ
│   │   ├── layout.tsx             # ルートレイアウト
│   │   └── globals.css            # グローバルスタイル
│   ├── components/
│   │   ├── SearchBar.tsx          # 検索バー
│   │   ├── CurrentWeather.tsx     # 現在の天気表示
│   │   ├── WeatherCard.tsx        # 予報カード
│   │   ├── ForecastList.tsx       # 予報リスト
│   │   ├── LoadingSpinner.tsx     # ローディング表示
│   │   └── ErrorBoundary.tsx      # エラーバウンダリ
│   ├── lib/
│   │   └── weather.ts             # APIクライアント
│   └── types/
│       └── weather.ts             # 型定義
├── __tests__/                      # テストファイル
├── docs/                           # ドキュメント
└── public/                         # 静的ファイル
```

## デプロイ

### Vercel (推奨)

最も簡単な方法は[Vercel](https://vercel.com)を使用することです。

1. Vercelにサインアップ
2. GitHubリポジトリをインポート
3. 環境変数`OPEN_WEATHER_API_KEY`を設定
4. デプロイ

詳細は[Next.js デプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。

### その他のプラットフォーム

- Netlify
- AWS Amplify
- Railway

各プラットフォームのドキュメントに従って環境変数を設定してください。
