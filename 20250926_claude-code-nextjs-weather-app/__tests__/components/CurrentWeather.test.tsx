import { render, screen } from '@testing-library/react'
import CurrentWeather from '@/components/CurrentWeather'
import type { Weather } from '@/types/weather'

const mockWeather: Weather = {
  city: '東京',
  temperature: 20.5,
  description: '晴れ',
  icon: '01d',
  tempMax: 24.0,
  tempMin: 18.0,
  humidity: 60,
  windSpeed: 3.5,
}

describe('CurrentWeather', () => {
  it('should display city name', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText('東京')).toBeInTheDocument()
  })

  it('should display temperature with correct format', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText('21°C')).toBeInTheDocument() // 四捨五入
  })

  it('should display weather description', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText('晴れ')).toBeInTheDocument()
  })

  it('should display max and min temperatures', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText(/最高: 24°C/)).toBeInTheDocument()
    expect(screen.getByText(/最低: 18°C/)).toBeInTheDocument()
  })

  it('should display humidity when available', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText(/湿度: 60%/)).toBeInTheDocument()
  })

  it('should display wind speed when available', () => {
    render(<CurrentWeather weather={mockWeather} />)
    expect(screen.getByText(/風速: 3.5 m\/s/)).toBeInTheDocument()
  })

  it('should handle missing optional fields', () => {
    const weatherWithoutOptional: Weather = {
      city: '大阪',
      temperature: 22.0,
      description: '曇り',
      icon: '02d',
      tempMax: 25.0,
      tempMin: 19.0,
    }
    
    render(<CurrentWeather weather={weatherWithoutOptional} />)
    expect(screen.getByText('大阪')).toBeInTheDocument()
    expect(screen.queryByText(/湿度:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/風速:/)).not.toBeInTheDocument()
  })

  it('should display weather emoji with correct role', () => {
    render(<CurrentWeather weather={mockWeather} />)
    const emoji = screen.getByRole('img', { name: '晴れ' })
    expect(emoji).toBeInTheDocument()
    expect(emoji).toHaveTextContent('☀️') // 01d corresponds to clear sky
  })
})