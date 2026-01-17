/**
 * 分析結果カードコンポーネント
 * 分析結果をカードUIで表示
 */

import React from 'react'
import { AnalysisResult } from './AnalysisResult'
import { getCardClasses, cn } from '@/lib/design-utils'
import { ThemeColor } from '@/types/design'
import { AnalysisResult as AnalysisResultType } from '@/types/app'

interface AnalysisCardProps {
  result: AnalysisResultType
  themeColor?: ThemeColor
  className?: string
  onClose?: () => void
}

/**
 * 分析結果をカード形式で表示
 */
export function AnalysisCard({
  result,
  themeColor = 'ocean',
  className,
  onClose
}: AnalysisCardProps) {
  return (
    <div className={cn(
      getCardClasses(themeColor, false, false),
      'relative',
      className
    )}>
      {/* クローズボタン */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/40 hover:bg-white/60 backdrop-blur-sm transition-all duration-200 hover:scale-110 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
          aria-label="閉じる"
        >
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
      
      {/* タイトル */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl mb-4">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          文体分析が完了しました
        </h2>
        <p className="text-gray-600 text-lg">
          以下があなたの文体の特徴です
        </p>
      </div>
      
      {/* 分析結果 */}
      <AnalysisResult result={result} />
    </div>
  )
}