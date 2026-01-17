import type { Weather, Forecast, WeatherResponse, ForecastResponse } from '@/types/weather'

describe('Weather Types', () => {
  it('should have correct Weather interface structure', () => {
    const weather: Weather = {
      city: '東京',
      temperature: 20.5,
      description: '晴れ',
      icon: '01d',
      tempMax: 24.0,
      tempMin: 18.0,
    }
    
    expect(weather.city).toBe('東京')
    expect(weather.temperature).toBe(20.5)
    expect(weather.description).toBe('晴れ')
    expect(weather.icon).toBe('01d')
    expect(weather.tempMax).toBe(24.0)
    expect(weather.tempMin).toBe(18.0)
  })

  it('should have correct Forecast interface structure', () => {
    const forecast: Forecast = {
      date: '2025-01-26',
      tempMax: 24.0,
      tempMin: 18.0,
      description: '晴れ',
      icon: '01d',
    }
    
    expect(forecast.date).toBe('2025-01-26')
    expect(forecast.tempMax).toBe(24.0)
    expect(forecast.tempMin).toBe(18.0)
    expect(forecast.description).toBe('晴れ')
    expect(forecast.icon).toBe('01d')
  })

  it('should allow optional fields in Weather', () => {
    const weather: Weather = {
      city: '大阪',
      temperature: 22.0,
      description: '曇り',
      icon: '02d',
      tempMax: 25.0,
      tempMin: 19.0,
      humidity: 60,
      windSpeed: 3.5,
    }
    
    expect(weather.humidity).toBe(60)
    expect(weather.windSpeed).toBe(3.5)
  })

  it('should have correct WeatherResponse structure', () => {
    const successResponse: WeatherResponse = {
      data: {
        city: '東京',
        temperature: 20.5,
        description: '晴れ',
        icon: '01d',
        tempMax: 24.0,
        tempMin: 18.0,
      },
    }
    
    const errorResponse: WeatherResponse = {
      error: '都市が見つかりません',
    }
    
    expect(successResponse.data).toBeDefined()
    expect(successResponse.error).toBeUndefined()
    expect(errorResponse.error).toBeDefined()
    expect(errorResponse.data).toBeUndefined()
  })

  it('should have correct ForecastResponse structure', () => {
    const response: ForecastResponse = {
      city: '東京',
      forecasts: [
        {
          date: '2025-01-26',
          tempMax: 24.0,
          tempMin: 18.0,
          description: '晴れ',
          icon: '01d',
        },
      ],
    }
    
    expect(response.city).toBe('東京')
    expect(response.forecasts).toHaveLength(1)
    expect(response.forecasts[0].date).toBe('2025-01-26')
  })
})