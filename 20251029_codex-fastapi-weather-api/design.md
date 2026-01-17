# FastAPI天気情報API 設計書

## 1. 目的と範囲
- OpenWeatherMapのデータを用いて日本語で天気情報を提供するローカルAPIを段階的に構築する。
- requirements.mdで定義されたPhase 1〜3の各Stepを順番に実装する際の指針とし、コード構成・API仕様・エラーハンドリング・テスト方針を明確にする。

## 2. 技術スタックと依存関係
- Python 3.11想定（ローカルvenv `myvenv`を利用）。
- ライブラリは必ず `requirements.txt` に追記してから `pip install -r requirements.txt` を実行する（手動で直接 `pip install` しない）。
- FastAPI + Uvicorn: APIサーバーと自動ドキュメント。
- httpx: OpenWeatherMapとのHTTP通信（Step4以降で非同期I/O活用を想定）。
- Pydantic v2: リクエスト/レスポンススキーマ、設定管理。
- python-dotenv: `.env`からの環境変数読込。
- pytest + httpx MockTransport: ユニットテスト用。

## 3. システム構成
### 3.1 ディレクトリレイアウト（段階的に拡張）
```
app/
  __init__.py
  main.py                # FastAPIアプリのエントリーポイント
  config.py              # 環境変数の読込と設定モデル
  schemas/
    __init__.py
    weather.py           # レスポンス/リクエスト用Pydanticモデル
    error.py             # エラーレスポンスモデル（Step5で追加）
  services/
    __init__.py
    openweather.py       # OpenWeatherMap呼び出しロジック
  routers/
    __init__.py
    weather.py           # 天気情報APIルーター
    health.py            # ルート/ヘルスチェック
  errors.py              # 独自例外と例外ハンドラ（Step5で導入）

tests/
  conftest.py
  test_weather.py
  test_forecast.py
```

### 3.2 共通ユーティリティ
- `Settings`モデルで`OPENWEATHERMAP_API_KEY`とベースURLを管理。起動時にキー未設定の場合は例外で失敗させる。
- OpenWeatherMapクライアントは単一責務のサービス層として実装し、将来的なAPI差し替えに備える。
- レスポンスはPydanticモデルへマッピングし、UI層（FastAPIハンドラ）からの辞書整形を排除。
- ロギングは標準`logging`でINFOレベル以上を出力。Step5以降のエラー時はコンテキスト情報（都市名、エンドポイント）を付与。

## 4. フェーズ別設計
### Phase 1: 基礎編
#### Step 1: 東京の天気を固定で返す
- **エンドポイント**: `GET /weather/tokyo`
- **処理フロー**:
  1. ルーターでHTTPリクエストを受ける。
  2. サービス層で`q=Tokyo`固定でOpenWeatherMapへ同期リクエスト。
  3. レスポンスから必要フィールドを抽出し`WeatherResponse`モデルにマッピング。
  4. 200レスポンスで返却。
- **データモデル** (`WeatherResponse`):
  - `city: str`
  - `temperature: float`
  - `weather_description: str`
  - `humidity: int`
- **テスト**:
  - モックレスポンスを用いて温度等が正しく返ること。
  - OpenWeatherMapエラー時の例外は一旦FastAPIのデフォルトエラー（500）で落ちる前提。

#### Step 2: パスパラメータで東京と大阪に対応
- **エンドポイント**: `GET /weather/{city}`
- **都市制限**: `Literal["tokyo", "osaka"]`または`Enum`でバリデーション。
- **処理**:
  - パスパラメータを都市マッピング辞書に変換（例: `{"tokyo": "Tokyo", "osaka": "Osaka"}`）。
  - その他の流れはStep1と同じ。
- **エラー設計**:
  - 未定義都市は`HTTPException(status_code=400)`で返却（Step5で統一化予定）。
- **テスト**:
  - 有効都市で200。
  - 無効都市で400とメッセージ確認。

#### Step 3: 5つの主要都市に対応
- **都市リスト**: `tokyo`, `osaka`, `sapporo`, `nagoya`, `fukuoka`（要件に従い具体化）。
- **実装**:
  - 都市マッピングを列挙型または辞書で拡張。
  - ルーターのドキュメントに`city`の例を追記。
- **改善点**:
  - 都市マッピングを`app/services/openweather.py`内の定数へ移し、単一情報源を確立。
  - Step5を見据え、サービス層で緩やかな例外変換を検討（例: `UnknownCityError`）。
- **テスト**: 5都市分のパラメータ化テスト。

### Phase 2: 応用編
#### Step 4: 任意の都市検索
- **エンドポイント**: `GET /weather`
- **クエリパラメータ**:
  - `city: str`（必須）
  - `lang: str = "ja"`（オプション、OpenWeatherMapへパススルー）
- **実装**:
  - ルーターでクエリを受け取りサービス層に委譲。
  - サービス層はOpenWeatherMapへ`params={"q": city, "lang": lang}`でリクエスト。
  - 都市制限は撤廃するが、Step3までの`/weather/{city}`は後方互換のため残す。
  - 入力バリデーション: `pydantic`で空文字禁止、`lang`はISO 639-1 2文字程度を正規表現チェック。
- **エラー**:
  - OpenWeatherMapの404（city not found）は`CityNotFoundError`に変換。
- **テスト**:
  - クエリパラメータ欠如時に422。
  - 言語指定で説明文が変更されること（モックで確認）。

#### Step 5: エラーハンドリング統一
- **共通エラーレスポンスモデル** (`ErrorResponse`):
  - `error: str`（エラー種別コード）
  - `message: str`（人間向け簡潔説明）
  - `detail: dict | list | None`（追加情報）
- **実装**:
  - `app/errors.py`に独自例外（`CityNotFoundError`, `ExternalAPIError`, `ValidationError`など）とハンドラを定義。
  - FastAPIの`app.add_exception_handler`で登録。
  - Step2/3で利用した400エラーは`UnknownCityError`に置換し、ハンドラから`400`＋統一レスポンスを返す。
  - OpenWeatherMapの非200レスポンスを捕捉し、`ExternalAPIError`へ変換。`detail`に元ステータスとレスポンス本文一部を含める。
- **ログ**:
  - エラー時に`logger.warning`または`logger.error`で都市名・パラメータを記録。
- **テスト**:
  - 各例外ハンドラのレスポンス形状とステータス確認。

### Phase 3: 実践編
#### Step 6: 5日間の天気予報
- **エンドポイント候補**: `GET /forecast/{city}`（Step3の制限付き）＋ `GET /forecast`（任意都市）
- **OpenWeatherMap API**: `/data/2.5/forecast`
- **レスポンスモデル** (`ForecastResponse`):
  - `city: str`
  - `timezone: int`
  - `items: list[ForecastItem]`
- **`ForecastItem`フィールド**:
  - `timestamp: datetime`（ISO8601）
  - `temperature: float`
  - `weather_description: str`
  - `humidity: int`
- **パラメータ**:
  - `cnt`オプション: クエリ`?cnt=16`など、`1 <= cnt <= 40`で検証。
- **実装詳細**:
  - サービス層に`fetch_forecast`追加。`cnt`指定時はOpenWeatherMapへ同パラメータを転送。
  - タイムゾーン補正: 必要に応じて`city.timezone`を`detail`に含む。
- **テスト**:
  - `cnt`バリデーション、3時間刻みのtimestamp確認（`datetime.fromisoformat`で差分チェック）。

#### Step 7: 複数都市の天気比較
- **エンドポイント**: `POST /weather/compare`
- **リクエストボディ** (`ComparisonRequest`):
  - `cities: list[str]`（1〜10件）
  - `lang: str = "ja"`
- **レスポンスモデル** (`ComparisonResponse`):
  - `cities: list[WeatherResponse]`
  - `errors: list[ErrorResponse]`
- **実装**:
  - サービス層で非同期並列（`asyncio.gather` with `return_exceptions=True`）を使用し高速化。
  - 都市個別の失敗は`errors`へ格納し、成功分のみ`cities`に残す。
  - リトライは本要件では省略するが、将来的な拡張ポイントとしてコメント。
- **テスト**:
  - 成功/失敗混在ケースで`cities`・`errors`が期待どおりであること。
  - 同一都市重複時の扱い（重複許可だが結果はそれぞれ返す）。

## 5. テスト戦略
- `pytest`で各ルーターのFastAPI TestClientテストを作成。
- HTTP呼び出しは`httpx.MockTransport`でスタブ化し、OpenWeatherMap依存を排除。
- エラーパスも必ずテストに含め、`ErrorResponse`のフォーマットを検証。
- Step6以降で時間依存の値は固定値（例: `2025-01-01T00:00:00Z`）をモック。

## 6. 運用・リリース想定
- `.env`はローカルのみで管理し、Gitにはコミットしない。
- Uvicorn起動コマンド: `uvicorn app.main:app --reload`。
- 将来的にDocker化を検討する場合は`app/services/openweather.py`のベースURLやタイムアウトを環境変数化済みとする。
