import { NextRequest, NextResponse } from 'next/server'
import type { Weather } from '@/types/weather'
import { createErrorFromStatus, InvalidAPIKeyError } from '@/lib/errors'

// Simple in-memory cache
const cache = new Map<string, { data: Weather; timestamp: number }>()
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
  const cacheKey = city.toLowerCase()
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    // Call OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
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

    // Transform API response to our Weather type
    const weather: Weather = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tempMax: data.main.temp_max,
      tempMin: data.main.temp_min,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    }

    // Cache the result
    cache.set(cacheKey, { data: weather, timestamp: Date.now() })

    return NextResponse.json(weather)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data'
    return NextResponse.json(
      { error: errorMessage, code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}