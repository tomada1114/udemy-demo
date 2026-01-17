/**
 * 文字数カウンターコンポーネント
 * リアルタイムで文字数を表示し、制限に近づくと警告
 */

import React from 'react'
import { cn } from '@/lib/design-utils'

interface CharacterCounterProps {
  current: number
  max: number
  className?: string
}

/**
 * 文字数表示コンポーネント
 */
export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const percentage = (current / max) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 95
  
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span 
        className={cn(
          'font-medium transition-colors duration-200',
          isAtLimit && 'text-red-500',
          isNearLimit && !isAtLimit && 'text-orange-500',
          !isNearLimit && 'text-gray-500'
        )}
      >
        {current.toLocaleString()} / {max.toLocaleString()}
      </span>
      
      {/* プログレスバー */}
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            isAtLimit && 'bg-red-500',
            isNearLimit && !isAtLimit && 'bg-orange-500',
            !isNearLimit && 'bg-blue-500'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}