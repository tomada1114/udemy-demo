# 天気予報アプリ 実装ワークフロー（TDD版）

## 実装概要

**プロジェクト**: 天気予報Webアプリケーション
**期間見積もり**: 3-4日（MVP完成まで）
**開発手法**: テスト駆動開発（TDD） - Red → Green → Refactor サイクル

## TDD基本原則

### Red-Green-Refactorサイクル
1. **Red**: 失敗するテストを書く（実装前）
2. **Green**: テストをパスする最小限の実装を行う
3. **Refactor**: コードを改善する（テストは通ったまま）

### テスト環境セットアップ（最初に実行）
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Jest設定（jest.config.js）
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

## Phase 1: プロジェクト初期設定とUI基盤構築 (Day 1)

### 目標
TDDアプローチで基本的なUIコンポーネントとレイアウトを構築し、テスト可能な設計を確立する。

### TDDワークフロー

#### 1.1 プロジェクト構造セットアップ
```bash
# ディレクトリ構造作成
- [ ] mkdir -p src/{types,components,lib,app/api}
- [ ] mkdir -p __tests__/{components,lib,api}
```

#### 1.2 型定義のテストファースト実装

##### 🔴 RED: 型定義テスト作成
```typescript
// __tests__/types/weather.test.ts
describe('Weather Types', () => {
  it('should have correct Weather interface structure', () => {
    const weather: Weather = {
      city: '東京',
      temperature: 20.5,
      description: '晴れ',
      icon: '01d',
      tempMax: 24.0,
      tempMin: 18.0,
    };
    expect(weather).toBeDefined();
  });

  it('should have correct Forecast interface structure', () => {
    const forecast: Forecast = {
      date: '2025-01-26',
      tempMax: 24.0,
      tempMin: 18.0,
      description: '晴れ',
      icon: '01d',
    };
    expect(forecast).toBeDefined();
  });
});
```

##### 🟢 GREEN: 型定義実装
```typescript
// src/types/weather.ts
export interface Weather {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  humidity?: number;
  windSpeed?: number;
}

export interface Forecast {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
}
```

#### 1.3 UIコンポーネントのテストファースト実装

##### SearchBarコンポーネント

###### 🔴 RED: SearchBarテスト作成
```typescript
// __tests__/components/SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('should render input and button', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText('都市名を入力')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('should call onSearch with city name when form is submitted', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('都市名を入力');
    const button = screen.getByRole('button', { name: '検索' });

    await user.type(input, '大阪');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('大阪');
  });

  it('should not call onSearch with empty input', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);
    const button = screen.getByRole('button', { name: '検索' });

    await user.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={true} />);
    expect(screen.getByRole('button', { name: '検索中...' })).toBeDisabled();
  });
});
```

###### 🟢 GREEN: SearchBar最小実装
```typescript
// src/components/SearchBar.tsx
'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="都市名を入力"
        className="flex-1 px-4 py-2 border rounded-lg"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !city.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? '検索中...' : '検索'}
      </button>
    </form>
  );
}
```

###### 🔵 REFACTOR: スタイリングとアクセシビリティ改善
```typescript
// src/components/SearchBar.tsx (改善版)
'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!city.trim()) {
      setError('都市名を入力してください');
      return;
    }

    onSearch(city.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="都市名を入力"
          aria-label="都市名"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          aria-label={isLoading ? '検索中' : '天気を検索'}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
```

##### CurrentWeatherコンポーネント（同様のTDDアプローチ）

###### 🔴 RED: CurrentWeatherテスト作成
```typescript
// __tests__/components/CurrentWeather.test.tsx
import { render, screen } from '@testing-library/react';
import CurrentWeather from '@/components/CurrentWeather';

const mockWeather = {
  city: '東京',
  temperature: 20.5,
  description: '晴れ',
  icon: '01d',
  tempMax: 24.0,
  tempMin: 18.0,
};

describe('CurrentWeather', () => {
  it('should display city name', () => {
    render(<CurrentWeather weather={mockWeather} />);
    expect(screen.getByText('東京')).toBeInTheDocument();
  });

  it('should display temperature with correct format', () => {
    render(<CurrentWeather weather={mockWeather} />);
    expect(screen.getByText('21°C')).toBeInTheDocument(); // 四捨五入
  });

  it('should display weather description', () => {
    render(<CurrentWeather weather={mockWeather} />);
    expect(screen.getByText('晴れ')).toBeInTheDocument();
  });

  it('should display max and min temperatures', () => {
    render(<CurrentWeather weather={mockWeather} />);
    expect(screen.getByText(/最高: 24°C/)).toBeInTheDocument();
    expect(screen.getByText(/最低: 18°C/)).toBeInTheDocument();
  });
});
```

### 成果物
- 全てのUIコンポーネントに対するテスト
- テストをパスする最小限の実装
- リファクタリングされた本番品質のコード

### 検証項目
- [ ] 全てのテストがパス（npm test）
- [ ] テストカバレッジ80%以上
- [ ] TypeScript型チェックパス
- [ ] ESLintチェックパス

---

## Phase 2: API実装と外部サービス連携 (Day 2) ✅

### 目標
TDDでNext.js API RoutesとOpenWeatherMap API連携を実装する。

### TDDワークフロー

#### 2.1 API Routesのテストファースト実装

##### 🔴 RED: 現在の天気APIテスト
```typescript
// __tests__/api/weather.test.ts
import { GET } from '@/app/api/weather/[city]/route';
import { NextRequest } from 'next/server';

// OpenWeatherMap APIモック
jest.mock('node-fetch');

describe('Weather API Route', () => {
  it('should return weather data for valid city', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather/tokyo');
    const response = await GET(request, { params: { city: 'tokyo' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('city', '東京');
    expect(data).toHaveProperty('temperature');
    expect(data).toHaveProperty('description');
  });

  it('should return 404 for invalid city', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather/invalid');
    const response = await GET(request, { params: { city: 'invalid' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error', '都市が見つかりません');
  });

  it('should handle API errors gracefully', async () => {
    // APIエラーをシミュレート
    const request = new NextRequest('http://localhost:3000/api/weather/tokyo');
    const response = await GET(request, { params: { city: 'tokyo' } });

    expect(response.status).toBe(500);
  });
});
```

##### 🟢 GREEN: API Route最小実装
```typescript
// app/api/weather/[city]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  const { city } = params;

  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '都市が見つかりません' },
          { status: 404 }
        );
      }
      throw new Error('API error');
    }

    const data = await response.json();

    return NextResponse.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tempMax: data.main.temp_max,
      tempMin: data.main.temp_min,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'APIエラーが発生しました' },
      { status: 500 }
    );
  }
}
```

##### 🔵 REFACTOR: キャッシング追加
```typescript
// app/api/weather/[city]/route.ts (改善版)
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const CACHE_TTL = 300; // 5分

// シンプルなインメモリキャッシュ
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  const { city } = params;
  const cacheKey = city.toLowerCase();

  // キャッシュチェック
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
    return NextResponse.json(cached.data);
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '都市が見つかりません' },
          { status: 404 }
        );
      }
      throw new Error('API error');
    }

    const data = await response.json();
    const weatherData = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tempMax: data.main.temp_max,
      tempMin: data.main.temp_min,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    // キャッシュに保存
    cache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json(
      { error: 'APIエラーが発生しました' },
      { status: 500 }
    );
  }
}
```

#### 2.2 APIクライアントのテストファースト実装

##### 🔴 RED: APIクライアントテスト
```typescript
// __tests__/lib/weather.test.ts
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather';

global.fetch = jest.fn();

describe('Weather API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch current weather successfully', async () => {
    const mockData = {
      city: '東京',
      temperature: 20.5,
      description: '晴れ',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchCurrentWeather('tokyo');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/api/weather/tokyo');
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCurrentWeather('tokyo')).rejects.toThrow('Network error');
  });
});
```

##### 🟢 GREEN: APIクライアント実装
```typescript
// src/lib/weather.ts
export async function fetchCurrentWeather(city: string) {
  const response = await fetch(`/api/weather/${city}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch weather');
  }

  return response.json();
}

export async function fetchForecast(city: string) {
  const response = await fetch(`/api/forecast/${city}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch forecast');
  }

  return response.json();
}
```

### 成果物
- テストカバレッジの高いAPI Routes
- モックを使用したユニットテスト
- OpenWeatherMapとの統合テスト
- キャッシング機能の実装とテスト

### 検証項目
- [ ] 全APIテストがパス
- [ ] APIモックが正しく動作
- [ ] エラーケースのテストカバレッジ
- [ ] キャッシュのテスト

---

## Phase 3: フロントエンド統合と検索機能 (Day 2-3)

### 目標
TDDでUIとAPIを統合し、実際に都市を検索して天気情報を表示できるようにする。

### TDDワークフロー

#### 3.1 統合テストファースト実装

##### 🔴 RED: メインページ統合テスト
```typescript
// __tests__/app/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '@/app/page';

// APIクライアントモック
jest.mock('@/lib/weather');

describe('Weather App Page', () => {
  it('should display default city weather on load', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('東京')).toBeInTheDocument();
    });
  });

  it('should search and display weather for entered city', async () => {
    const user = userEvent.setup();
    render(<Page />);

    const input = screen.getByPlaceholderText('都市名を入力');
    const button = screen.getByRole('button', { name: '検索' });

    await user.type(input, '大阪');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('大阪')).toBeInTheDocument();
    });
  });

  it('should show loading state during API call', async () => {
    const user = userEvent.setup();
    render(<Page />);

    const input = screen.getByPlaceholderText('都市名を入力');
    const button = screen.getByRole('button', { name: '検索' });

    await user.type(input, '名古屋');
    await user.click(button);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });
  });

  it('should display error message for invalid city', async () => {
    const user = userEvent.setup();
    render(<Page />);

    const input = screen.getByPlaceholderText('都市名を入力');
    const button = screen.getByRole('button', { name: '検索' });

    await user.type(input, 'InvalidCity');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('都市が見つかりません')).toBeInTheDocument();
    });
  });
});
```

##### 🟢 GREEN: メインページ実装
```typescript
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather';
import type { Weather, Forecast } from '@/types/weather';

export default function Page() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // デフォルト都市（東京）の天気を取得
  useEffect(() => {
    loadWeatherData('東京');
  }, []);

  const loadWeatherData = async (city: string) => {
    setLoading(true);
    setError('');

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData.forecasts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '天気情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    loadWeatherData(city);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadWeatherData('東京')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">天気予報アプリ</h1>

      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </div>

      {currentWeather && (
        <>
          <div className="mb-8">
            <CurrentWeather weather={currentWeather} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5日間の予報</h2>
            <ForecastList forecasts={forecast} />
          </div>
        </>
      )}
    </main>
  );
}
```

##### 🔵 REFACTOR: UX改善とエラーハンドリング強化
```typescript
// app/page.tsx (改善版)
'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather';
import type { Weather, Forecast } from '@/types/weather';

export default function Page() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCity, setCurrentCity] = useState('東京');

  const loadWeatherData = useCallback(async (city: string) => {
    setLoading(true);
    setError('');

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData.forecasts);
      setCurrentCity(city);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('都市が見つかりません')) {
          setError(`「${city}」という都市が見つかりませんでした。別の都市名をお試しください。`);
        } else if (err.message.includes('Network')) {
          setError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
        } else {
          setError('天気情報の取得に失敗しました。しばらくしてから再度お試しください。');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // デフォルト都市（東京）の天気を取得
  useEffect(() => {
    loadWeatherData('東京');
  }, [loadWeatherData]);

  const handleSearch = useCallback((city: string) => {
    loadWeatherData(city);
  }, [loadWeatherData]);

  const handleRetry = useCallback(() => {
    loadWeatherData(currentCity);
  }, [currentCity, loadWeatherData]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          天気予報アプリ
        </h1>

        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
          />
        )}

        {!loading && !error && currentWeather && (
          <>
            <div className="mb-8">
              <CurrentWeather weather={currentWeather} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-900">
                5日間の予報
              </h2>
              <ForecastList forecasts={forecast} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
```

### 成果物
- 統合テストでカバーされたメインページ
- エラーハンドリングのテスト
- UX改善のテスト（ローディング、エラー表示）

### 検証項目
- [ ] 統合テストがパス
- [ ] E2Eテストシナリオの実行
- [ ] エラーケースの網羅的テスト
- [ ] ユーザビリティテスト

---

## Phase 4: エラーハンドリングと最適化 (Day 3)

### 目標
本番環境に向けた品質向上と最適化を行う。

### タスクリスト

#### 4.1 エラーハンドリング強化
- [ ] グローバルエラーバウンダリ実装
- [ ] APIエラーの詳細化
  - [ ] レート制限エラー
  - [ ] ネットワークエラー
  - [ ] 無効な都市名エラー
- [ ] ユーザー向けエラーメッセージの改善

#### 4.2 パフォーマンス最適化
- [ ] 画像最適化（Next.js Image使用）
- [ ] コンポーネントのメモ化
- [ ] 不要な再レンダリング防止

#### 4.3 アクセシビリティ
- [ ] ARIAラベル追加
- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応

#### 4.4 セキュリティ
- [ ] 入力サニタイゼーション
- [ ] レート制限実装
- [ ] CSRFプロテクション

### 成果物
- プロダクション品質のアプリケーション
- 最適化されたパフォーマンス
- 堅牢なエラーハンドリング

### 検証項目
- [ ] Lighthouse スコア確認
- [ ] アクセシビリティチェック
- [ ] セキュリティ監査

---

## Phase 5: テストとドキュメント (Day 3-4)

### 目標
コードの品質を保証し、保守性を確保する。

### タスクリスト

#### 5.1 ユニットテスト
- [ ] コンポーネントテスト作成
- [ ] APIルートテスト作成
- [ ] ユーティリティ関数テスト

#### 5.2 統合テスト
- [ ] API連携テスト
- [ ] ユーザーフローテスト

#### 5.3 E2Eテスト（オプション）
- [ ] 検索フローテスト
- [ ] エラーケーステスト

#### 5.4 ドキュメント更新
- [ ] README.md 更新
- [ ] API仕様書の最終化
- [ ] デプロイ手順書作成

### 成果物
- テストカバレッジ80%以上
- 完全なドキュメント
- CI/CD準備完了

### 検証項目
- [ ] 全テストのパス
- [ ] ドキュメントの完全性
- [ ] コードレビュー完了

---

## デプロイ準備チェックリスト

### 必須項目
- [ ] 環境変数の設定確認
- [ ] ビルドエラーなし（`npm run build`）
- [ ] リンターエラーなし（`npm run lint`）
- [ ] TypeScriptエラーなし
- [ ] テスト全パス

### 推奨項目
- [ ] パフォーマンス最適化完了
- [ ] セキュリティチェック完了
- [ ] アクセシビリティ確認
- [ ] クロスブラウザテスト

### デプロイ先候補
- Vercel（推奨：Next.jsネイティブサポート）
- Netlify
- AWS Amplify

---

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| API制限超過 | 高 | キャッシング実装、エラーハンドリング |
| 都市名の曖昧性 | 中 | 検索候補表示、エラーメッセージ改善 |
| レスポンスの遅延 | 中 | ローディング表示、タイムアウト設定 |
| 日本語表示の問題 | 低 | UTF-8エンコーディング確認 |

---

## 成功基準

1. **機能要件の達成**
   - 都市名検索機能が動作する
   - 現在の天気が表示される
   - 5日間の予報が表示される

2. **非機能要件の達成**
   - レスポンシブデザイン対応
   - 3秒以内のページロード
   - エラー時の適切なフィードバック

3. **コード品質**
   - TypeScript型安全性
   - ESLintルール準拠
   - テストカバレッジ80%以上

---

## 次のステップ

実装開始の準備が整いました。Phase 1から順次実装を進めていきます。
