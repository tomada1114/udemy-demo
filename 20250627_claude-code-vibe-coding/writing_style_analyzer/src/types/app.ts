/**
 * アプリケーション用型定義
 */

// 分析結果の型
export interface AnalysisResult {
  id: string
  text: string
  result: string // Markdown形式の分析結果
  timestamp: number
  characterCount: number
}

// 分析状態の型
export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error'

// 分析リクエストの型
export interface AnalysisRequest {
  text: string
  characterCount: number
}

// 履歴管理の型
export interface HistoryItem {
  id: string
  text: string
  result: string
  timestamp: number
  characterCount: number
  preview: string // 最初の50文字程度のプレビュー
}

// エラー情報の型
export interface AnalysisError {
  message: string
  code?: string
  timestamp: number
}

// アプリケーション設定の型
export interface AppSettings {
  themeColor: string
  maxHistoryItems: number
  characterLimit: number
  autoSave: boolean
}

// API レスポンスの型
export interface GeminiApiResponse {
  text: string
  finishReason?: string
  safetyRatings?: Array<{
    category: string
    probability: string
  }>
}

// コンポーネントプロパティの共通型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// ローディング状態の型
export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}