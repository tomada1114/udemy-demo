/**
 * テキスト入力エリアコンポーネント
 * 2000文字制限付きの文体分析用テキスト入力
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { CharacterCounter } from './CharacterCounter'
import { cn } from '@/lib/design-utils'
import { TYPOGRAPHY } from '@/lib/design-system'
import { toast } from 'sonner'

interface TextInputAreaProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  isAnalyzing?: boolean
  maxLength?: number
  placeholder?: string
  className?: string
}

const DEFAULT_PLACEHOLDER = `ここにあなたの文章を入力してください。

例えば、普段書いているブログ記事、メール、SNSの投稿など、あなたらしい文体が表れている文章を入力すると、より正確な分析結果が得られます。

最大2000文字まで入力可能です。`

/**
 * メインテキスト入力コンポーネント
 */
export function TextInputArea({
  value,
  onChange,
  onSubmit,
  isAnalyzing = false,
  maxLength = 2000,
  placeholder = DEFAULT_PLACEHOLDER,
  className
}: TextInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  
  // テキスト変更ハンドラー
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // 文字数制限を超える場合は警告表示
    if (newValue.length > maxLength) {
      // 2000文字でカット
      const truncatedValue = newValue.slice(0, maxLength)
      onChange(truncatedValue)
      
      // ユーザーに通知
      toast.error(`文字数制限を超えています（最大${maxLength}文字）`)
    } else {
      onChange(newValue)
    }
  }, [onChange, maxLength])
  
  // キーボードショートカット（Cmd/Ctrl + Enter で送信）
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && onSubmit && !isAnalyzing) {
      e.preventDefault()
      onSubmit()
    }
  }, [onSubmit, isAnalyzing])
  
  // 自動リサイズ
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`
    }
  }, [value])
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* ラベルとカウンター */}
      <div className="flex justify-between items-end">
        <label 
          htmlFor="text-input" 
          className={cn('text-sm font-medium', TYPOGRAPHY.body)}
        >
          分析したい文章
        </label>
        <CharacterCounter 
          current={value.length} 
          max={maxLength} 
        />
      </div>
      
      {/* テキストエリア */}
      <div className={cn(
        'relative rounded-xl transition-all duration-200',
        isFocused && 'ring-2 ring-blue-500 ring-offset-2'
      )}>
        <Textarea
          ref={textareaRef}
          id="text-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isAnalyzing}
          className={cn(
            'min-h-[200px] max-h-[400px] resize-none',
            'bg-white/50 backdrop-blur-sm',
            'border-gray-200 focus:border-blue-500',
            'placeholder:text-gray-400',
            'transition-all duration-200',
            isAnalyzing && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="分析用テキスト入力"
          aria-describedby="text-input-description"
        />
      </div>
      
      {/* ヘルプテキスト */}
      <p 
        id="text-input-description" 
        className={cn('text-sm', TYPOGRAPHY.muted)}
      >
        <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-gray-700 font-medium">Cmd/Ctrl + Enter</kbd> で分析開始
      </p>
    </div>
  )
}