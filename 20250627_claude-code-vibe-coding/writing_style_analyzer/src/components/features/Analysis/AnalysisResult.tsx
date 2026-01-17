/**
 * 分析結果表示コンポーネント
 * AI分析結果をMarkdown形式で表示
 */

import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { CopyButton } from './CopyButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/design-utils'
import { TYPOGRAPHY } from '@/lib/design-system'
import { AnalysisResult as AnalysisResultType } from '@/types/app'

interface AnalysisResultProps {
  result: AnalysisResultType
  className?: string
}

/**
 * 分析結果の表示コンポーネント
 */
export function AnalysisResult({ result, className }: AnalysisResultProps) {
  const formattedDate = new Date(result.timestamp).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className={cn('text-xl font-semibold mb-2', TYPOGRAPHY.body)}>
            分析結果
          </h3>
          <p className={cn('text-sm', TYPOGRAPHY.muted)}>
            {formattedDate} • {result.characterCount.toLocaleString()}文字
          </p>
        </div>
        <CopyButton 
          text={result.result}
          size="default"
          className="ml-4"
        />
      </div>
      
      {/* 結果表示エリア */}
      <ScrollArea className="h-[600px] w-full rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm shadow-lg">
        <div className="p-8">
          <MarkdownRenderer 
            content={result.result} 
            className="prose-lg leading-relaxed"
          />
        </div>
      </ScrollArea>
      
      {/* フッター */}
      <div className="flex justify-center items-center pt-6 mt-6 border-t border-gray-200">
        <p className={cn('text-sm text-center', TYPOGRAPHY.muted)}>
          ※ この分析結果は Gemini AI によって生成されました
        </p>
      </div>
    </div>
  )
}