import { render, screen } from '@testing-library/react'
import WeatherCard from '@/components/WeatherCard'
import type { Forecast } from '@/types/weather'

const mockForecast: Forecast = {
  date: '2025-01-26',
  tempMax: 24.0,
  tempMin: 18.0,
  description: '晴れ',
  icon: '01d',
}

describe('WeatherCard', () => {
  it('should display formatted date', () => {
    render(<WeatherCard forecast={mockForecast} />)
    // 日付をより読みやすい形式で表示
    expect(screen.getByText(/1月26日/)).toBeInTheDocument()
  })

  it('should display weather emoji', () => {
    render(<WeatherCard forecast={mockForecast} />)
    const emoji = screen.getByRole('img', { name: '晴れ' })
    expect(emoji).toBeInTheDocument()
    expect(emoji).toHaveTextContent('☀️')
  })

  it('should display max and min temperatures', () => {
    render(<WeatherCard forecast={mockForecast} />)
    expect(screen.getByText('24°')).toBeInTheDocument()
    expect(screen.getByText('18°')).toBeInTheDocument()
  })

  it('should display weather description', () => {
    render(<WeatherCard forecast={mockForecast} />)
    expect(screen.getByText('晴れ')).toBeInTheDocument()
  })

  it('should handle different date formats', () => {
    const forecast: Forecast = {
      ...mockForecast,
      date: '2025-02-01',
    }
    render(<WeatherCard forecast={forecast} />)
    expect(screen.getByText(/2月1日/)).toBeInTheDocument()
  })

  it('should display day of week', () => {
    render(<WeatherCard forecast={mockForecast} />)
    // 曜日の要素を取得（日曜日の場合）
    const dayOfWeekElements = screen.getAllByText(/日/)
    // 少なくとも1つは曜日表示（単独の「日」）
    const hasDayOfWeek = dayOfWeekElements.some(element => 
      element.textContent === '日'
    )
    expect(hasDayOfWeek).toBe(true)
  })
})