// 現在の天気情報
export interface Weather {
  city: string
  temperature: number
  description: string
  icon: string
  tempMax: number
  tempMin: number
  humidity?: number
  windSpeed?: number
}

// 予報データ（1日分）
export interface Forecast {
  date: string
  tempMax: number
  tempMin: number
  description: string
  icon: string
}

// API レスポンス型
export interface WeatherResponse {
  data?: Weather
  error?: string
}

export interface ForecastResponse {
  city: string
  forecasts: Forecast[]
  error?: string
}