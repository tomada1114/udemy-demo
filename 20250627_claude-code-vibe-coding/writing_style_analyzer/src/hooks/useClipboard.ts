/**
 * クリップボード操作用カスタムフック
 */

import { useState, useCallback } from 'react'

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  error: string | null
  isSupported: boolean
}

/**
 * クリップボードへのコピー機能を提供するフック
 */
export const useClipboard = (resetDelay: number = 2000): UseClipboardReturn => {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // クリップボードAPIの対応確認
  const isSupported = Boolean(
    typeof navigator !== 'undefined' && 
    navigator.clipboard && 
    navigator.clipboard.writeText
  )

  // テキストをクリップボードにコピー
  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!isSupported) {
      setError('お使いのブラウザはクリップボード機能に対応していません')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)

      // 指定時間後にコピー状態をリセット
      setTimeout(() => {
        setCopied(false)
      }, resetDelay)

      return true
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'クリップボードへのコピーに失敗しました'
      
      setError(errorMessage)
      setCopied(false)
      return false
    }
  }, [isSupported, resetDelay])

  return {
    copy,
    copied,
    error,
    isSupported
  }
}