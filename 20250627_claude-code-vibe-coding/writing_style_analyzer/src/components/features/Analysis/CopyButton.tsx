/**
 * コピーボタンコンポーネント
 * クリップボードへのコピー機能を提供
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/lib/design-utils'

interface CopyButtonProps {
  text: string
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * テキストをクリップボードにコピーするボタン
 */
export function CopyButton({ 
  text, 
  className,
  variant = 'outline',
  size = 'default'
}: CopyButtonProps) {
  const { copy, copied } = useClipboard()
  
  const handleCopy = () => {
    copy(text)
  }
  
  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn(
        'transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        copied && 'bg-green-50 border-green-500 text-green-700 hover:shadow-green-200',
        !copied && 'hover:scale-105',
        className
      )}
    >
      {copied ? (
        <>
          <svg 
            className="w-4 h-4 mr-2" 
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
          コピー済み
        </>
      ) : (
        <>
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          コピー
        </>
      )}
    </Button>
  )
}