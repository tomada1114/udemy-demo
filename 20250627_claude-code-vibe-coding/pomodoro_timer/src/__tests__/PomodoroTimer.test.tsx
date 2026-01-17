import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PomodoroTimer } from '../components/PomodoroTimer'

// オーディオAPIをモック化
Object.defineProperty(window, 'Audio', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    currentTime: 0,
    volume: 1,
  })),
})

describe('PomodoroTimer', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('初期状態で25分の作業時間と5分の休憩時間が設定されている', () => {
    render(<PomodoroTimer />)
    
    // 設定ボタンをクリックして設定パネルを開く
    const settingsButton = screen.getByRole('button', { name: /タイマー設定/ })
    fireEvent.click(settingsButton)
    
    // 作業時間の設定値を確認
    expect(screen.getByDisplayValue('25')).toBeInTheDocument() // 作業分
    expect(screen.getByDisplayValue('0')).toBeInTheDocument() // 作業秒
    
    // 休憩時間の設定値を確認
    expect(screen.getByDisplayValue('5')).toBeInTheDocument() // 休憩分
  })

  it('作業時間と休憩時間を分と秒で設定できる', () => {
    render(<PomodoroTimer />)
    
    // 設定ボタンをクリックして設定パネルを開く
    const settingsButton = screen.getByRole('button', { name: /タイマー設定/ })
    fireEvent.click(settingsButton)
    
    const workMinsInput = screen.getByLabelText(/作業時間.*分/)
    const workSecsInput = screen.getByLabelText(/作業時間.*秒/)
    const breakMinsInput = screen.getByLabelText(/休憩時間.*分/)
    const breakSecsInput = screen.getByLabelText(/休憩時間.*秒/)

    // 作業時間を30分30秒に設定
    fireEvent.change(workMinsInput, { target: { value: '30' } })
    fireEvent.change(workSecsInput, { target: { value: '30' } })
    
    // 休憩時間を10分15秒に設定
    fireEvent.change(breakMinsInput, { target: { value: '10' } })
    fireEvent.change(breakSecsInput, { target: { value: '15' } })

    expect(workMinsInput).toHaveValue(30)
    expect(workSecsInput).toHaveValue(30)
    expect(breakMinsInput).toHaveValue(10)
    expect(breakSecsInput).toHaveValue(15)
  })

  it('開始ボタンを押すとタイマーが開始される', () => {
    render(<PomodoroTimer />)
    
    const startButton = screen.getByRole('button', { name: /開始/ })
    fireEvent.click(startButton)

    expect(screen.getByRole('button', { name: /停止/ })).toBeInTheDocument()
  })

  it('タイマーが動作して時間がカウントダウンされる', async () => {
    render(<PomodoroTimer />)
    
    // 初期表示は25:00
    expect(screen.getByText('25:00')).toBeInTheDocument()
    
    const startButton = screen.getByRole('button', { name: /開始/ })
    fireEvent.click(startButton)

    // 1秒経過
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByText('24:59')).toBeInTheDocument()
    })
  })

  it('リセットボタンでタイマーがリセットされる', () => {
    render(<PomodoroTimer />)
    
    const startButton = screen.getByRole('button', { name: /開始/ })
    const resetButton = screen.getByRole('button', { name: /リセット/ })
    
    // タイマー開始
    fireEvent.click(startButton)
    
    // 数秒経過
    vi.advanceTimersByTime(3000)
    
    // リセット
    fireEvent.click(resetButton)
    
    // 初期値に戻る
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument()
  })

  it('作業セッション終了時に音が鳴る', async () => {
    const mockPlay = vi.fn()
    window.Audio = vi.fn().mockImplementation(() => ({
      play: mockPlay,
    }))

    render(<PomodoroTimer />)
    
    // 作業時間を1秒に設定
    const workMinsInput = screen.getByLabelText(/作業時間.*分/)
    const workSecsInput = screen.getByLabelText(/作業時間.*秒/)
    
    fireEvent.change(workMinsInput, { target: { value: '0' } })
    fireEvent.change(workSecsInput, { target: { value: '1' } })
    
    const startButton = screen.getByRole('button', { name: /開始/ })
    fireEvent.click(startButton)

    // 1秒経過（作業セッション終了）
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled()
    })
  })

  it('休憩セッション終了時に音が鳴る', async () => {
    const mockPlay = vi.fn()
    window.Audio = vi.fn().mockImplementation(() => ({
      play: mockPlay,
    }))

    render(<PomodoroTimer />)
    
    // 作業時間と休憩時間を1秒に設定
    const workMinsInput = screen.getByLabelText(/作業時間.*分/)
    const workSecsInput = screen.getByLabelText(/作業時間.*秒/)
    const breakMinsInput = screen.getByLabelText(/休憩時間.*分/)
    const breakSecsInput = screen.getByLabelText(/休憩時間.*秒/)
    
    fireEvent.change(workMinsInput, { target: { value: '0' } })
    fireEvent.change(workSecsInput, { target: { value: '1' } })
    fireEvent.change(breakMinsInput, { target: { value: '0' } })
    fireEvent.change(breakSecsInput, { target: { value: '1' } })
    
    const startButton = screen.getByRole('button', { name: /開始/ })
    fireEvent.click(startButton)

    // 1秒経過（作業セッション終了、休憩セッション開始）
    vi.advanceTimersByTime(1000)
    
    // さらに1秒経過（休憩セッション終了）
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalledTimes(2) // 作業終了時と休憩終了時
    })
  })

  it('進捗が円形プログレスバーで表示される', () => {
    render(<PomodoroTimer />)
    
    // プログレスバーが存在することを確認
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})