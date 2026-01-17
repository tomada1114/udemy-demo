import { ProgressRing } from './ProgressRing'

interface TimerDisplayProps {
  minutes: number
  seconds: number
  progress: number
  isWorkSession: boolean
  isRunning: boolean
}

export function TimerDisplay({ 
  minutes, 
  seconds, 
  progress, 
  isWorkSession, 
  isRunning 
}: TimerDisplayProps) {
  // 時間を2桁でフォーマット
  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0')
  }

  const timeString = `${formatTime(minutes)}:${formatTime(seconds)}`

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* セッション表示 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isWorkSession ? '🍅 作業時間' : '☕ 休憩時間'}
        </h2>
        <div className={`text-sm px-3 py-1 rounded-full ${
          isWorkSession 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {isRunning ? '実行中' : '停止中'}
        </div>
      </div>

      {/* プログレスリングとタイマー表示 */}
      <div className="relative">
        <ProgressRing 
          progress={progress} 
          size={280} 
          strokeWidth={12}
          className={isWorkSession ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}
        />
        
        {/* 中央の時間表示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-foreground mb-2">
              {timeString}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress * 100)}% 完了
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}