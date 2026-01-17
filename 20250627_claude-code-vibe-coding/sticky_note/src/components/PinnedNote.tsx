import React, { useState, useRef, useEffect } from 'react'
import { X, PinOff } from 'lucide-react'
import type { StickyNote } from '../types/StickyNote'
import { STICKY_NOTE_COLORS, type StickyNoteColor } from '../constants/colors'

interface PinnedNoteProps {
  note: StickyNote
  onUpdate: (id: string, updates: Partial<StickyNote>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => boolean | void
}

const PinnedNote: React.FC<PinnedNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getColorClass = (color: StickyNoteColor) => {
    const colorConfig = STICKY_NOTE_COLORS.find(c => c.value === color)
    return colorConfig?.class || 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300/30'
  }

  const getAccentColor = (color: StickyNoteColor) => {
    const colorConfig = STICKY_NOTE_COLORS.find(c => c.value === color)
    return colorConfig?.accent || '#FCD34D'
  }

  // テキストエリアの自動サイズ調整
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    if (isExpanded) {
      adjustTextareaHeight()
    }
  }, [isExpanded, note.content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, {
      content: e.target.value,
      updatedAt: new Date(),
    })
  }

  const handleUnpin = () => {
    onTogglePin(note.id)
  }

  const handleDelete = () => {
    onDelete(note.id)
  }

  const displayContent = note.content.length > 50 && !isExpanded 
    ? note.content.substring(0, 50) + '...'
    : note.content

  return (
    <div 
      className={`
        flex-shrink-0 w-64 sm:w-72 p-4 rounded-xl border shadow-sm snap-start
        ${getColorClass(note.color)}
        hover:shadow-md transition-all duration-200
        backdrop-blur-sm border-white/40
      `}
      style={{
        boxShadow: `0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px ${getAccentColor(note.color)}20`,
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getAccentColor(note.color) }}
          />
          <span className="text-xs font-medium text-gray-600">固定中</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleUnpin}
            className="
              p-1.5 rounded-lg bg-white/40 hover:bg-white/60 
              backdrop-blur-sm border border-white/30 hover:border-white/50
              transition-all duration-200 hover:scale-110
              shadow-sm hover:shadow-md
            "
            title="固定を解除"
          >
            <PinOff className="w-3.5 h-3.5 text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
          
          <button
            onClick={handleDelete}
            className="
              p-1.5 rounded-lg bg-white/40 hover:bg-red-50/80 
              backdrop-blur-sm border border-white/30 hover:border-red-200/50
              transition-all duration-200 hover:scale-110
              shadow-sm hover:shadow-md
            "
            title="削除"
          >
            <X className="w-3.5 h-3.5 text-gray-600 hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* 内容表示/編集 */}
      {isExpanded ? (
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={note.content}
            onChange={handleContentChange}
            onInput={adjustTextareaHeight}
            onBlur={() => setIsExpanded(false)}
            className="
              w-full bg-transparent resize-none outline-none 
              text-gray-800 placeholder-gray-400
              font-medium leading-relaxed text-sm
              focus:ring-0 focus:outline-none
            "
            placeholder="ここにメモを入力..."
            autoFocus
            rows={3}
          />
        </div>
      ) : (
        <div
          onClick={() => setIsExpanded(true)}
          className="cursor-text"
        >
          {displayContent ? (
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {displayContent}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              メモを入力...
            </p>
          )}
          
          {note.content.length > 50 && !isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2 underline"
            >
              もっと見る
            </button>
          )}
        </div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30">
        <div className="text-xs text-gray-500 font-medium">
          {new Date(note.createdAt).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
        
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            編集
          </button>
        )}
      </div>
    </div>
  )
}

export default PinnedNote