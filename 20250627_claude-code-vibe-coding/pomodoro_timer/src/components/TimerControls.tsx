import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from './ui/button'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ 
  isRunning, 
  onStart, 
  onPause, 
  onReset, 
  onSkip 
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* 開始/停止ボタン */}
      <Button
        onClick={isRunning ? onPause : onStart}
        size="lg"
        className="px-8 py-4 text-lg"
        variant={isRunning ? "secondary" : "default"}
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            停止
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            開始
          </>
        )}
      </Button>

      {/* リセットボタン */}
      <Button
        onClick={onReset}
        size="lg"
        variant="outline"
        className="px-6 py-4"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        リセット
      </Button>

      {/* スキップボタン */}
      <Button
        onClick={onSkip}
        size="lg"
        variant="outline"
        className="px-6 py-4"
      >
        <SkipForward className="w-5 h-5 mr-2" />
        スキップ
      </Button>
    </div>
  )
}