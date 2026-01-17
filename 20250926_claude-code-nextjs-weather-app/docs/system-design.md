# 天気予報アプリ システム設計書

## 1. システムアーキテクチャ

### 1.1 アーキテクチャ概要

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Next.js Frontend                     │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │        React Components                  │    │   │
│  │  │  - SearchBar                            │    │   │
│  │  │  - CurrentWeather                       │    │   │
│  │  │  - ForecastList                         │    │   │
│  │  │  - WeatherCard                          │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                 Next.js API Routes (Server)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │           /api/weather/[city]                     │   │
│  │           /api/forecast/[city]                    │   │
│  │                                                   │   │
│  │    - APIキーの安全な管理                          │   │
│  │    - リクエストの検証                            │   │
│  │    - レスポンスのキャッシング                    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│              External API (OpenWeatherMap)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │   - Current Weather API                          │   │
│  │   - 5 Day / 3 Hour Forecast API                  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 1.2 レイヤー構成

| レイヤー | 責務 | 技術 |
|---------|------|------|
| **プレゼンテーション層** | UI表示、ユーザー入力処理 | React, Tailwind CSS |
| **APIルート層** | APIキー管理、外部API通信 | Next.js API Routes |
| **外部サービス層** | 天気データ提供 | OpenWeatherMap API |

## 2. API設計

### 2.1 内部API (Next.js API Routes)

#### 現在の天気取得
```typescript
GET /api/weather/[city]

Request:
  - Params: city (string) - 都市名

Response:
  200 OK:
  {
    "city": "東京",
    "temperature": 20.5,
    "description": "晴れ",
    "icon": "01d",
    "tempMax": 24.0,
    "tempMin": 18.0,
    "humidity": 60,
    "windSpeed": 3.5
  }

  404 Not Found:
  {
    "error": "都市が見つかりません"
  }

  500 Internal Server Error:
  {
    "error": "APIエラーが発生しました"
  }
```

#### 5日間予報取得
```typescript
GET /api/forecast/[city]

Request:
  - Params: city (string) - 都市名

Response:
  200 OK:
  {
    "city": "東京",
    "forecasts": [
      {
        "date": "2025-01-26",
        "tempMax": 24.0,
        "tempMin": 18.0,
        "description": "晴れ",
        "icon": "01d"
      },
      // ... 5日分のデータ
    ]
  }
```

### 2.2 データフロー

```
1. ユーザー入力
   └→ SearchBar Component
      └→ 都市名バリデーション
         └→ API Route呼び出し

2. API Route処理
   └→ リクエスト検証
      └→ OpenWeatherMap API呼び出し
         └→ レスポンス整形
            └→ キャッシュ保存

3. UI更新
   └→ ローディング状態表示
      └→ データ受信
         └→ コンポーネント更新
            └→ エラーハンドリング
```

## 3. コンポーネント設計

### 3.1 コンポーネント階層

```
App (page.tsx)
├── SearchBar
│   ├── Input
│   └── Button
├── CurrentWeather
│   ├── CityName
│   ├── Temperature
│   ├── WeatherIcon
│   └── Details
└── ForecastList
    └── WeatherCard (×5)
        ├── Date
        ├── WeatherIcon
        └── Temperature
```

### 3.2 状態管理

```typescript
// アプリケーション状態
interface AppState {
  currentCity: string;           // 現在選択中の都市
  currentWeather: Weather | null; // 現在の天気データ
  forecast: Forecast[] | null;    // 5日間予報データ
  loading: boolean;               // ローディング状態
  error: string | null;          // エラーメッセージ
}
```

## 4. 型定義

### 4.1 天気データ型

```typescript
// 現在の天気
interface Weather {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  humidity?: number;
  windSpeed?: number;
}

// 予報データ
interface Forecast {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
}

// APIレスポンス
interface WeatherResponse {
  data?: Weather;
  error?: string;
}

interface ForecastResponse {
  city: string;
  forecasts: Forecast[];
  error?: string;
}
```

### 4.2 コンポーネントProps型

```typescript
// SearchBar
interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

// CurrentWeather
interface CurrentWeatherProps {
  weather: Weather;
}

// ForecastList
interface ForecastListProps {
  forecasts: Forecast[];
}

// WeatherCard
interface WeatherCardProps {
  forecast: Forecast;
}
```

## 5. エラーハンドリング設計

### 5.1 エラー種別

| エラー種別 | 説明 | 対処 |
|-----------|------|------|
| **入力エラー** | 空の都市名 | バリデーションメッセージ表示 |
| **404エラー** | 都市が見つからない | ユーザーフレンドリーなメッセージ |
| **APIエラー** | OpenWeatherMap API障害 | 再試行ボタン表示 |
| **ネットワークエラー** | 通信失敗 | オフライン状態の通知 |
| **レート制限** | API呼び出し上限超過 | 待機時間の表示 |

### 5.2 エラー表示UI

```typescript
interface ErrorState {
  type: 'validation' | 'notFound' | 'api' | 'network' | 'rateLimit';
  message: string;
  retry?: () => void;
}
```

## 6. パフォーマンス設計

### 6.1 最適化戦略

- **APIレスポンスキャッシング**: 5分間のキャッシュ保持
- **デバウンス**: 検索入力に500msのデバウンス適用
- **画像最適化**: Next.js Imageコンポーネント使用
- **コード分割**: 動的インポートによる初期バンドルサイズ削減

### 6.2 キャッシュ設計

```typescript
// キャッシュ構造
interface CacheEntry {
  data: Weather | Forecast[];
  timestamp: number;
  ttl: number; // 300秒 (5分)
}

// キャッシュキー
const getCacheKey = (type: 'weather' | 'forecast', city: string) => {
  return `${type}_${city.toLowerCase()}`;
};
```

## 7. セキュリティ設計

### 7.1 APIキー保護

- APIキーは環境変数 `OPEN_WEATHER_API_KEY` で管理
- クライアントサイドには露出しない
- API Routesでのみ使用

### 7.2 入力検証

```typescript
// 都市名バリデーション
const validateCity = (city: string): boolean => {
  const sanitized = city.trim();
  return sanitized.length > 0 && sanitized.length < 100;
};

// レート制限
const rateLimiter = {
  maxRequests: 10,
  windowMs: 60000, // 1分
};
```

## 8. テスト戦略

### 8.1 テスト種別

| テスト種別 | 対象 | ツール |
|-----------|------|--------|
| **単体テスト** | コンポーネント、ユーティリティ | Jest, React Testing Library |
| **統合テスト** | API Routes | Jest |
| **E2Eテスト** | ユーザーフロー | Playwright |

### 8.2 テストケース

- 都市検索の正常系
- 存在しない都市の検索
- APIエラー時の挙動
- ローディング状態の表示
- レスポンシブデザインの確認

## 9. 実装優先順位

1. **Phase 1**: 基本UI構築とモックデータ表示
2. **Phase 2**: API Routes実装とOpenWeatherMap連携
3. **Phase 3**: エラーハンドリングと最適化
4. **Phase 4**: テスト実装