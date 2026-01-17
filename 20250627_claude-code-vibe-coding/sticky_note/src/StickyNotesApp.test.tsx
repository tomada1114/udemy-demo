import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import StickyNotesApp from './StickyNotesApp'

describe('StickyNotesApp', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear()
  })

  it('新しい付箋を追加できる', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋追加ボタンを探してクリック
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    // 新しい付箋が表示されることを確認
    expect(screen.getByTestId('sticky-note')).toBeInTheDocument()
  })

  it('付箋の内容を編集できる', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋を追加
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    // 付箋のテキストエリアを見つけて編集
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'テストメモ')
    
    // 内容が更新されることを確認
    expect(textarea).toHaveValue('テストメモ')
  })

  it('付箋を削除できる', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋を追加
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    // 付箋の削除ボタンをクリック（付箋内の削除ボタンを特定）
    const stickyNote = screen.getByTestId('sticky-note')
    const deleteButton = stickyNote.querySelector('button[aria-label="削除"]')
    expect(deleteButton).toBeInTheDocument()
    await user.click(deleteButton!)
    
    // 付箋が削除されることを確認
    expect(screen.queryByTestId('sticky-note')).not.toBeInTheDocument()
  })

  it('付箋の色を変更できる', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋を追加
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    // 色選択ボタンを見つけてクリック
    const colorButton = screen.getByRole('button', { name: /色を変更/i })
    await user.click(colorButton)
    
    // 色が変更されることを確認（具体的な色のクラスやスタイルを確認）
    const stickyNote = screen.getByTestId('sticky-note')
    expect(stickyNote).toHaveClass(/bg-/)
  })

  it('付箋がドラッグ可能である', () => {
    render(<StickyNotesApp />)
    
    // 付箋を追加
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    fireEvent.click(addButton)
    
    // 付箋がカスタムドラッグに対応していることを確認
    const stickyNote = screen.getByTestId('sticky-note')
    expect(stickyNote).toHaveClass('cursor-grab')
    expect(stickyNote).toHaveAttribute('draggable', 'false') // カスタムドラッグなのでfalse
  })

  it('localStorageにデータが保存される', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋を追加して編集
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'テストメモ')
    
    // LocalStorageにデータが保存されることを確認
    await waitFor(() => {
      const savedData = localStorage.getItem('sticky-notes')
      expect(savedData).toBeTruthy()
      const parsedData = JSON.parse(savedData!)
      expect(parsedData).toHaveLength(1)
      expect(parsedData[0].content).toBe('テストメモ')
    })
  })

  it('付箋を固定できる（最大3個まで）', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 複数の付箋を追加
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    await user.click(addButton)
    await user.click(addButton)
    await user.click(addButton)
    
    // 付箋が4個作成されることを確認
    const stickyNotes = screen.getAllByTestId('sticky-note')
    expect(stickyNotes).toHaveLength(4)
    
    // 最初の3つの付箋を固定
    for (let i = 0; i < 3; i++) {
      const pinButton = stickyNotes[i].querySelector('button[aria-label="重要なメモに固定"]')
      expect(pinButton).toBeInTheDocument()
      await user.click(pinButton!)
    }
    
    // 固定エリアに3つのメモが表示されることを確認
    expect(screen.getByText('重要なメモ')).toBeInTheDocument()
    expect(screen.getByText('3/3')).toBeInTheDocument()
    
    // 4つ目の付箋を固定しようとするとエラーメッセージが表示される
    const fourthNote = stickyNotes[3]
    const fourthPinButton = fourthNote.querySelector('button[aria-label="重要なメモに固定"]')
    await user.click(fourthPinButton!)
    
    // エラートーストが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('固定できるメモは最大3個までです')).toBeInTheDocument()
    })
  })

  it('固定したメモの固定を解除できる', async () => {
    const user = userEvent.setup()
    render(<StickyNotesApp />)
    
    // 付箋を追加して固定
    const addButton = screen.getByRole('button', { name: /付箋を追加/i })
    await user.click(addButton)
    
    const stickyNote = screen.getByTestId('sticky-note')
    const pinButton = stickyNote.querySelector('button[aria-label="重要なメモに固定"]')
    await user.click(pinButton!)
    
    // 固定エリアに表示されることを確認
    expect(screen.getByText('重要なメモ')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    
    // 固定解除ボタンをクリック
    const unpinButton = screen.getByTitle('固定を解除')
    await user.click(unpinButton)
    
    // 固定エリアからメモが消えることを確認
    expect(screen.getByText('重要なメモをここに固定できます')).toBeInTheDocument()
  })
})