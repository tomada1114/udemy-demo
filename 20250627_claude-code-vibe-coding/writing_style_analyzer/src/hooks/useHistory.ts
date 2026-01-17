/**
 * 分析履歴管理用カスタムフック
 */

import { useState, useEffect, useCallback } from 'react'
import { HistoryItem, AnalysisResult } from '@/types/app'

const STORAGE_KEY = 'writing-style-analyzer-history'
const MAX_HISTORY_ITEMS = 5

export interface UseHistoryReturn {
  history: HistoryItem[]
  addToHistory: (result: AnalysisResult) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  getHistoryItem: (id: string) => HistoryItem | null
  isHistoryFull: boolean
}

/**
 * 分析履歴を localStorage で管理するフック
 */
export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // 初期化時に localStorage から履歴を読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedHistory = JSON.parse(saved) as HistoryItem[]
        // 日付順（新しい順）でソート
        const sortedHistory = parsedHistory.sort((a, b) => b.timestamp - a.timestamp)
        setHistory(sortedHistory.slice(0, MAX_HISTORY_ITEMS))
      }
    } catch (error) {
      console.warn('Failed to load history from localStorage:', error)
      setHistory([])
    }
  }, [])

  // 履歴を localStorage に保存
  const saveToStorage = useCallback((newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.warn('Failed to save history to localStorage:', error)
    }
  }, [])

  // 履歴に追加
  const addToHistory = useCallback((result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: result.id,
      text: result.text,
      result: result.result,
      timestamp: result.timestamp,
      characterCount: result.characterCount,
      preview: result.text.slice(0, 50) + (result.text.length > 50 ? '...' : '')
    }

    setHistory(prevHistory => {
      // 同じIDの既存アイテムを除去（重複防止）
      const filteredHistory = prevHistory.filter(item => item.id !== newItem.id)
      
      // 新しいアイテムを先頭に追加
      const newHistory = [newItem, ...filteredHistory]
      
      // 最大件数制限
      const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)
      
      // localStorage に保存
      saveToStorage(limitedHistory)
      
      return limitedHistory
    })
  }, [saveToStorage])

  // 履歴から削除
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id)
      saveToStorage(newHistory)
      return newHistory
    })
  }, [saveToStorage])

  // 履歴をクリア
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear history from localStorage:', error)
    }
  }, [])

  // 特定の履歴アイテムを取得
  const getHistoryItem = useCallback((id: string): HistoryItem | null => {
    return history.find(item => item.id === id) ?? null
  }, [history])

  // 履歴が満杯かどうか
  const isHistoryFull = history.length >= MAX_HISTORY_ITEMS

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
    isHistoryFull
  }
}