# FastAPI天気情報API - 要件定義書

---

## **📋 プロジェクト概要**

### **目的**
OpenWeatherMap APIを利用して、シンプルで使いやすい天気情報APIを構築する。ローカル環境で段階的に機能を追加し、各ステップで明確な動作確認を行いながらFastAPIの使い方を習得する。

### **重要な方針**
- **ローカル開発**: 開発用サーバー（`uvicorn`）で動作確認
- **最小限の情報**: 気温、天気の説明、湿度のみ
- **段階的な実装**: 各ステップを順番に完成させる
- **明確な動作確認**: ブラウザでJSONレスポンスを確認

---

## **🎯 実装ステップ一覧**

```
Phase 1: 基礎編
├── Step 1: 東京の天気を固定で返す
├── Step 2: パスパラメータで東京と大阪に対応
└── Step 3: 5つの主要都市に対応

Phase 2: 応用編
├── Step 4: 任意の都市を検索できるようにする
└── Step 5: エラーハンドリングを統一する

Phase 3: 実践編
├── Step 6: 5日間の天気予報を取得
└── Step 7: 複数都市の天気を比較
```

---

## **Phase 1: 基礎編**

### **Step 1: 東京の天気を固定で返す**

#### **実装する機能**
東京の現在の天気情報を取得して返すエンドポイントを作成する。

#### **エンドポイント**
```
GET /weather/tokyo
```

#### **OpenWeatherMap API呼び出し**
```
https://api.openweathermap.org/data/2.5/weather?q=Tokyo&units=metric&lang=ja&appid={API_KEY}
```

**パラメータ:**
- `q=Tokyo`: 都市名（固定）
- `units=metric`: 摂氏温度
- `lang=ja`: 日本語の説明
- `appid={API_KEY}`: 環境変数から取得

#### **期待されるレスポンス**
```json
{
  "city": "Tokyo",
  "temperature": 15.5,
  "weather_description": "曇りがち",
  "humidity": 65
}
```

#### **レスポンスフィールド**
| フィールド            | 型      | 説明          | OpenWeatherMapのフィールド |
| --------------------- | ------- | ------------- | -------------------------- |
| `city`                | string  | 都市名        | `name`                     |
| `temperature`         | float   | 現在気温（℃） | `main.temp`                |
| `weather_description` | string  | 天気の説明    | `weather[0].description`   |
| `humidity`            | integer | 湿度（%）     | `main.humidity`            |

#### **動作確認**
```
1. サーバー起動: uvicorn main:app --reload
2. ブラウザで http://127.0.0.1:8000/weather/tokyo にアクセス
3. 上記4つのフィールドを含むJSONが表示される
4. ステータスコード: 200
```

#### **実装のヒント**
- FastAPIで`@app.get("/weather/tokyo")`を定義
- `httpx`ライブラリで外部APIを呼び出し
- レスポンスから必要なフィールドだけを抽出
- Pydanticモデルでレスポンス型を定義

---

### **Step 2: パスパラメータで東京と大阪に対応**

#### **実装する機能**
パスパラメータで都市を指定できるようにする。ただし、東京と大阪のみ許可。

#### **エンドポイント**
```
GET /weather/{city}
```

#### **パスパラメータ**
- `city`: `tokyo` または `osaka` のみ許可

#### **許可する都市とOpenWeatherMapでの都市名**
| パラメータ | 実際の都市名 |
| ---------- | ------------ |
| `tokyo`    | `Tokyo`      |
| `osaka`    | `Osaka`      |

#### **動作確認（成功例）**

**リクエスト1:**
```
http://127.0.0.1:8000/weather/tokyo
```
**期待されるレスポンス:**
```json
{
  "city": "Tokyo",
  "temperature": 15.5,
  "weather_description": "曇りがち",
  "humidity": 65
}
```

**リクエスト2:**
```
http://127.0.0.1:8000/weather/osaka
```
**期待されるレスポンス:**
```json
{
  "city": "Osaka",
  "temperature": 16.2,
  "weather_description": "晴天",
  "humidity": 58
}
```

#### **動作確認（エラー例）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/kyoto
```
**期待されるレスポンス:**
```json
{
  "detail": "指定された都市はサポートされていません。利用可能な都市: tokyo, osaka"
}
```
**ステータスコード:** 400

#### **実装のヒント**
- パスパラメータを受け取る: `@app.get("/weather/{city}")`
- 許可リストで都市をチェック: `ALLOWED_CITIES = ["tokyo", "osaka"]`
- 許可されていない場合は`HTTPException(status_code=400)`
- 都市名を適切に変換（`tokyo` → `Tokyo`）

---

### **Step 3: 5つの主要都市に対応**

#### **実装する機能**
対応都市を5つに拡張する。

#### **対応都市**
| パラメータ | 実際の都市名 |
| ---------- | ------------ |
| `tokyo`    | `Tokyo`      |
| `osaka`    | `Osaka`      |
| `sapporo`  | `Sapporo`    |
| `nagoya`   | `Nagoya`     |
| `fukuoka`  | `Fukuoka`    |

#### **動作確認**

各都市で同じ形式のレスポンスが返ることを確認:
```
http://127.0.0.1:8000/weather/tokyo
http://127.0.0.1:8000/weather/osaka
http://127.0.0.1:8000/weather/sapporo
http://127.0.0.1:8000/weather/nagoya
http://127.0.0.1:8000/weather/fukuoka
```

**期待されるレスポンス（札幌の例）:**
```json
{
  "city": "Sapporo",
  "temperature": 8.3,
  "weather_description": "小雪",
  "humidity": 75
}
```

**エラー確認:**
```
http://127.0.0.1:8000/weather/sendai
```
**期待されるレスポンス:**
```json
{
  "detail": "指定された都市はサポートされていません。利用可能な都市: tokyo, osaka, sapporo, nagoya, fukuoka"
}
```
**ステータスコード:** 400

#### **実装のヒント**
- `ALLOWED_CITIES`リストに3都市追加
- バリデーションロジックは変更不要

---

## **Phase 2: 応用編**

### **Step 4: 任意の都市を検索できるようにする**

#### **実装する機能**
世界中の任意の都市を検索できる新しいエンドポイントを作成。

#### **エンドポイント**
```
GET /weather/current
```

#### **クエリパラメータ**
| パラメータ | 型     | 必須 | デフォルト | 説明                       |
| ---------- | ------ | ---- | ---------- | -------------------------- |
| `city`     | string | ○    | -          | 都市名（英語）             |
| `lang`     | string | -    | `ja`       | 言語コード（`ja` or `en`） |

#### **OpenWeatherMap API呼び出し**
```
https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&lang={lang}&appid={API_KEY}
```

#### **動作確認（日本語）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/current?city=London
```
**期待されるレスポンス:**
```json
{
  "city": "London",
  "temperature": 12.5,
  "weather_description": "薄い雲",
  "humidity": 70
}
```

#### **動作確認（英語）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/current?city=Paris&lang=en
```
**期待されるレスポンス:**
```json
{
  "city": "Paris",
  "temperature": 14.0,
  "weather_description": "light clouds",
  "humidity": 65
}
```

#### **動作確認（パラメータ不足）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/current
```
**期待されるレスポンス:**
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["query", "city"],
      "msg": "Field required"
    }
  ]
}
```
**ステータスコード:** 422

#### **実装のヒント**
- クエリパラメータを受け取る: `city: str, lang: str = "ja"`
- FastAPIが自動でバリデーション
- Phase 1のエンドポイント（`/weather/{city}`）はそのまま残す

---

### **Step 5: エラーハンドリングを統一する**

#### **実装する機能**
すべてのエラーで統一されたフォーマットのレスポンスを返す。

#### **エラーレスポンス形式**
```json
{
  "error": "エラータイプ",
  "message": "エラーメッセージ",
  "detail": "詳細な説明"
}
```

#### **エラータイプ一覧**
| エラータイプ         | HTTPステータス | 発生条件                         |
| -------------------- | -------------- | -------------------------------- |
| `CityNotFoundError`  | 404            | 都市が見つからない               |
| `APIConnectionError` | 503            | OpenWeatherMap APIに接続できない |
| `APIKeyError`        | 500            | APIキーが設定されていない        |

#### **動作確認（都市が見つからない）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/current?city=InvalidCity123
```
**期待されるレスポンス:**
```json
{
  "error": "CityNotFoundError",
  "message": "都市 'InvalidCity123' が見つかりません",
  "detail": "都市名のスペルを確認してください。英語表記を推奨します。"
}
```
**ステータスコード:** 404

#### **動作確認（API接続エラー）**

**リクエスト（APIキーを無効にした状態）:**
```
http://127.0.0.1:8000/weather/current?city=Tokyo
```
**期待されるレスポンス:**
```json
{
  "error": "APIConnectionError",
  "message": "天気情報の取得に失敗しました",
  "detail": "OpenWeatherMap APIとの接続に問題があります。"
}
```
**ステータスコード:** 503

#### **実装のヒント**
- カスタム例外クラスを作成
- `@app.exception_handler`でエラーハンドラー登録
- OpenWeatherMap APIの404エラー（`cod: "404"`）を検知

---

## **Phase 3: 実践編**

### **Step 6: 5日間の天気予報を取得**

#### **実装する機能**
指定した都市の5日間天気予報（3時間ごと）を取得する。

#### **エンドポイント**
```
GET /weather/forecast
```

#### **クエリパラメータ**
| パラメータ | 型      | 必須 | デフォルト | 説明              |
| ---------- | ------- | ---- | ---------- | ----------------- |
| `city`     | string  | ○    | -          | 都市名            |
| `lang`     | string  | -    | `ja`       | 言語コード        |
| `cnt`      | integer | -    | 全て       | 取得件数（1〜40） |

#### **OpenWeatherMap API呼び出し**
```
https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&lang={lang}&appid={API_KEY}
```

オプションで`cnt`パラメータを追加:
```
https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&lang={lang}&cnt={cnt}&appid={API_KEY}
```

#### **動作確認（全件取得）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/forecast?city=Tokyo
```
**期待されるレスポンス:**
```json
{
  "city": "Tokyo",
  "forecasts": [
    {
      "datetime": "2025-10-17T15:00:00",
      "temperature": 18.5,
      "weather_description": "晴天",
      "humidity": 60
    },
    {
      "datetime": "2025-10-17T18:00:00",
      "temperature": 16.0,
      "weather_description": "快晴",
      "humidity": 65
    },
    {
      "datetime": "2025-10-17T21:00:00",
      "temperature": 14.5,
      "weather_description": "晴天",
      "humidity": 70
    }
    // ... 最大40件（5日間×8回/日）
  ]
}
```

#### **動作確認（件数指定）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/forecast?city=Osaka&cnt=8
```
**期待されるレスポンス:**
```json
{
  "city": "Osaka",
  "forecasts": [
    // ... 8件の予報データのみ
  ]
}
```

#### **レスポンスフィールド**
| フィールド  | 型     | 説明             |
| ----------- | ------ | ---------------- |
| `city`      | string | 都市名           |
| `forecasts` | array  | 予報データの配列 |

**forecastsの各要素:**
| フィールド            | 型      | 説明                 | OpenWeatherMapのフィールド |
| --------------------- | ------- | -------------------- | -------------------------- |
| `datetime`            | string  | 予報日時（ISO 8601） | `dt_txt`                   |
| `temperature`         | float   | 気温（℃）            | `main.temp`                |
| `weather_description` | string  | 天気の説明           | `weather[0].description`   |
| `humidity`            | integer | 湿度（%）            | `main.humidity`            |

#### **実装のヒント**
- OpenWeatherMap APIの`list`配列をループ処理
- 各要素から必要なフィールドを抽出
- `cnt`パラメータがある場合は配列をスライス

---

### **Step 7: 複数都市の天気を比較**

#### **実装する機能**
複数の都市の天気情報を一度に取得して比較する。

#### **エンドポイント**
```
GET /weather/compare
```

#### **クエリパラメータ**
| パラメータ | 型     | 必須 | デフォルト | 説明                       |
| ---------- | ------ | ---- | ---------- | -------------------------- |
| `cities`   | string | ○    | -          | カンマ区切りの都市名リスト |
| `lang`     | string | -    | `ja`       | 言語コード                 |

#### **動作確認（全て成功）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/compare?cities=Tokyo,Osaka,Fukuoka
```
**期待されるレスポンス:**
```json
{
  "cities": [
    {
      "city": "Tokyo",
      "temperature": 15.5,
      "weather_description": "曇りがち",
      "humidity": 65
    },
    {
      "city": "Osaka",
      "temperature": 16.2,
      "weather_description": "晴天",
      "humidity": 58
    },
    {
      "city": "Fukuoka",
      "temperature": 17.0,
      "weather_description": "快晴",
      "humidity": 55
    }
  ]
}
```

#### **動作確認（一部エラー）**

**リクエスト:**
```
http://127.0.0.1:8000/weather/compare?cities=Tokyo,InvalidCity,Osaka
```
**期待されるレスポンス:**
```json
{
  "cities": [
    {
      "city": "Tokyo",
      "temperature": 15.5,
      "weather_description": "曇りがち",
      "humidity": 65
    },
    {
      "city": "Osaka",
      "temperature": 16.2,
      "weather_description": "晴天",
      "humidity": 58
    }
  ],
  "errors": [
    {
      "city": "InvalidCity",
      "error": "都市が見つかりません"
    }
  ]
}
```
**ステータスコード:** 200（一部失敗でも成功扱い）

#### **レスポンスフィールド**
| フィールド | 型    | 必須 | 説明                                       |
| ---------- | ----- | ---- | ------------------------------------------ |
| `cities`   | array | ○    | 成功した都市のデータ                       |
| `errors`   | array | -    | 失敗した都市の情報（エラーがある場合のみ） |

**errorsの各要素:**
| フィールド | 型     | 説明             |
| ---------- | ------ | ---------------- |
| `city`     | string | 失敗した都市名   |
| `error`    | string | エラーメッセージ |

#### **実装のヒント**
- `cities`パラメータを`,`で分割: `cities.split(",")`
- 各都市に対して順番にAPIを呼び出し
- エラーが発生しても処理を続行
- 成功したデータは`cities`配列に、失敗は`errors`配列に追加

---

## **🔄 その他のエンドポイント**

### **ルートエンドポイント**

#### **エンドポイント**
```
GET /
```

#### **期待されるレスポンス**
```json
{
  "service": "FastAPI天気情報API",
  "version": "1.0.0",
  "description": "世界中の都市の天気情報を提供します",
  "docs_url": "/docs"
}
```

#### **実装のヒント**
- 固定のJSONを返すだけのシンプルなエンドポイント

---

### **ヘルスチェック**

#### **エンドポイント**
```
GET /health
```

#### **期待されるレスポンス**
```json
{
  "status": "healthy",
  "service": "FastAPI天気情報API"
}
```

#### **実装のヒント**
- サーバーが起動していることを確認するためのエンドポイント
- 固定のJSONを返す

---

### **APIドキュメント**

#### **エンドポイント**
```
GET /docs
```

#### **説明**
FastAPIが自動生成するSwagger UIドキュメント。すべてのエンドポイントを対話的にテストできる。

#### **確認内容**
- すべてのエンドポイントが一覧表示される
- 各エンドポイントで"Try it out"ボタンが使える
- リクエスト/レスポンスの例が表示される

---

## **⚙️ 環境設定**

### **必要な環境変数**

`.env`ファイルを作成:
```bash
OPENWEATHERMAP_API_KEY=your_api_key_here
```

### **APIキーの取得**

1. https://openweathermap.org/ にアクセス
2. 無料アカウントを作成
3. API Keysページからキーをコピー
4. `.env`ファイルに貼り付け

### **レート制限**

- Free Tier: 60 calls/minute
- 開発中は頻繁に呼び出すので注意

---

## **📝 ステップごとの完了確認チェックリスト**

### **Step 1完了の条件**
- [ ] `/weather/tokyo`にアクセスできる
- [ ] 4つのフィールドを含むJSONが返る
- [ ] ステータスコードが200
- [ ] 実際の天気データが取得できる

### **Step 2完了の条件**
- [ ] `/weather/tokyo`と`/weather/osaka`が動作する
- [ ] 不正な都市名で400エラーが返る
- [ ] エラーメッセージが適切

### **Step 3完了の条件**
- [ ] 5都市すべてで天気が取得できる
- [ ] レスポンス形式が統一されている

### **Step 4完了の条件**
- [ ] 任意の都市が検索できる
- [ ] `lang`パラメータが機能する
- [ ] パラメータ不足で422エラーが返る

### **Step 5完了の条件**
- [ ] すべてのエラーが統一形式で返る
- [ ] 存在しない都市で404エラー
- [ ] 3つのフィールド（error, message, detail）がある

### **Step 6完了の条件**
- [ ] 予報データが配列形式で返る
- [ ] `cnt`パラメータが機能する
- [ ] datetimeが3時間刻み

### **Step 7完了の条件**
- [ ] 複数都市のデータが一度に取得できる
- [ ] 一部失敗でも処理が続行される
- [ ] `cities`と`errors`フィールドが適切

---

## **🚀 開発の進め方**

1. **Step 1から順番に実装**
2. **各ステップ完了後、必ずブラウザで動作確認**
3. **次のステップに進む前にチェックリストを確認**
4. **困ったら `/docs` でSwagger UIを確認**
