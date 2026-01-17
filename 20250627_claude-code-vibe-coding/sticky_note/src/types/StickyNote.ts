import type { StickyNoteColor } from '../constants/colors'

export interface StickyNote {
  id: string
  content: string
  color: StickyNoteColor
  position: { x: number; y: number }
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}