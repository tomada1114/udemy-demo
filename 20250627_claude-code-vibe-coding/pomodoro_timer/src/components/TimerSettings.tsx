import { Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'

interface TimerSettingsProps {
  workMinutes: number
  workSeconds: number
  breakMinutes: number
  breakSeconds: number
  onWorkTimeChange: (minutes: number, seconds: number) => void
  onBreakTimeChange: (minutes: number, seconds: number) => void
  disabled?: boolean
}

export function TimerSettings({
  workMinutes,
  workSeconds,
  breakMinutes,
  breakSeconds,
  onWorkTimeChange,
  onBreakTimeChange,
  disabled = false
}: TimerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(99, parseInt(e.target.value) || 0))
    onWorkTimeChange(value, workSeconds)
  }

  const handleWorkSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
    onWorkTimeChange(workMinutes, value)
  }

  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(99, parseInt(e.target.value) || 0))
    onBreakTimeChange(value, breakSeconds)
  }

  const handleBreakSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
    onBreakTimeChange(breakMinutes, value)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full mb-4"
        disabled={disabled}
      >
        <Settings className="w-4 h-4 mr-2" />
        タイマー設定
      </Button>

      {isOpen && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* 作業時間設定 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-card-foreground">
              🍅 作業時間
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label htmlFor="work-minutes" className="block text-sm font-medium text-muted-foreground mb-1">
                  分
                </label>
                <Input
                  id="work-minutes"
                  type="number"
                  min="0"
                  max="99"
                  value={workMinutes}
                  onChange={handleWorkMinutesChange}
                  className="text-center"
                  disabled={disabled}
                  aria-label="作業時間の分"
                />
              </div>
              <div className="text-2xl font-bold text-muted-foreground">:</div>
              <div className="flex-1">
                <label htmlFor="work-seconds" className="block text-sm font-medium text-muted-foreground mb-1">
                  秒
                </label>
                <Input
                  id="work-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={workSeconds}
                  onChange={handleWorkSecondsChange}
                  className="text-center"
                  disabled={disabled}
                  aria-label="作業時間の秒"
                />
              </div>
            </div>
          </div>

          {/* 休憩時間設定 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-card-foreground">
              ☕ 休憩時間
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label htmlFor="break-minutes" className="block text-sm font-medium text-muted-foreground mb-1">
                  分
                </label>
                <Input
                  id="break-minutes"
                  type="number"
                  min="0"
                  max="99"
                  value={breakMinutes}
                  onChange={handleBreakMinutesChange}
                  className="text-center"
                  disabled={disabled}
                  aria-label="休憩時間の分"
                />
              </div>
              <div className="text-2xl font-bold text-muted-foreground">:</div>
              <div className="flex-1">
                <label htmlFor="break-seconds" className="block text-sm font-medium text-muted-foreground mb-1">
                  秒
                </label>
                <Input
                  id="break-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={breakSeconds}
                  onChange={handleBreakSecondsChange}
                  className="text-center"
                  disabled={disabled}
                  aria-label="休憩時間の秒"
                />
              </div>
            </div>
          </div>

          {/* プリセットボタン */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              プリセット
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkTimeChange(25, 0)
                  onBreakTimeChange(5, 0)
                }}
                disabled={disabled}
              >
                25分 / 5分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkTimeChange(45, 0)
                  onBreakTimeChange(15, 0)
                }}
                disabled={disabled}
              >
                45分 / 15分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkTimeChange(50, 0)
                  onBreakTimeChange(10, 0)
                }}
                disabled={disabled}
              >
                50分 / 10分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkTimeChange(90, 0)
                  onBreakTimeChange(20, 0)
                }}
                disabled={disabled}
              >
                90分 / 20分
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}