/**
 * 分析履歴ページ
 */

'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHistory } from '@/hooks/useHistory'
import { useThemeColor } from '@/hooks/useThemeColor'
import { HistoryItem } from '@/types/app'
import { cn } from '@/lib/design-utils'
import { THEME_COLORS_MAP, GLASSMORPHISM_STYLES } from '@/lib/design-system'
import { History, Trash2, Eye, ArrowLeft, Clock } from 'lucide-react'
import { CopyButton } from '@/components/features/Analysis/CopyButton'
import Link from 'next/link'

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useHistory()
  const { currentColor } = useThemeColor()
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const colors = THEME_COLORS_MAP[currentColor]

  const handleSelectItem = (item: HistoryItem) => {
    setSelectedItem(item)
  }

  const handleBackToList = () => {
    setSelectedItem(null)
  }

  const handleDeleteItem = (id: string) => {
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null)
    }
    removeFromHistory(id)
  }

  const handleClearAll = () => {
    setSelectedItem(null)
    clearHistory()
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
      <AppLayout>
        <div className="max-w-4xl mx-auto py-8">
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
                    className="p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-white/60"
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                'p-6 rounded-lg bg-white/60 border border-white/30',
                'prose prose-sm max-w-none'
              )}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-6 mt-0 leading-relaxed">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-8 leading-relaxed">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-gray-700 mb-3 mt-6 leading-relaxed">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-4 leading-relaxed">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-700 mb-4 leading-7 text-sm">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-4 space-y-1 [&>li]:list-disc [&>li]:ml-6 [&>li>ul>li]:list-circle [&>li>ul>li]:ml-6 [&>li>ul>li>ul>li]:list-square [&>li>ul>li>ul>li]:ml-6">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 space-y-1 [&>li]:list-decimal [&>li]:ml-6 [&>li>ol>li]:list-[lower-alpha] [&>li>ol>li]:ml-6 [&>li>ol>li>ol>li]:list-[lower-roman] [&>li>ol>li>ol>li]:ml-6">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700 leading-7 text-sm mb-2 pl-2">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                    code: ({ children }) => (
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800 mx-1">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto text-xs font-mono text-gray-800 leading-5">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-300 bg-blue-50/50 pl-4 pr-4 py-3 italic text-gray-700 my-4 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {selectedItem.result}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">分析履歴</h1>
              <p className="text-gray-600">過去に実行した文体分析の結果を確認できます</p>
            </div>
            <Link href="/analyzer" className="cursor-pointer">
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                分析に戻る
              </Button>
            </Link>
          </div>
        </div>

        {/* 履歴が空の場合 */}
        {history.length === 0 ? (
          <Card className={cn(
            'backdrop-blur-xl border-white/20 shadow-2xl',
            GLASSMORPHISM_STYLES.card,
            colors.glassmorphism
          )}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <History className="w-20 h-20 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                履歴がありません
              </h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                文体分析を実行すると、結果がこちらに保存されます。
                過去の分析結果を確認したり、コピーしたりできます。
              </p>
              <Link href="/analyzer" className="cursor-pointer">
                <Button className={cn(
                  'bg-gradient-to-r text-white font-medium px-6 py-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:scale-105',
                  colors.primary
                )}>
                  分析を開始
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* 履歴リスト */
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
                  <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-gray-600 font-medium ml-2">
                    {history.length}/5
                  </span>
                </CardTitle>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    すべて削除
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.map((item) => (
                <HistoryItemCard
                  key={item.id}
                  item={item}
                  onSelect={() => handleSelectItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                  themeColor={currentColor}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
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
    <div 
      className={cn(
        'group p-6 rounded-xl transition-all duration-200 cursor-pointer',
        'bg-white/40 backdrop-blur-sm border border-white/30',
        'hover:bg-white/60 hover:border-white/40 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="履歴項目を選択"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              {formattedDate}
            </span>
            <span className="text-xs px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-blue-700 font-medium">
              {item.characterCount}文字
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {item.preview}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className={cn(
              'h-9 w-9 p-0 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-110',
              'hover:bg-white/60',
              colors.primary
            )}
            aria-label="分析結果を表示"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            aria-label="履歴項目を削除"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}