/**
 * 分析履歴表示カードコンポーネント
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HistoryItem } from '@/types/app'
import { cn } from '@/lib/design-utils'
import { THEME_COLORS_MAP, GLASSMORPHISM_STYLES } from '@/lib/design-system'
import { History, Trash2, Eye, ArrowLeft } from 'lucide-react'
import { CopyButton } from '../Analysis/CopyButton'

interface HistoryCardProps {
  history: HistoryItem[]
  onDeleteItem: (id: string) => void
  onClearAll: () => void
  themeColor?: keyof typeof THEME_COLORS_MAP
}

/**
 * 履歴表示用カードコンポーネント
 */
export function HistoryCard({
  history,
  onDeleteItem,
  onClearAll,
  themeColor = 'sunshine'
}: HistoryCardProps) {
  const colors = THEME_COLORS_MAP[themeColor]
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  const handleSelectItem = (item: HistoryItem) => {
    setSelectedItem(item)
  }

  const handleBackToList = () => {
    setSelectedItem(null)
  }

  const handleDeleteItem = (id: string) => {
    // 削除される項目が現在選択されている場合、リストに戻る
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null)
    }
    onDeleteItem(id)
  }

  const handleClearAll = () => {
    setSelectedItem(null)
    onClearAll()
  }

  // 履歴が変更されたときに選択された項目が存在するかチェック
  React.useEffect(() => {
    if (selectedItem && !history.find(item => item.id === selectedItem.id)) {
      setSelectedItem(null)
    }
  }, [history, selectedItem])

  // 選択された履歴項目の詳細表示
  if (selectedItem) {
    return (
      <Card className={cn(
        'backdrop-blur-xl border-white/20 shadow-2xl',
        GLASSMORPHISM_STYLES.card,
        colors.glassmorphism
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="text-lg">分析結果</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedItem.timestamp).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} • {selectedItem.characterCount}文字
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                text={selectedItem.result}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-700"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(selectedItem.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 元のテキスト表示 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">分析対象テキスト</h4>
            <div className={cn(
              'p-4 rounded-lg bg-white/60 border border-white/30',
              'text-sm text-gray-700 leading-relaxed'
            )}>
              {selectedItem.text}
            </div>
          </div>
          
          {/* 分析結果表示 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">分析結果</h4>
            <div className={cn(
              'p-6 rounded-lg bg-white/60 border border-white/30',
              'prose prose-sm max-w-none'
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  code: ({ children }) => (
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {selectedItem.result}
              </ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className={cn(
        'backdrop-blur-xl border-white/20 shadow-2xl',
        GLASSMORPHISM_STYLES.card,
        colors.glassmorphism
      )}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            履歴がありません
          </h3>
          <p className="text-sm text-gray-500 text-center">
            文体分析を実行すると、こちらに履歴が表示されます
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      'backdrop-blur-xl border-white/20 shadow-2xl',
      GLASSMORPHISM_STYLES.card,
      colors.glassmorphism
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5" />
            分析履歴
            <span className="text-sm font-normal text-gray-500">
              ({history.length}/5)
            </span>
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              すべて削除
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.map((item) => (
          <HistoryItemCard
            key={item.id}
            item={item}
            onSelect={() => handleSelectItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
            themeColor={themeColor}
          />
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * 個別履歴アイテムカード
 */
interface HistoryItemCardProps {
  item: HistoryItem
  onSelect: () => void
  onDelete: () => void
  themeColor: keyof typeof THEME_COLORS_MAP
}

function HistoryItemCard({ item, onSelect, onDelete, themeColor }: HistoryItemCardProps) {
  const colors = THEME_COLORS_MAP[themeColor]
  const date = new Date(item.timestamp)
  const formattedDate = date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={cn(
      'group p-4 rounded-xl transition-all duration-200',
      'bg-white/40 backdrop-blur-sm border border-white/30',
      'hover:bg-white/60 hover:border-white/40 hover:shadow-lg'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">
              {formattedDate}
            </span>
            <span className="text-xs text-gray-400">
              {item.characterCount}文字
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
            {item.preview}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelect}
            className={cn(
              'h-8 w-8 p-0',
              'hover:bg-white/60',
              colors.primary
            )}
            aria-label="履歴項目を表示"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            aria-label="履歴項目を削除"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}