import React, { useState, useRef, useEffect } from 'react'
import { X, Palette, Pin } from 'lucide-react'
import type { StickyNote as StickyNoteType } from '../types/StickyNote'
import { STICKY_NOTE_COLORS, type StickyNoteColor } from '../constants/colors'

interface StickyNoteProps {
  note: StickyNoteType
  onUpdate: (id: string, updates: Partial<StickyNoteType>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => boolean | void
}

const StickyNote: React.FC<StickyNoteProps> = ({ note, onUpdate, onDelete, onTogglePin }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent) => {
    // テキストエリア、ボタン、カラーピッカーがクリックされた場合はドラッグしない
    if (
      e.target === textareaRef.current || 
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('.color-picker') ||
      showColorPicker
    ) return
    
    e.preventDefault()
    setIsDragging(true)
    
    // カラーピッカーが開いている場合は閉じる
    setShowColorPicker(false)
    
    // 現在のマウス位置と付箋の位置の差分を記録
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    })
  }

  // ドラッグ中
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      // マウス位置から初期オフセットを引いて新しい位置を計算
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // 画面外に出ないように制限
      const maxX = window.innerWidth - 288 // 付箋の幅を考慮 (w-72 = 288px)
      const maxY = window.innerHeight - 200 // 付箋の高さを考慮
      
      onUpdate(note.id, {
        position: {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        },
      })
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }

    // ドキュメント全体でイベントを監視
    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp, { passive: false })
    
    // ドラッグ中はテキスト選択を無効化
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, dragOffset, note.id, onUpdate])

  // テキストエリアの自動サイズ調整
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [note.content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, {
      content: e.target.value,
      updatedAt: new Date(),
    })
  }

  const handleColorChange = (color: StickyNoteColor) => {
    onUpdate(note.id, {
      color,
      updatedAt: new Date(),
    })
    setShowColorPicker(false)
  }

  const handlePin = () => {
    onTogglePin(note.id)
  }

  const getColorClass = (color: StickyNoteColor) => {
    const colorConfig = STICKY_NOTE_COLORS.find(c => c.value === color)
    return colorConfig?.class || 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300/30'
  }

  const getAccentColor = (color: StickyNoteColor) => {
    const colorConfig = STICKY_NOTE_COLORS.find(c => c.value === color)
    return colorConfig?.accent || '#FCD34D'
  }

  return (
    <div
      ref={noteRef}
      data-testid="sticky-note"
      className={`
        absolute w-72 min-h-44 p-5 rounded-2xl shadow-lg
        ${getColorClass(note.color)}
        ${isDragging ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:scale-[1.02]'}
        transition-all duration-200 ease-out
        select-none backdrop-blur-sm
        border border-white/30 hover:border-white/50
      `}
      style={{
        left: note.position.x,
        top: note.position.y,
        zIndex: isDragging ? 1000 : 1,
        transform: isDragging ? 'scale(1.05) rotate(1deg)' : 'scale(1) rotate(0deg)',
        pointerEvents: isDragging ? 'none' : 'auto',
        boxShadow: isDragging 
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${getAccentColor(note.color)}33`
          : `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${getAccentColor(note.color)}22`,
      }}
      onMouseDown={handleMouseDown}
      draggable={false}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="
              group p-2 rounded-xl bg-white/40 hover:bg-white/60 
              backdrop-blur-sm border border-white/30 hover:border-white/50
              transition-all duration-200 hover:scale-110
              shadow-sm hover:shadow-md
            "
            aria-label="色を変更"
            type="button"
            style={{ pointerEvents: 'auto' }}
          >
            <Palette 
              className="w-4 h-4 text-gray-700 group-hover:text-gray-900 transition-colors" 
              style={{ color: getAccentColor(note.color) }}
            />
          </button>

          <button
            onClick={handlePin}
            className="
              group p-2 rounded-xl bg-white/40 hover:bg-amber-50/80 
              backdrop-blur-sm border border-white/30 hover:border-amber-200/50
              transition-all duration-200 hover:scale-110
              shadow-sm hover:shadow-md
            "
            aria-label="重要なメモに固定"
            type="button"
            style={{ pointerEvents: 'auto' }}
            title="重要なメモに固定（最大3個）"
          >
            <Pin className="w-4 h-4 text-gray-600 group-hover:text-amber-600 transition-colors" />
          </button>
        </div>
        
        <button
          onClick={() => onDelete(note.id)}
          className="
            group p-2 rounded-xl bg-white/40 hover:bg-red-50/80 
            backdrop-blur-sm border border-white/30 hover:border-red-200/50
            transition-all duration-200 hover:scale-110
            shadow-sm hover:shadow-md
          "
          aria-label="削除"
          type="button"
          style={{ pointerEvents: 'auto' }}
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>

      {/* カラーピッカー */}
      {showColorPicker && (
        <div className="color-picker absolute top-16 left-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-3 border border-white/30 z-20">
          <div className="grid grid-cols-4 gap-2">
            {STICKY_NOTE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`
                  w-8 h-8 rounded-xl ${color.class} 
                  border-2 transition-all duration-200
                  hover:scale-110 hover:shadow-lg cursor-pointer
                  ${note.color === color.value ? 'border-gray-600 scale-110' : 'border-white/50 hover:border-gray-300'}
                `}
                title={color.name}
                type="button"
                style={{ pointerEvents: 'auto' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* テキストエリア */}
      <textarea
        ref={textareaRef}
        value={note.content}
        onChange={handleContentChange}
        onInput={adjustTextareaHeight}
        className="
          w-full bg-transparent resize-none outline-none 
          text-gray-800 placeholder-gray-400 cursor-text
          font-medium leading-relaxed
          focus:ring-0 focus:outline-none
        "
        placeholder="ここにメモを入力..."
        rows={1}
        style={{ 
          pointerEvents: 'auto',
          minHeight: '2.5rem'
        }}
      />

      {/* 作成日時とアクセント */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/30">
        <div className="text-xs text-gray-500 font-medium">
          {new Date(note.createdAt).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getAccentColor(note.color) }}
        />
      </div>
    </div>
  )
}

export default StickyNote