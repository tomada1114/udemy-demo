import { useState, useEffect } from 'react'
import type { StickyNote } from '../types/StickyNote'

const STORAGE_KEY = 'sticky-notes'

export const useStickyNotes = () => {
  const [notes, setNotes] = useState<StickyNote[]>([])

  // LocalStorageからデータを読み込み
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: StickyNote & { createdAt: string; updatedAt: string }) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error('Failed to parse saved notes:', error)
      }
    }
  }, [])

  // notesが変更されたらLocalStorageに保存
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes])

  // 新しい付箋を追加
  const addNote = () => {
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      content: '',
      color: 'sunshine',
      position: {
        x: Math.random() * (window.innerWidth - 288), // 新しい幅288px (w-72)
        y: Math.random() * (window.innerHeight - 220) + 200, // ヘッダー+固定エリア高さ考慮
      },
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes(prev => [...prev, newNote])
  }

  // 付箋の固定状態を切り替え（最大3個制限）
  const togglePin = (id: string) => {
    const pinnedCount = notes.filter(note => note.isPinned).length
    const noteToToggle = notes.find(note => note.id === id)
    
    if (!noteToToggle) return
    
    // 固定解除の場合は制限なし
    if (noteToToggle.isPinned) {
      updateNote(id, { isPinned: false })
      return
    }
    
    // 固定追加の場合は3個制限
    if (pinnedCount >= 3) {
      return false // 制限に達している
    }
    
    updateNote(id, { isPinned: true })
    return true
  }

  // 付箋を更新
  const updateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    )
  }

  // 付箋を削除
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    // 付箋が全て削除された場合はLocalStorageもクリア
    if (notes.length === 1) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // 全ての付箋を削除
  const clearAllNotes = () => {
    setNotes([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    notes,
    pinnedNotes: notes.filter(note => note.isPinned),
    unpinnedNotes: notes.filter(note => !note.isPinned),
    addNote,
    updateNote,
    deleteNote,
    clearAllNotes,
    togglePin,
  }
}