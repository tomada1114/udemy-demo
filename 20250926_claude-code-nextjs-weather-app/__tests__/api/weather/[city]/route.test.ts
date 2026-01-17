/**
 * @jest-environment node
 */
import { GET } from '@/app/api/weather/[city]/route'
import { NextRequest } from 'next/server'

// Mock fetch globally
global.fetch = jest.fn()

// Mock NextRequest
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url: string) => ({
    url,
    method: 'GET',
    headers: new Map(),
  })),
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: (data: any, init?: ResponseInit) => {
      const response = new Response(JSON.stringify(data), init)
      response.json = async () => data
      return response
    },
  },
}))

describe('/api/weather/[city] API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.OPEN_WEATHER_API_KEY = 'test-api-key'
  })

  it('should return current weather data for valid city', async () => {
    const mockApiResponse = {
      name: 'Tokyo',
      main: {
        temp: 20.5,
        temp_max: 24.0,
        temp_min: 18.0,
        humidity: 60,
      },
      weather: [
        {
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: {
        speed: 3.5,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    const response = await GET(request, { params: { city: 'Tokyo' } })
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org/data/2.5/weather'),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    )
    
    expect(data).toEqual({
      city: 'Tokyo',
      temperature: 20.5,
      description: 'clear sky',
      icon: '01d',
      tempMax: 24.0,
      tempMin: 18.0,
      humidity: 60,
      windSpeed: 3.5,
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const request = {} as NextRequest
    const response = await GET(request, { params: { city: 'InvalidCity' } })
    
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'Tokyo' }) })
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should use Japanese language parameter', async () => {
    const mockApiResponse = {
      name: '東京',
      main: {
        temp: 20.5,
        temp_max: 24.0,
        temp_min: 18.0,
        humidity: 60,
      },
      weather: [
        {
          description: '晴天',
          icon: '01d',
        },
      ],
      wind: {
        speed: 3.5,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    await GET(request, { params: Promise.resolve({ city: '東京' }) })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('lang=ja'),
      expect.any(Object)
    )
  })

  it('should use metric units', async () => {
    const mockApiResponse = {
      name: 'Tokyo',
      main: {
        temp: 20.5,
        temp_max: 24.0,
        temp_min: 18.0,
        humidity: 60,
      },
      weather: [
        {
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: {
        speed: 3.5,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    await GET(request, { params: Promise.resolve({ city: 'Tokyo' }) })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('units=metric'),
      expect.any(Object)
    )
  })

  it('should handle missing API key', async () => {
    delete process.env.OPEN_WEATHER_API_KEY

    const request = {} as NextRequest
    const response = await GET(request, { params: { city: 'Tokyo' } })
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('APIキー')
  })
})