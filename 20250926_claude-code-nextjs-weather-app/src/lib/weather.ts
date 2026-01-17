import type { Weather, Forecast } from '@/types/weather'

export async function fetchCurrentWeather(city: string): Promise<Weather> {
  const response = await fetch(`/api/weather/${encodeURIComponent(city)}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '天気情報の取得に失敗しました')
  }
  
  return response.json()
}

export async function fetchForecast(city: string): Promise<Forecast[]> {
  const response = await fetch(`/api/forecast/${encodeURIComponent(city)}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '天気予報の取得に失敗しました')
  }
  
  return response.json()
}