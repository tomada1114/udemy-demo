# FastAPI 天気情報 API

開発者向けドキュメントです。`requirements.md`および `design.md` の要件・設計に基づき、段階的に天気情報 API を実装・運用するための手順と指針をまとめています。

## 概要
- OpenWeatherMap の REST API を利用し、都市ごとの現在の天気と予報データを提供する FastAPI アプリケーション。
- フェーズごとに機能を拡張し、品質基準（エラーハンドリング、テスト、保守性）を満たしながら開発を進めます。
- 詳細な仕様は `design.md` を参照してください。

## 必要条件
- Python 3.11 以上
- OpenWeatherMap API キー（Free プラン可）
- Unix 系シェル環境（macOS / Linux）

## セットアップ手順
1. 仮想環境の作成と有効化
   ```bash
   python3 -m venv myvenv
   source myvenv/bin/activate
   ```
2. 依存関係のインストール
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. 環境変数の設定（`.env`）
   ```bash
   cp .env.example .env  # ファイルが無い場合は作成
   echo "OPENWEATHERMAP_API_KEY=your_api_key_here" >> .env
   ```
4. 設定ファイルの読込確認
   - `design.md` §3 を参考に `app/config.py` で `Settings` モデルを実装し、起動時にキー未設定でエラーになることを確認します。

## アプリの起動方法
```bash
uvicorn app.main:app --reload
```
- ブラウザで `http://127.0.0.1:8000/docs` にアクセスし、Swagger UI からエンドポイントを確認できます。
- Step 1 完了時は `http://127.0.0.1:8000/weather/tokyo` で動作確認します。

## テスト
- `pytest` を利用します。
- 外部 API 呼び出しは `httpx.MockTransport` を用いてモック化してください（`design.md` §5 参照）。
```bash
pytest
```
- 新しいエンドポイントやエラーケースを追加した際は、必ずテストを更新・追加してください。

## ディレクトリ構成（予定）
```
app/
  main.py
  config.py
  routers/
  services/
  schemas/
  errors.py

requirements.md
design.md
task.md
README.md
```
- 実際の構造は実装進捗に合わせて更新します。変更時は README と `design.md` を同期させてください。

## 開発フロー
1. `task.md` のチェックリストに従って Step ごとに実装を進める。
2. 仕様が不明な場合は `requirements.md` と `design.md` を参照し、必要に応じて更新。
3. 変更内容に対するテストを追加・実行。
4. コードレビュー前にローカルで `uvicorn` による動作確認と `pytest` を完了させる。
5. コミット時はコンベンショナルコミットメッセージ（例: `feat: add tokyo weather endpoint`）を使用。

## トラブルシューティング
- **API キー未設定**: 起動時に例外が発生したら `.env` を確認し、`OPENWEATHERMAP_API_KEY` を設定してください。
- **レート制限**: 短時間に多数のリクエストが失敗する場合、一定時間待機するかモックテストで代替してください。
- **外部 API エラー**: Step 5 以降は共通エラーハンドラが適用されます。ログを参照して原因を特定し、必要なら `design.md` §7 の改善案を検討してください。

## 今後の拡張
- レスポンスキャッシュやレート制限対策、統計エンドポイントなどの案は `design.md` §7 に記載しています。新規実装時は別ブランチで PoC を行い、設計ドキュメントに追記してください。

## 参考ドキュメント
- [OpenWeatherMap API](https://openweathermap.org/api)
- FastAPI 公式ドキュメント: https://fastapi.tiangolo.com/

