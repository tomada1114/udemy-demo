import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  it('should render input and button', () => {
    render(<SearchBar onSearch={jest.fn()} />)
    
    expect(screen.getByPlaceholderText('都市名を入力（例: 東京、大阪）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '天気を検索' })).toBeInTheDocument()
  })

  it('should call onSearch with city name when form is submitted', async () => {
    const mockOnSearch = jest.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText('都市名を入力（例: 東京、大阪）')
    const button = screen.getByRole('button', { name: '天気を検索' })
    
    await user.type(input, '大阪')
    await user.click(button)
    
    expect(mockOnSearch).toHaveBeenCalledWith('大阪')
  })

  it('should not call onSearch with empty input', async () => {
    const mockOnSearch = jest.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    const button = screen.getByRole('button', { name: '天気を検索' })
    
    await user.click(button)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should show loading state when isLoading is true', () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={true} />)
    
    const button = screen.getByRole('button', { name: '検索中...' })
    expect(button).toBeDisabled()
  })

  it('should trim whitespace from input', async () => {
    const mockOnSearch = jest.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText('都市名を入力（例: 東京、大阪）')
    const button = screen.getByRole('button', { name: '天気を検索' })
    
    await user.type(input, '  東京  ')
    await user.click(button)
    
    expect(mockOnSearch).toHaveBeenCalledWith('東京')
  })

  it('should submit on Enter key press', async () => {
    const mockOnSearch = jest.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText('都市名を入力（例: 東京、大阪）')
    
    await user.type(input, '名古屋{Enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('名古屋')
  })
})