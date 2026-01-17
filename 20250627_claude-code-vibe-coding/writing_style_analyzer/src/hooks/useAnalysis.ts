/**
 * 文体分析処理用カスタムフック
 */

import { useState, useCallback, useRef } from 'react'
import { AnalysisResult, AnalysisStatus, AnalysisError, AnalysisRequest } from '@/types/app'

export interface UseAnalysisReturn {
  analyze: (text: string) => Promise<void>
  result: AnalysisResult | null
  status: AnalysisStatus
  error: AnalysisError | null
  cancel: () => void
  reset: () => void
  progress: number
}

/**
 * Gemini AI を使用した文体分析フック
 */
export const useAnalysis = (): UseAnalysisReturn => {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [error, setError] = useState<AnalysisError | null>(null)
  const [progress, setProgress] = useState(0)
  
  // キャンセル用のAbortController
  const abortControllerRef = useRef<AbortController | null>(null)

  // 分析実行
  const analyze = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError({
        message: 'テキストを入力してください',
        timestamp: Date.now()
      })
      return
    }

    if (text.length > 2000) {
      setError({
        message: '文字数が制限を超えています（最大2000文字）',
        timestamp: Date.now()
      })
      return
    }

    // 既存のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController()

    try {
      setStatus('analyzing')
      setError(null)
      setProgress(0)

      const request: AnalysisRequest = {
        text,
        characterCount: text.length
      }

      // プログレス更新のシミュレーション
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // API呼び出し（実装は後で行う）
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `API Error: ${response.status}`
        
        // ステータスコードに応じたエラーメッセージ
        switch (response.status) {
          case 400:
            throw new Error(errorMessage || '入力内容に問題があります')
          case 401:
            throw new Error('APIキーが無効です')
          case 403:
            throw new Error('このサービスにアクセスする権限がありません')
          case 429:
            throw new Error('リクエストが多すぎます。しばらく時間をおいて再試行してください')
          case 500:
            throw new Error('サーバーエラーが発生しました。しばらく時間をおいて再試行してください')
          default:
            throw new Error(errorMessage || '不明なエラーが発生しました')
        }
      }

      const analysisResult = await response.json()

      const newResult: AnalysisResult = {
        id: crypto.randomUUID(),
        text,
        result: analysisResult.analysis,
        timestamp: Date.now(),
        characterCount: text.length
      }

      setResult(newResult)
      setStatus('completed')
      
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setStatus('idle')
        } else {
          // ネットワークエラーの場合
          if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
            setError({
              message: 'ネットワークエラーが発生しました。インターネット接続を確認してください',
              timestamp: Date.now()
            })
          } else {
            setError({
              message: err.message || '分析中にエラーが発生しました',
              timestamp: Date.now()
            })
          }
          setStatus('error')
        }
      } else {
        // 予期しないエラー
        setError({
          message: '予期しないエラーが発生しました',
          timestamp: Date.now()
        })
        setStatus('error')
      }
    } finally {
      setProgress(0)
      abortControllerRef.current = null
    }
  }, [])

  // 分析キャンセル
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setStatus('idle')
      setProgress(0)
    }
  }, [])

  // リセット（新しい分析のため）
  const reset = useCallback(() => {
    setResult(null)
    setStatus('idle')
    setError(null)
    setProgress(0)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  return {
    analyze,
    result,
    status,
    error,
    cancel,
    reset,
    progress
  }
}