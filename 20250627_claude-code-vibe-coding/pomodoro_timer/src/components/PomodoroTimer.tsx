import { useEffect, useState } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useAudio } from '@/hooks/useAudio'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { TimerSettings } from './TimerSettings'
import { Confetti } from './Confetti'

export function PomodoroTimer() {
  const timer = useTimer()
  const { playNotification } = useAudio()
  const [showConfetti, setShowConfetti] = useState(false)

  // セッション完了時の音声通知と紙吹雪を設定
  useEffect(() => {
    timer.setOnSessionComplete(() => {
      playNotification()
      // 作業セッション完了時のみ紙吹雪を表示
      if (timer.isWorkSession) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 100)
      }
    })
  }, [timer, playNotification])

  return (
    <div className={`min-h-screen p-4 transition-all duration-1000 ${
      timer.isRunning 
        ? timer.isWorkSession 
          ? 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 dark:from-rose-950 dark:via-orange-950 dark:to-amber-950' 
          : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            ポモドーロタイマー
          </h1>
          <p className="text-muted-foreground text-lg">
            集中力を高めて生産性をアップ
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左側: タイマー設定 */}
          <div className="md:col-span-1">
            <TimerSettings
              workMinutes={timer.workMinutes}
              workSeconds={timer.workSeconds}
              breakMinutes={timer.breakMinutes}
              breakSeconds={timer.breakSeconds}
              onWorkTimeChange={timer.setWorkTime}
              onBreakTimeChange={timer.setBreakTime}
              disabled={timer.isRunning}
            />
            
            {/* 統計情報 */}
            <div className="mt-6 bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                📊 セッション情報
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>現在のセッション:</span>
                  <span className="font-medium">
                    {timer.isWorkSession ? '作業' : '休憩'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>進捗:</span>
                  <span className="font-medium">
                    {Math.round(timer.progress * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>状態:</span>
                  <span className={`font-medium ${
                    timer.isRunning ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {timer.isRunning ? '実行中' : '停止中'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 中央: タイマー表示 */}
          <div className="md:col-span-2 flex flex-col items-center justify-center">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
              <TimerDisplay
                minutes={timer.minutes}
                seconds={timer.seconds}
                progress={timer.progress}
                isWorkSession={timer.isWorkSession}
                isRunning={timer.isRunning}
              />
              
              {/* コントロールボタン */}
              <div className="mt-8">
                <TimerControls
                  isRunning={timer.isRunning}
                  onStart={timer.start}
                  onPause={timer.pause}
                  onReset={timer.reset}
                  onSkip={timer.switchSession}
                />
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            ⏰ ポモドーロテクニックで集中力を最大化
          </p>
        </div>
      </div>

      {/* 紙吹雪エフェクト */}
      <Confetti isActive={showConfetti} duration={4000} />
    </div>
  )
}