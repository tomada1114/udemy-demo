# FastAPI Weather API ガイド

このリポジトリは FastAPI で構築した天気情報 API の学習用プロジェクトです。OpenWeatherMap をバックエンドに利用し、フェーズごとに機能と品質を高めるワークフローに沿って進化させています。

## プロジェクト構成
- `app/main.py` — FastAPI アプリのエントリーポイント。天気ルーター登録と例外ハンドラ初期化を実施。
- `app/routers/weather.py` — `/weather` 系エンドポイントを定義。依存関係でパラメータ検証を行い、任意都市検索をサポート。
- `app/services/openweather.py` — OpenWeatherMap への HTTP クライアント。都市コードマッピングと例外変換を担当。
- `app/errors.py` — 共通例外 (`AppError` 系) と JSON 形式のハンドラ。エラーコード/詳細をログへ出力。
- `app/schemas/weather.py` — 天気レスポンスモデル。
- `app/schemas/error.py` — エラーレスポンスモデル。
- `app/config.py` — `.env` から API キーやタイムアウトを読み込む設定クラス。
- `tests/` — pytest ベースのテスト群。`tests/test_weather.py` が成功・エラー・ログ検証までカバー。
- `task.md`, `design.md`, `requirements.md` — タスク管理、設計指針、要件定義のドキュメント。

## 現在の主要機能
- `GET /weather/{city}` — 5 都市（tokyo, osaka, sapporo, nagoya, fukuoka）の現在天気を返却。
- `GET /weather` — 任意都市と言語コード (`lang`、ISO 639-1 2 文字) を受け取り、OpenWeatherMap からデータ取得。
- 共通エラーハンドリング — `unknown_city` (400)、`city_not_found` (404)、`external_api_error` (502) などを統一フォーマットで返す。
- OpenWeatherMap 連携 — `httpx` クライアントで外部 API を呼び出し、`WeatherResponse` にマッピング。

### エラーレスポンス例
```json
{
  "error": "city_not_found",
  "message": "指定された都市は見つかりませんでした。",
  "detail": {
    "city": "Atlantis",
    "lang": "ja",
    "status_code": 404,
    "response": {"cod": "404", "message": "city not found"}
  }
}
```

## 開発とテスト
- 仮想環境: `python3 -m venv myvenv && source myvenv/bin/activate`
- 依存関係: `pip install -r requirements.txt`
- 開発サーバー: `uvicorn app.main:app --reload`
- テスト: `pytest`（外部 API は `httpx.MockTransport` でモック）

## 品質と運用のポイント
- 実装は `design.md` の各 Phase/Step に沿って進め、進捗は `task.md` で管理。
- 例外は抑え込まず `AppError` 系へ変換し、`ErrorResponse` を返す。
- テストではバリデーション、多言語、エラー時のログ (`caplog`) まで確認。
- API キー等の機密情報は `.env` 管理とし、リポジトリへコミットしない。

本ドキュメントは Phase 2 Step 5 まで実装済みの最新状態を反映しています。今後の拡張（予報機能など）は `design.md` の次フェーズを参照してください。

