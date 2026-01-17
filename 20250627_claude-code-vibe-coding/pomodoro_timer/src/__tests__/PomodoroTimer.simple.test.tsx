import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PomodoroTimer } from '../components/PomodoroTimer'

describe('PomodoroTimer Simple', () => {
  it('アプリが正しくレンダリングされる', () => {
    render(<PomodoroTimer />)
    
    // タイトルが表示されることを確認
    expect(screen.getByText('ポモドーロタイマー')).toBeInTheDocument()
    
    // 初期の時間表示が25:00であることを確認
    expect(screen.getByText('25:00')).toBeInTheDocument()
    
    // 開始ボタンが存在することを確認
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument()
  })
})