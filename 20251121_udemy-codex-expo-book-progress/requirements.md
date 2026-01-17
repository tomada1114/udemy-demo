# BookProgress - 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名
BookProgress

### 1.2 目的
読書の進捗を視覚的に管理できるシンプルな読書記録アプリを開発する。

### 1.3 ターゲットユーザー
- 複数の本を並行して読んでいる方
- 読書の進捗を視覚的に管理したい方
- 読書のモチベーションを保ちたい方

### 1.4 技術スタック
- React Native (Expo)
- TypeScript
- expo-sqlite (データベース)
- @react-native-async-storage/async-storage（設定保存用）

---

## 2. 機能要件

### 2.1 書籍管理機能

#### 2.1.1 書籍登録
- タイトル（必須、100文字以内）
- 最大ページ数（必須、1以上の整数）
- カテゴリ選択（必須）
- 登録日時（自動記録）

#### 2.1.2 書籍一覧表示
- 書籍をカード形式で一覧表示
- 各カードに以下を表示：
  - タイトル
  - カテゴリ名（色付きバッジ）
  - プログレスバー（0-100%）
  - 現在ページ数 / 最大ページ数
  - 進捗パーセンテージ

#### 2.1.3 書籍詳細表示
- 書籍の全情報を表示
- プログレスバー
- 残りページ数
- 登録日時
- 最終更新日時

#### 2.1.4 書籍編集
- タイトルの変更
- 最大ページ数の変更
- カテゴリの変更

#### 2.1.5 書籍削除
- 確認ダイアログ表示後に削除
- データベースから完全削除

### 2.2 読書進捗管理機能

#### 2.2.1 ページ数更新
- 現在ページ数を入力（0〜最大ページ数の範囲）
- 更新日時を自動記録
- プログレスバーを自動計算・更新

#### 2.2.2 進捗の視覚化
- プログレスバー表示（0-100%）
- パーセンテージ表示（小数点第1位まで）
- 残りページ数の表示

### 2.3 カテゴリ管理機能

#### 2.3.1 デフォルトカテゴリ
- 技術書
- 小説
- 新書
- ビジネス書
- その他

#### 2.3.2 カテゴリ表示
- 各カテゴリに固有の色を設定
- カテゴリ名と色をバッジ形式で表示

### 2.4 フィルタ・検索機能

#### 2.4.1 ステータス別フィルタ
- 全て
- 読書中（0% < 進捗 < 100%）
- 読了済み（進捗 = 100%）
- 未読（進捗 = 0%）

#### 2.4.2 カテゴリ別フィルタ
- 特定カテゴリの書籍のみ表示

#### 2.4.3 タイトル検索
- タイトルの部分一致検索

### 2.5 統計機能

#### 2.5.1 全体統計
- 登録書籍数
- 読書中の書籍数
- 読了済み書籍数
- 総読了ページ数

#### 2.5.2 カテゴリ別統計
- カテゴリごとの書籍数
- カテゴリごとの読了冊数

---

## 3. データ構造

### 3.1 型定義

```typescript
// 書籍の型定義
interface Book {
  id: string;              // UUID
  title: string;           // タイトル（最大100文字）
  maxPages: number;        // 最大ページ数（1以上）
  currentPages: number;    // 現在ページ数（0〜maxPages）
  categoryId: number;      // カテゴリID
  createdAt: string;       // 登録日時（ISO 8601形式）
  updatedAt: string;       // 更新日時（ISO 8601形式）
}

// カテゴリの型定義
interface Category {
  id: number;              // カテゴリID
  name: string;            // カテゴリ名
  color: string;           // 表示色（Hex形式）
}

// 統計データの型定義
interface Statistics {
  totalBooks: number;      // 総書籍数
  readingBooks: number;    // 読書中の書籍数
  completedBooks: number;  // 読了済み書籍数
  totalCompletedPages: number; // 総読了ページ数
}

// カテゴリ別統計の型定義
interface CategoryStatistics {
  categoryId: number;
  categoryName: string;
  totalBooks: number;
  completedBooks: number;
}
```

### 3.2 デフォルトカテゴリデータ

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: '技術書', color: '#3B82F6' },
  { id: 2, name: '小説', color: '#EC4899' },
  { id: 3, name: '新書', color: '#10B981' },
  { id: 4, name: 'ビジネス書', color: '#F59E0B' },
  { id: 5, name: 'その他', color: '#6B7280' },
];
```

---

## 4. 画面構成

### 4.1 ホーム画面
- 書籍一覧（FlatList）
- フローティングアクションボタン（書籍追加）
- タブバー（フィルタ切り替え）
- 検索バー

### 4.2 書籍追加・編集画面（Modal）
- タイトル入力フィールド
- 最大ページ数入力フィールド
- カテゴリ選択ピッカー
- 保存ボタン
- キャンセルボタン

### 4.3 書籍詳細画面
- 書籍情報表示エリア
- プログレスバー
- 現在ページ数更新フォーム
- 編集ボタン
- 削除ボタン

### 4.4 統計画面
- 全体統計カード
- カテゴリ別統計リスト

---

## 5. データベーススキーマ

### 5.1 booksテーブル

```sql
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  max_pages INTEGER NOT NULL CHECK(max_pages > 0),
  current_pages INTEGER NOT NULL DEFAULT 0 CHECK(current_pages >= 0),
  category_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 5.2 categoriesテーブル

```sql
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);
```

---

## 6. バリデーションルール

### 6.1 書籍登録・編集時
- タイトル：必須、1〜100文字
- 最大ページ数：必須、1以上の整数
- カテゴリ：必須

### 6.2 ページ数更新時
- 現在ページ数：必須、0〜最大ページ数の整数

---

## 7. エラーハンドリング

### 7.1 入力エラー
- バリデーションエラー時はエラーメッセージを表示
- 不正な値の場合は保存不可

### 7.2 データベースエラー
- データベース操作失敗時はエラーメッセージを表示
- エラー発生時は前の画面に戻る

---

## 8. 非機能要件

### 8.1 パフォーマンス
- 書籍一覧の表示は1秒以内
- データベース操作は500ms以内

### 8.2 ユーザビリティ
- 直感的な操作で誰でも使える
- エラーメッセージは分かりやすい日本語で表示

### 8.3 データ永続化
- expo-sqliteでローカルに保存
- アプリ終了後もデータは保持される

---

## 9. 開発の制約事項

### 9.1 Expo制約
- Expo Goで動作すること
- カスタムビルド不要

### 9.2 動作環境
- iOSシミュレータで完結できること
- 実機でも動作すること

### 9.3 外部依存
- ネットワーク接続不要
- 外部API不要
