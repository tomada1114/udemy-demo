import { render, screen } from '@testing-library/react'
import ForecastList from '@/components/ForecastList'
import type { Forecast } from '@/types/weather'

const mockForecasts: Forecast[] = [
  {
    date: '2025-01-26',
    tempMax: 24.0,
    tempMin: 18.0,
    description: '晴れ',
    icon: '01d',
  },
  {
    date: '2025-01-27',
    tempMax: 22.0,
    tempMin: 16.0,
    description: '曇り',
    icon: '02d',
  },
  {
    date: '2025-01-28',
    tempMax: 20.0,
    tempMin: 14.0,
    description: '雨',
    icon: '10d',
  },
  {
    date: '2025-01-29',
    tempMax: 23.0,
    tempMin: 17.0,
    description: '晴れ',
    icon: '01d',
  },
  {
    date: '2025-01-30',
    tempMax: 25.0,
    tempMin: 19.0,
    description: '晴れ',
    icon: '01d',
  },
]

describe('ForecastList', () => {
  it('should render all forecast cards', () => {
    render(<ForecastList forecasts={mockForecasts} />)
    
    // 5日分の予報が表示されることを確認
    expect(screen.getByText(/1月26日/)).toBeInTheDocument()
    expect(screen.getByText(/1月27日/)).toBeInTheDocument()
    expect(screen.getByText(/1月28日/)).toBeInTheDocument()
    expect(screen.getByText(/1月29日/)).toBeInTheDocument()
    expect(screen.getByText(/1月30日/)).toBeInTheDocument()
  })

  it('should display weather descriptions', () => {
    render(<ForecastList forecasts={mockForecasts} />)
    
    const sunnyElements = screen.getAllByText('晴れ')
    expect(sunnyElements.length).toBeGreaterThan(0)
    
    expect(screen.getByText('曇り')).toBeInTheDocument()
    expect(screen.getByText('雨')).toBeInTheDocument()
  })

  it('should handle empty forecast list', () => {
    render(<ForecastList forecasts={[]} />)
    
    expect(screen.getByText('予報データがありません')).toBeInTheDocument()
  })

  it('should display in responsive grid layout', () => {
    const { container } = render(<ForecastList forecasts={mockForecasts} />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-5')
  })

  it('should display correct number of forecast cards', () => {
    render(<ForecastList forecasts={mockForecasts} />)
    
    // WeatherCardコンポーネントの各日付要素をカウント
    const dates = [26, 27, 28, 29, 30]
    dates.forEach(day => {
      expect(screen.getByText(new RegExp(`1月${day}日`))).toBeInTheDocument()
    })
  })
})