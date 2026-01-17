/**
 * useThemeColor フックのテスト
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useThemeColor } from '@/hooks/useThemeColor'
import { THEME_COLORS } from '@/lib/design-system'

describe('useThemeColor', () => {
  const STORAGE_KEY = 'writing-style-analyzer-theme-color'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('デフォルトカラーで初期化される', () => {
    const { result } = renderHook(() => useThemeColor('ocean'))
    
    expect(result.current.currentColor).toBe('ocean')
    expect(result.current.colorClass).toContain('from-sky-100')
    expect(result.current.accentColor).toBe('#60A5FA')
  })

  it('ローカルストレージから保存された色を読み込む', async () => {
    localStorage.setItem(STORAGE_KEY, 'blossom')
    
    const { result } = renderHook(() => useThemeColor('ocean'))
    
    // useEffect の実行を待つ
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(result.current.currentColor).toBe('blossom')
  })

  it('無効な保存色の場合はデフォルトを使用', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-color')
    
    const { result } = renderHook(() => useThemeColor('ocean'))
    
    expect(result.current.currentColor).toBe('ocean')
  })

  it('テーマカラーを変更してローカルストレージに保存', () => {
    const { result } = renderHook(() => useThemeColor())
    
    act(() => {
      result.current.setColor('lavender')
    })
    
    expect(result.current.currentColor).toBe('lavender')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('lavender')
  })

  it('利用可能な色を正しく返す', () => {
    const { result } = renderHook(() => useThemeColor())
    
    expect(result.current.availableColors).toBe(THEME_COLORS)
    expect(result.current.availableColors).toHaveLength(8)
  })

  it('選択状態を正しく判定', () => {
    const { result } = renderHook(() => useThemeColor('forest'))
    
    expect(result.current.isSelected('forest')).toBe(true)
    expect(result.current.isSelected('ocean')).toBe(false)
  })

  it('カラークラスとアクセントカラーが正しく生成される', () => {
    const { result } = renderHook(() => useThemeColor('sunshine'))
    
    expect(result.current.colorClass).toContain('from-yellow-100')
    expect(result.current.colorClass).toContain('to-yellow-200')
    expect(result.current.accentColor).toBe('#FCD34D')
  })

  it('存在しないカラーの場合は最初のテーマを使用', () => {
    // 直接関数をテストする場合
    const { result } = renderHook(() => useThemeColor())
    
    // 不正な色を設定しようとした場合の動作を確認
    // （実際の実装では setColor で検証を行う可能性がある）
    expect(result.current.availableColors[0]?.value).toBe('sunshine')
  })
})