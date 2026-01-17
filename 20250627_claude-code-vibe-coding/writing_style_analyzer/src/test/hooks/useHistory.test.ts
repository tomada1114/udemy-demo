/**
 * useHistory フックのテスト
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useHistory } from '@/hooks/useHistory'
import { AnalysisResult } from '@/types/app'

describe('useHistory', () => {
  const STORAGE_KEY = 'writing-style-analyzer-history'

  const createMockAnalysisResult = (id: string, text: string): AnalysisResult => ({
    id,
    text,
    result: `# 分析結果\n${text}の分析結果です`,
    timestamp: Date.now(),
    characterCount: text.length
  })

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('初期状態では履歴が空', () => {
    const { result } = renderHook(() => useHistory())
    
    expect(result.current.history).toEqual([])
    expect(result.current.isHistoryFull).toBe(false)
  })

  it('履歴に追加できる', () => {
    const { result } = renderHook(() => useHistory())
    const analysisResult = createMockAnalysisResult('1', 'テストテキスト')
    
    act(() => {
      result.current.addToHistory(analysisResult)
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.id).toBe('1')
    expect(result.current.history[0]?.preview).toBe('テストテキスト')
  })

  it('長いテキストはプレビューが省略される', () => {
    const { result } = renderHook(() => useHistory())
    const longText = 'a'.repeat(100)
    const analysisResult = createMockAnalysisResult('1', longText)
    
    act(() => {
      result.current.addToHistory(analysisResult)
    })
    
    expect(result.current.history[0]?.preview).toBe('a'.repeat(50) + '...')
  })

  it('最大5件まで履歴を保持', () => {
    const { result } = renderHook(() => useHistory())
    
    // 6件追加
    for (let i = 1; i <= 6; i++) {
      const analysisResult = createMockAnalysisResult(`${i}`, `テスト${i}`)
      act(() => {
        result.current.addToHistory(analysisResult)
      })
    }
    
    expect(result.current.history).toHaveLength(5)
    expect(result.current.isHistoryFull).toBe(true)
    // 最新のものが先頭にくる
    expect(result.current.history[0]?.id).toBe('6')
    expect(result.current.history[4]?.id).toBe('2')
  })

  it('同じIDの項目は重複しない', () => {
    const { result } = renderHook(() => useHistory())
    const analysisResult1 = createMockAnalysisResult('1', 'テスト1')
    const analysisResult2 = createMockAnalysisResult('1', 'テスト1更新')
    
    act(() => {
      result.current.addToHistory(analysisResult1)
      result.current.addToHistory(analysisResult2)
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.text).toBe('テスト1更新')
  })

  it('履歴から削除できる', () => {
    const { result } = renderHook(() => useHistory())
    const analysisResult1 = createMockAnalysisResult('1', 'テスト1')
    const analysisResult2 = createMockAnalysisResult('2', 'テスト2')
    
    act(() => {
      result.current.addToHistory(analysisResult1)
      result.current.addToHistory(analysisResult2)
    })
    
    expect(result.current.history).toHaveLength(2)
    
    act(() => {
      result.current.removeFromHistory('1')
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.id).toBe('2')
  })

  it('履歴をクリアできる', () => {
    const { result } = renderHook(() => useHistory())
    const analysisResult = createMockAnalysisResult('1', 'テスト')
    
    act(() => {
      result.current.addToHistory(analysisResult)
    })
    
    expect(result.current.history).toHaveLength(1)
    
    act(() => {
      result.current.clearHistory()
    })
    
    expect(result.current.history).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('特定の履歴項目を取得できる', () => {
    const { result } = renderHook(() => useHistory())
    const analysisResult = createMockAnalysisResult('1', 'テスト')
    
    act(() => {
      result.current.addToHistory(analysisResult)
    })
    
    const item = result.current.getHistoryItem('1')
    expect(item).not.toBeNull()
    expect(item?.text).toBe('テスト')
    
    const nonExistentItem = result.current.getHistoryItem('999')
    expect(nonExistentItem).toBeNull()
  })

  it('localStorage から履歴を読み込む', async () => {
    const mockHistory = [
      {
        id: '1',
        text: 'テスト',
        result: '結果',
        timestamp: Date.now(),
        characterCount: 3,
        preview: 'テスト'
      }
    ]
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHistory))
    
    const { result } = renderHook(() => useHistory())
    
    // useEffect の実行を待つ
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.text).toBe('テスト')
  })

  it('無効なlocalStorageデータの場合は空の履歴で初期化', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json')
    
    const { result } = renderHook(() => useHistory())
    
    expect(result.current.history).toEqual([])
  })

  it('履歴はタイムスタンプの降順でソートされる', () => {
    const { result } = renderHook(() => useHistory())
    
    const older = createMockAnalysisResult('1', '古い')
    older.timestamp = Date.now() - 1000
    
    const newer = createMockAnalysisResult('2', '新しい')
    newer.timestamp = Date.now()
    
    act(() => {
      result.current.addToHistory(older)
      result.current.addToHistory(newer)
    })
    
    expect(result.current.history[0]?.text).toBe('新しい')
    expect(result.current.history[1]?.text).toBe('古い')
  })
})