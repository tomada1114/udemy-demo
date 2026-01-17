/**
 * useClipboard フックのテスト
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useClipboard } from '@/hooks/useClipboard'

// クリップボードAPIのモック
const mockWriteText = vi.fn()
const mockClipboard = {
  writeText: mockWriteText
}

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // navigatorのモック
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態が正しい', () => {
    const { result } = renderHook(() => useClipboard())
    
    expect(result.current.copied).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.isSupported).toBe(true)
  })

  it('テキストを正常にコピーできる', async () => {
    mockWriteText.mockResolvedValue(undefined)
    const { result } = renderHook(() => useClipboard(100)) // 短いリセット時間
    
    let copyResult: boolean = false
    await act(async () => {
      copyResult = await result.current.copy('テストテキスト')
    })
    
    expect(copyResult).toBe(true)
    expect(result.current.copied).toBe(true)
    expect(result.current.error).toBeNull()
    expect(mockWriteText).toHaveBeenCalledWith('テストテキスト')
  })

  it('コピー状態が指定時間後にリセットされる', async () => {
    mockWriteText.mockResolvedValue(undefined)
    const { result } = renderHook(() => useClipboard(50)) // 50ms後にリセット
    
    await act(async () => {
      await result.current.copy('テスト')
    })
    
    expect(result.current.copied).toBe(true)
    
    // 60ms 待機
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 60))
    })
    
    expect(result.current.copied).toBe(false)
  })

  it('クリップボードAPIエラーを処理する', async () => {
    mockWriteText.mockRejectedValue(new Error('クリップボードアクセス拒否'))
    const { result } = renderHook(() => useClipboard())
    
    let copyResult: boolean = false
    await act(async () => {
      copyResult = await result.current.copy('テスト')
    })
    
    expect(copyResult).toBe(false)
    expect(result.current.copied).toBe(false)
    expect(result.current.error).toBe('クリップボードアクセス拒否')
  })

  it('クリップボードAPIが未対応の場合', () => {
    // クリップボードAPIを未対応にする
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true
    })
    
    const { result } = renderHook(() => useClipboard())
    
    expect(result.current.isSupported).toBe(false)
  })

  it('未対応ブラウザでコピーを試行した場合', async () => {
    // クリップボードAPIを未対応にする
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true
    })
    
    const { result } = renderHook(() => useClipboard())
    
    let copyResult: boolean = false
    await act(async () => {
      copyResult = await result.current.copy('テスト')
    })
    
    expect(copyResult).toBe(false)
    expect(result.current.error).toBe('お使いのブラウザはクリップボード機能に対応していません')
  })

  it('writeTextメソッドが存在しない場合', () => {
    // writeTextメソッドのないクリップボードオブジェクト
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      writable: true
    })
    
    const { result } = renderHook(() => useClipboard())
    
    expect(result.current.isSupported).toBe(false)
  })

  it('navigator自体が存在しない場合（SSR環境）', () => {
    // navigatorを一時的に削除
    const originalNavigator = global.navigator
    
    // @ts-expect-error テスト用にundefinedを代入
    delete global.navigator
    
    const { result } = renderHook(() => useClipboard())
    
    expect(result.current.isSupported).toBe(false)
    
    // 復元
    global.navigator = originalNavigator
  })

  it('未知のエラーオブジェクトを処理する', async () => {
    mockWriteText.mockRejectedValue('文字列エラー')
    const { result } = renderHook(() => useClipboard())
    
    let copyResult: boolean = false
    await act(async () => {
      copyResult = await result.current.copy('テスト')
    })
    
    expect(copyResult).toBe(false)
    expect(result.current.error).toBe('クリップボードへのコピーに失敗しました')
  })

  it('空文字列もコピーできる', async () => {
    mockWriteText.mockResolvedValue(undefined)
    const { result } = renderHook(() => useClipboard())
    
    let copyResult: boolean = false
    await act(async () => {
      copyResult = await result.current.copy('')
    })
    
    expect(copyResult).toBe(true)
    expect(mockWriteText).toHaveBeenCalledWith('')
  })
})