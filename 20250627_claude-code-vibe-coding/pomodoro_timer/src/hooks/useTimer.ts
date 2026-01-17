import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerState {
  workMinutes: number
  workSeconds: number
  breakMinutes: number
  breakSeconds: number
  minutes: number
  seconds: number
  isRunning: boolean
  isWorkSession: boolean
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    workMinutes: 25,
    workSeconds: 0,
    breakMinutes: 5,
    breakSeconds: 0,
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isWorkSession: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onSessionCompleteRef = useRef<(() => void) | null>(null)

  // 現在の総時間を計算
  const totalTime = state.isWorkSession 
    ? state.workMinutes * 60 + state.workSeconds
    : state.breakMinutes * 60 + state.breakSeconds

  // 経過時間を計算
  const elapsedTime = totalTime - (state.minutes * 60 + state.seconds)

  // 進捗率を計算（0-1の範囲）
  const progress = totalTime > 0 ? elapsedTime / totalTime : 0

  // セッション完了時のコールバックを設定
  const setOnSessionComplete = useCallback((callback: () => void) => {
    onSessionCompleteRef.current = callback
  }, [])

  // タイマー開始
  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }))
  }, [])

  // タイマー停止
  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }))
  }, [])

  // タイマーリセット
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      minutes: prev.workMinutes,
      seconds: prev.workSeconds,
      isRunning: false,
      isWorkSession: true,
    }))
  }, [])

  // 作業時間設定
  const setWorkTime = useCallback((minutes: number, seconds: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        workMinutes: minutes,
        workSeconds: seconds,
      }
      
      // 現在作業セッション中の場合、表示時間も更新
      if (prev.isWorkSession && !prev.isRunning) {
        newState.minutes = minutes
        newState.seconds = seconds
      }
      
      return newState
    })
  }, [])

  // 休憩時間設定
  const setBreakTime = useCallback((minutes: number, seconds: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        breakMinutes: minutes,
        breakSeconds: seconds,
      }
      
      // 現在休憩セッション中の場合、表示時間も更新
      if (!prev.isWorkSession && !prev.isRunning) {
        newState.minutes = minutes
        newState.seconds = seconds
      }
      
      return newState
    })
  }, [])

  // セッション切り替え
  const switchSession = useCallback(() => {
    setState(prev => {
      const nextIsWorkSession = !prev.isWorkSession
      return {
        ...prev,
        isWorkSession: nextIsWorkSession,
        minutes: nextIsWorkSession ? prev.workMinutes : prev.breakMinutes,
        seconds: nextIsWorkSession ? prev.workSeconds : prev.breakSeconds,
        isRunning: false,
      }
    })
  }, [])

  // タイマーの更新処理
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          let newMinutes = prev.minutes
          let newSeconds = prev.seconds - 1

          if (newSeconds < 0) {
            newMinutes--
            newSeconds = 59
          }

          // セッション終了判定
          if (newMinutes < 0) {
            // セッション完了コールバックを実行
            if (onSessionCompleteRef.current) {
              onSessionCompleteRef.current()
            }

            // 次のセッションに切り替え
            const nextIsWorkSession = !prev.isWorkSession
            return {
              ...prev,
              isWorkSession: nextIsWorkSession,
              minutes: nextIsWorkSession ? prev.workMinutes : prev.breakMinutes,
              seconds: nextIsWorkSession ? prev.workSeconds : prev.breakSeconds,
              isRunning: false,
            }
          }

          return {
            ...prev,
            minutes: newMinutes,
            seconds: newSeconds,
          }
        })
      }, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning])

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    ...state,
    progress,
    start,
    pause,
    reset,
    setWorkTime,
    setBreakTime,
    switchSession,
    setOnSessionComplete,
  }
}