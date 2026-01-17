# FastAPI天気情報API 開発タスクリスト

- 参照ドキュメント: `requirements.md`, `design.md`
- チェックボックスにより進捗管理。完了した項目に `x` を記入する。

## Phase 1: 基礎編

### Step 1: 東京の天気を固定で返す（design.md §4 Phase 1 Step 1）
- [x] 必要ライブラリを`requirements.txt`に追記し、`pip install -r requirements.txt`で仮想環境へ導入。
- [x] FastAPIアプリの骨組みを作成（`app/main.py`、`routers/weather.py`のひな型）。
- [x] `WeatherResponse`モデルを実装（`schemas/weather.py`）。
- [x] OpenWeatherMap同期クライアントの初期実装（`services/openweather.py`）。
- [x] `/weather/tokyo`エンドポイント実装と単体テスト（成功ケース）。
- [x] 失敗時（外部APIエラー）の暫定挙動をテストで確認。

### Step 2: パスパラメータで東京と大阪に対応（design.md §4 Phase 1 Step 2）
- [x] 都市マッピング辞書またはEnumを導入し、`/weather/{city}`を実装。
- [x] 無効都市に対する400エラー処理を追加。
- [x] 新旧エンドポイントのテスト（成功・失敗）を拡張。

### Step 3: 5都市対応（design.md §4 Phase 1 Step 3）
- [x] 都市リストを5都市に拡張し単一情報源に集約。
- [x] ルーターのドキュメント更新（例示都市）。
- [x] 5都市のパラメータ化テストを実装。

## Phase 2: 応用編

### Step 4: 任意都市検索（design.md §4 Phase 2 Step 4）
- [x] クエリ版エンドポイント`GET /weather`を追加（バリデーション含む）。
- [x] `lang`パラメータ処理と正規表現バリデーション。
- [x] モックによる多言語レスポンステスト。

### Step 5: エラーハンドリング統一（design.md §4 Phase 2 Step 5）
- [x] `errors.py`で独自例外とハンドラを定義。
- [x] 既存エンドポイントを共通エラーへ切替。
- [x] `ErrorResponse`モデルの実装とテスト。
- [x] エラーログ出力を追加しテストでフォーマット確認。

## Phase 3: 実践編

### Step 6: 5日間予報（design.md §4 Phase 3 Step 6）
- [x] フォーキャスト用モデル`ForecastResponse`と`ForecastItem`を定義。
- [x] `fetch_forecast`サービス実装（`cnt`バリデーション含む）。
- [x] `GET /forecast/{city}`および`GET /forecast`エンドポイント実装。
- [x] タイムスタンプ3時間刻みを検証するテストを追加。

### Step 7: 複数都市比較（design.md §4 Phase 3 Step 7）
- [x] `ComparisonRequest`/`ComparisonResponse`モデル実装。
- [x] 非同期並列取得ロジック（`asyncio.gather`）をサービス層に追加。
- [x] `POST /weather/compare`エンドポイントと混在ケースのテスト。
- [x] エラー併存時のレスポンス整形＆ログ確認。
