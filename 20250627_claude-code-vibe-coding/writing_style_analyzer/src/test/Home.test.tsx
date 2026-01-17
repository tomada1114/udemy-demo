import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '@/app/page'

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Writing Style Analyzer')
  })

  it('renders the subtitle in Japanese', () => {
    render(<Home />)
    
    const subtitle = screen.getByText('AI時代の個人らしさを守る文体分析アプリ')
    expect(subtitle).toBeInTheDocument()
  })

  it('renders the coming soon placeholder', () => {
    render(<Home />)
    
    const placeholder = screen.getByText('Coming soon...')
    expect(placeholder).toBeInTheDocument()
  })
})