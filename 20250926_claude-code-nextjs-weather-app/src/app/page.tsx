'use client'

import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/components/SearchBar'
import CurrentWeather from '@/components/CurrentWeather'
import ForecastList from '@/components/ForecastList'
import WeatherSkeleton from '@/components/WeatherSkeleton'
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather'
import { translateCityName } from '@/lib/cityMapping'
import { getErrorMessage } from '@/lib/errors'
import type { Weather, Forecast } from '@/types/weather'

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null)
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadWeatherData = useCallback(async (city: string) => {
    setLoading(true)
    setError('')
    
    // 日本語の都市名を英語に変換
    const translatedCity = translateCityName(city)
    
    try {
      // 並列でAPIを呼び出し
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(translatedCity),
        fetchForecast(translatedCity)
      ])
      
      setCurrentWeather(weatherData)
      setForecasts(forecastData)
    } catch (err) {
      console.error('Error fetching weather data:', err)
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(async (city: string) => {
    await loadWeatherData(city)
  }, [loadWeatherData])

  // 初回ロード時に東京の天気を取得
  useEffect(() => {
    loadWeatherData('Tokyo')
  }, [loadWeatherData])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          天気予報アプリ
        </h1>
        
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>
        
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
        
        {loading ? (
          <WeatherSkeleton />
        ) : (
          currentWeather && (
            <>
              <div className="mb-8">
                <CurrentWeather weather={currentWeather} />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
                  5日間の予報
                </h2>
                <ForecastList forecasts={forecasts} />
              </div>
            </>
          )
        )}
      </div>
    </main>
  )
}
