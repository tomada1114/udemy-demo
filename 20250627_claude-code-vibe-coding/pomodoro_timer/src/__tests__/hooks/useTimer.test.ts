import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../../hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useTimer())
    
    expect(result.current.minutes).toBe(25)
    expect(result.current.seconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isWorkSession).toBe(true)
  })

  it('タイマーを開始できる', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.start()
    })
    
    expect(result.current.isRunning).toBe(true)
  })

  it('タイマーを停止できる', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.start()
    })
    
    act(() => {
      result.current.pause()
    })
    
    expect(result.current.isRunning).toBe(false)
  })

  it('タイマーをリセットできる', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.start()
    })
    
    // 数秒経過
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.minutes).toBe(25)
    expect(result.current.seconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('時間設定を変更できる', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.setWorkTime(30, 30)
    })
    
    act(() => {
      result.current.setBreakTime(10, 15)
    })
    
    expect(result.current.workMinutes).toBe(30)
    expect(result.current.workSeconds).toBe(30)
    expect(result.current.breakMinutes).toBe(10)
    expect(result.current.breakSeconds).toBe(15)
  })

  it('カウントダウンが正しく動作する', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.start()
    })
    
    // 1秒経過
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(result.current.minutes).toBe(24)
    expect(result.current.seconds).toBe(59)
  })

  it('進捗率が正しく計算される', () => {
    const { result } = renderHook(() => useTimer())
    
    act(() => {
      result.current.start()
    })
    
    // 30秒経過
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    const expectedProgress = 30 / (25 * 60) // 30秒 / 1500秒（25分）
    expect(result.current.progress).toBeCloseTo(expectedProgress, 2)
  })
})