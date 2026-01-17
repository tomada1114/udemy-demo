/**
 * テキスト入力カードコンポーネント
 * TextInputAreaをカードUIでラップ
 */

import React from 'react'
import { TextInputArea } from './TextInputArea'
import { Button } from '@/components/ui/button'
import { getCardClasses, getButtonClasses, cn } from '@/lib/design-utils'
import { ThemeColor } from '@/types/design'

interface TextInputCardProps {
  value: string
  onChange: (value: string) => void
  onAnalyze: () => void
  isAnalyzing?: boolean
  themeColor?: ThemeColor
  className?: string
}

/**
 * テキスト入力カード全体のコンポーネント
 */
export function TextInputCard({
  value,
  onChange,
  onAnalyze,
  isAnalyzing = false,
  themeColor = 'ocean',
  className
}: TextInputCardProps) {
  const canAnalyze = value.trim().length > 0 && !isAnalyzing
  
  return (
    <div className={cn(
      getCardClasses(themeColor, false, false),
      'space-y-6',
      className
    )}>
      {/* タイトル */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          文章を入力
        </h2>
        <p className="text-gray-600">
          あなたの文体を分析します
        </p>
      </div>
      
      {/* テキスト入力エリア */}
      <TextInputArea
        value={value}
        onChange={onChange}
        onSubmit={onAnalyze}
        isAnalyzing={isAnalyzing}
      />
      
      {/* 分析ボタン */}
      <div className="flex justify-center">
        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={cn(
            getButtonClasses('primary', 'lg'),
            'min-w-[200px] transition-all duration-200',
            isAnalyzing && 'cursor-wait',
            canAnalyze && 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-105'
          )}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg 
                className="animate-spin h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              分析中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                />
              </svg>
              文体を分析
            </span>
          )}
        </Button>
      </div>
      
      {/* ヒント */}
      {value.length === 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 ヒント: ブログ記事やSNSの投稿など、<br />
            あなたらしい文章を入力してみてください
          </p>
        </div>
      )}
    </div>
  )
}