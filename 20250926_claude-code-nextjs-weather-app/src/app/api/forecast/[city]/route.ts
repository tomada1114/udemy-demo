import { NextRequest, NextResponse } from 'next/server'
import type { Forecast } from '@/types/weather'
import { createErrorFromStatus, InvalidAPIKeyError } from '@/lib/errors'

// Simple in-memory cache
const cache = new Map<string, { data: Forecast[]; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params
  
  // Check if API key exists
  const apiKey = process.env.OPEN_WEATHER_API_KEY
  if (!apiKey) {
    const error = new InvalidAPIKeyError()
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode || 500 }
    )
  }

  // Check cache
  const cacheKey = `forecast-${city.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    // Call OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric&lang=ja`
    
    const response = await fetch(url, {
      headers: new Headers({
        'Accept': 'application/json',
      }),
    })

    if (!response.ok) {
      const error = createErrorFromStatus(response.status, city)
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode || response.status }
      )
    }

    const data = await response.json()

    // Group forecast data by day and get daily min/max
    interface ForecastItem {
      dt_txt: string
      main: {
        temp_min: number
        temp_max: number
      }
      weather: Array<{
        description: string
        icon: string
      }>
    }
    
    const dailyForecasts = new Map<string, ForecastItem[]>()
    
    data.list.forEach((item: ForecastItem) => {
      const date = item.dt_txt.split(' ')[0]
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, [])
      }
      dailyForecasts.get(date)?.push(item)
    })

    // Convert to array and take only the first 5 days
    const forecasts: Forecast[] = Array.from(dailyForecasts.entries())
      .slice(0, 5)
      .map(([date, items]) => {
        // Find min and max temperatures for the day
        const tempMin = Math.min(...items.map(item => item.main.temp_min))
        const tempMax = Math.max(...items.map(item => item.main.temp_max))
        
        // Use noon data for weather description if available, otherwise use first item
        const noonItem = items.find(item => item.dt_txt.includes('12:00:00')) || items[0]
        
        return {
          date,
          tempMax,
          tempMin,
          description: noonItem.weather[0].description,
          icon: noonItem.weather[0].icon,
        }
      })

    // Cache the result
    cache.set(cacheKey, { data: forecasts, timestamp: Date.now() })

    return NextResponse.json(forecasts)
  } catch (error) {
    console.error('Error fetching forecast data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch forecast data'
    return NextResponse.json(
      { error: errorMessage, code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}