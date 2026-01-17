import React from 'react'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import StickyNote from './components/StickyNote'
import PinnedNotesArea from './components/PinnedNotesArea'
import { useStickyNotes } from './hooks/useStickyNotes'

const StickyNotesApp: React.FC = () => {
  const { notes, pinnedNotes, unpinnedNotes, addNote, updateNote, deleteNote, clearAllNotes, togglePin } = useStickyNotes()

  const handleTogglePin = (id: string) => {
    const result = togglePin(id)
    if (result === false) {
      toast.error('固定できるメモは最大3個までです', {
        duration: 3000,
        position: 'top-center',
        style: {
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#374151',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      })
    } else if (result === true) {
      toast.success('メモを重要リストに固定しました', {
        duration: 2000,
        position: 'top-center',
        style: {
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#374151',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      })
    }
    return result
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Notes
              </h1>
              <p className="text-sm text-gray-500 font-medium">思考を整理し、アイデアを形に</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={addNote}
              className="
                group flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700
                text-white font-semibold rounded-xl
                shadow-lg hover:shadow-xl
                transform hover:scale-105 transition-all duration-200
                border border-blue-400/20
              "
              aria-label="付箋を追加"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              新しいメモ
            </button>
            
            {notes.length > 0 && (
              <button
                onClick={clearAllNotes}
                className="
                  group flex items-center gap-2 px-4 py-2.5
                  bg-white/80 hover:bg-red-50
                  text-red-600 hover:text-red-700 font-medium rounded-xl
                  shadow-md hover:shadow-lg
                  transform hover:scale-105 transition-all duration-200
                  border border-red-200/50 hover:border-red-300/50
                "
                aria-label="全て削除"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                すべて削除
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 固定メモエリア */}
      <PinnedNotesArea
        pinnedNotes={pinnedNotes}
        onUpdate={updateNote}
        onDelete={deleteNote}
        onTogglePin={handleTogglePin}
      />

      {/* メインコンテンツ */}
      <main className="pt-4 relative w-full min-h-screen">
        {/* 付箋がない場合のメッセージ */}
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <div className="text-center max-w-2xl mx-auto px-6">
              {/* アイコン */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
                  <Sparkles className="w-16 h-16 text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse delay-300"></div>
              </div>
              
              {/* メッセージ */}
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                あなたのアイデアを<br />美しく整理しよう
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                思考を視覚化し、創造性を解き放つ。<br />
                新しいメモボタンを押して、今すぐ始めましょう。
              </p>
              
              {/* 機能紹介カード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">直感的な作成</h3>
                  <p className="text-sm text-gray-600">ワンクリックで美しいメモを作成</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">美しいデザイン</h3>
                  <p className="text-sm text-gray-600">8色のグラデーションテーマ</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">自由な配置</h3>
                  <p className="text-sm text-gray-600">ドラッグで思考を整理</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 付箋の表示（固定されていないもののみ） */}
        {unpinnedNotes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onTogglePin={handleTogglePin}
          />
        ))}

        {/* 統計情報 */}
        {notes.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-white/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {notes.length} {notes.length === 1 ? 'メモ' : 'メモ'}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Toast通知 */}
      <Toaster />
    </div>
  )
}

export default StickyNotesApp