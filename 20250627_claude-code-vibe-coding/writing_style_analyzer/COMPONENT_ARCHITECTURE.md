# Component Architecture Design

## 概要
Writing Style Analyzerのコンポーネント設計書。Apple風デザインシステムに基づいた階層構造とモジュール設計を採用。

## コンポーネント階層構造

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # メインレイアウト（背景含む）
│   │   ├── Header.tsx            # Glassmorphismヘッダー
│   │   └── BackgroundLayers.tsx  # 3層背景システム
│   │
│   ├── features/
│   │   ├── TextInput/
│   │   │   ├── TextInputArea.tsx      # メインテキスト入力
│   │   │   ├── CharacterCounter.tsx   # 文字数カウンター
│   │   │   └── TextInputCard.tsx      # 入力カード
│   │   │
│   │   ├── Analysis/
│   │   │   ├── AnalysisResult.tsx     # 結果表示
│   │   │   ├── AnalysisCard.tsx       # 結果カード
│   │   │   ├── CopyButton.tsx         # コピー機能
│   │   │   └── MarkdownRenderer.tsx   # Markdown表示
│   │   │
│   │   ├── History/
│   │   │   ├── HistoryPanel.tsx       # 履歴パネル
│   │   │   ├── HistoryItem.tsx        # 履歴アイテム
│   │   │   └── HistoryList.tsx        # 履歴リスト
│   │   │
│   │   └── ThemePicker/
│   │       ├── ThemeColorPicker.tsx   # 8色テーマ選択
│   │       ├── ColorOption.tsx        # 色選択オプション
│   │       └── ThemePreview.tsx       # テーマプレビュー
│   │
│   ├── common/
│   │   ├── Button.tsx            # 拡張ボタンコンポーネント
│   │   ├── Card.tsx             # Glassmorphismカード
│   │   ├── LoadingSpinner.tsx   # ローディングアニメーション
│   │   ├── Badge.tsx            # バッジコンポーネント
│   │   ├── Separator.tsx        # 区切り線
│   │   └── ErrorBoundary.tsx    # エラーハンドリング
│   │
│   └── ui/                      # shadcn/ui コンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
├── hooks/
│   ├── useAnalysis.ts           # 分析処理フック
│   ├── useHistory.ts            # 履歴管理フック
│   ├── useThemeColor.ts         # テーマカラーフック
│   ├── useLocalStorage.ts       # localStorage抽象化
│   └── useClipboard.ts          # クリップボード操作
│
├── lib/
│   ├── gemini-api.ts            # Gemini AI API クライアント
│   ├── analysis-prompts.ts      # AI プロンプト定義
│   ├── storage.ts               # ストレージ管理
│   └── markdown-utils.ts        # Markdown ユーティリティ
│
└── store/                       # 状態管理（必要に応じて）
    ├── analysis-store.ts
    └── app-store.ts
```

## 主要コンポーネント設計

### 1. レイアウトコンポーネント

#### AppLayout
- **役割**: アプリケーション全体のレイアウト管理
- **機能**: 
  - 3層背景システムの実装
  - レスポンシブレイアウト
  - テーマカラー適用
- **状態**: テーマカラー、レスポンシブ設定

#### Header
- **役割**: Glassmorphismヘッダーの実装
- **機能**:
  - ブランディング表示
  - テーマカラーピッカーアクセス
  - 固定ポジション
- **デザイン**: `bg-white/70 backdrop-blur-xl`

### 2. 機能コンポーネント

#### TextInputArea
- **役割**: メインテキスト入力インターフェース
- **機能**:
  - 2000文字制限
  - リアルタイム文字数カウント
  - 入力検証
  - 自動保存（オプション）
- **状態**: テキスト、文字数、検証エラー

#### AnalysisResult
- **役割**: AI分析結果の表示
- **機能**:
  - Markdown形式での結果表示
  - ワンクリックコピー機能
  - 結果のプレビュー
- **状態**: 分析結果、コピー状態

#### HistoryPanel
- **役割**: 分析履歴の管理と表示
- **機能**:
  - 最大5件の履歴保存
  - 履歴アイテムの選択・削除
  - ローカルストレージ連携
- **状態**: 履歴リスト、選択状態

### 3. 共通コンポーネント

#### Card (拡張版)
- **役割**: Glassmorphismカードの実装
- **機能**:
  - 動的シャドウ
  - ホバーアニメーション
  - テーマカラー適用
- **Props**: `color`, `interactive`, `active`

#### LoadingSpinner
- **役割**: 分析中のローディング表示
- **機能**:
  - 60fpsアニメーション
  - プログレス表示
  - キャンセル機能
- **デザイン**: Apple風スピナーアニメーション

## 状態管理設計

### Custom Hooks アプローチ

#### useAnalysis
```typescript
interface UseAnalysisReturn {
  analyze: (text: string) => Promise<void>
  result: AnalysisResult | null
  status: AnalysisStatus
  error: AnalysisError | null
  cancel: () => void
}
```

#### useHistory
```typescript
interface UseHistoryReturn {
  history: HistoryItem[]
  addToHistory: (item: AnalysisResult) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  getHistoryItem: (id: string) => HistoryItem | null
}
```

## データフロー

```
1. ユーザーテキスト入力
   ↓
2. TextInputArea (バリデーション)
   ↓
3. useAnalysis (API呼び出し)
   ↓
4. Gemini API (分析処理)
   ↓
5. AnalysisResult (結果表示)
   ↓
6. useHistory (履歴保存)
   ↓
7. HistoryPanel (履歴表示)
```

## パフォーマンス考慮事項

### 最適化手法
- **React.memo**: 不要な再レンダリング防止
- **useMemo**: 重い計算のメモ化
- **useCallback**: 関数の再生成防止
- **lazy loading**: コンポーネントの遅延読み込み

### メモリ管理
- **履歴制限**: 最大5件での自動削除
- **API キャンセル**: 不要なリクエストの中断
- **イベントクリーンアップ**: useEffect でのリスナー削除

## アクセシビリティ

### 対応項目
- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **スクリーンリーダー**: 適切なARIA属性
- **コントラスト比**: WCAG 2.1 AA準拠
- **フォーカス管理**: 明確なフォーカスインジケーター

## テスト戦略

### 単体テスト
- **コンポーネント**: 各コンポーネントの動作確認
- **フック**: カスタムフックのロジック確認
- **ユーティリティ**: 純粋関数のテスト

### 統合テスト
- **ユーザーフロー**: 入力から結果表示まで
- **API連携**: Gemini API との連携確認
- **ストレージ**: localStorage の動作確認

### E2Eテスト
- **主要シナリオ**: 分析の完全なフロー
- **エラーハンドリング**: エラー状態の確認
- **レスポンシブ**: 各デバイスでの動作確認