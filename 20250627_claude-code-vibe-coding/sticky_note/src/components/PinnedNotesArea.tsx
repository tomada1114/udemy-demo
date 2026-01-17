import React from 'react'
import { Pin } from 'lucide-react'
import type { StickyNote } from '../types/StickyNote'
import PinnedNote from './PinnedNote'

interface PinnedNotesAreaProps {
  pinnedNotes: StickyNote[]
  onUpdate: (id: string, updates: Partial<StickyNote>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => boolean | void
}

const PinnedNotesArea: React.FC<PinnedNotesAreaProps> = ({
  pinnedNotes,
  onUpdate,
  onDelete,
  onTogglePin,
}) => {
  if (pinnedNotes.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/30 mt-20 relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                <Pin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                重要なメモをここに固定できます
              </p>
              <p className="text-xs text-gray-400 mt-1">
                最大3個まで固定可能
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-white/30 shadow-sm mt-20 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* ヘッダー */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
            <Pin className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-700">
            重要なメモ
          </h2>
          <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
            {pinnedNotes.length}/3
          </div>
        </div>

        {/* 固定メモ一覧 */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
          {pinnedNotes.map((note) => (
            <PinnedNote
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PinnedNotesArea