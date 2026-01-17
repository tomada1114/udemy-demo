/**
 * @jest-environment node
 */
import { GET } from '@/app/api/forecast/[city]/route'
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

describe('/api/forecast/[city] API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.OPEN_WEATHER_API_KEY = 'test-api-key'
  })

  it('should return 5-day forecast data for valid city', async () => {
    const mockApiResponse = {
      city: {
        name: 'Tokyo',
      },
      list: [
        {
          dt_txt: '2025-01-27 12:00:00',
          main: {
            temp_max: 22.0,
            temp_min: 16.0,
          },
          weather: [
            {
              description: 'cloudy',
              icon: '02d',
            },
          ],
        },
        {
          dt_txt: '2025-01-28 12:00:00',
          main: {
            temp_max: 20.0,
            temp_min: 14.0,
          },
          weather: [
            {
              description: 'rain',
              icon: '10d',
            },
          ],
        },
        {
          dt_txt: '2025-01-29 12:00:00',
          main: {
            temp_max: 23.0,
            temp_min: 17.0,
          },
          weather: [
            {
              description: 'clear',
              icon: '01d',
            },
          ],
        },
        {
          dt_txt: '2025-01-30 12:00:00',
          main: {
            temp_max: 25.0,
            temp_min: 19.0,
          },
          weather: [
            {
              description: 'clear',
              icon: '01d',
            },
          ],
        },
        {
          dt_txt: '2025-01-31 12:00:00',
          main: {
            temp_max: 21.0,
            temp_min: 15.0,
          },
          weather: [
            {
              description: 'cloudy',
              icon: '02d',
            },
          ],
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'Tokyo' } })
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org/data/2.5/forecast'),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    )
    
    expect(data).toHaveLength(5)
    expect(data[0]).toEqual({
      date: '2025-01-27',
      tempMax: 22.0,
      tempMin: 16.0,
      description: 'cloudy',
      icon: '02d',
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'InvalidCity' } })
    
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'Tokyo' } })
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should group forecast by day and get daily min/max', async () => {
    const mockApiResponse = {
      city: {
        name: 'Tokyo',
      },
      list: [
        // Same day, different times
        {
          dt_txt: '2025-01-27 00:00:00',
          main: { temp_max: 18.0, temp_min: 15.0 },
          weather: [{ description: 'cloudy', icon: '02n' }],
        },
        {
          dt_txt: '2025-01-27 12:00:00',
          main: { temp_max: 22.0, temp_min: 16.0 },
          weather: [{ description: 'clear', icon: '01d' }],
        },
        {
          dt_txt: '2025-01-27 18:00:00',
          main: { temp_max: 20.0, temp_min: 17.0 },
          weather: [{ description: 'cloudy', icon: '02d' }],
        },
        // Next day
        {
          dt_txt: '2025-01-28 12:00:00',
          main: { temp_max: 20.0, temp_min: 14.0 },
          weather: [{ description: 'rain', icon: '10d' }],
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'Tokyo' } })
    const data = await response.json()

    // Should group by day and find the actual min/max
    expect(data[0]).toEqual({
      date: '2025-01-27',
      tempMax: 22.0, // Max of 18, 22, 20
      tempMin: 15.0, // Min of 15, 16, 17
      description: 'clear', // From noon (most representative)
      icon: '01d',
    })
  })

  it('should use Japanese language parameter', async () => {
    const mockApiResponse = {
      city: { name: '東京' },
      list: [
        {
          dt_txt: '2025-01-27 12:00:00',
          main: { temp_max: 22.0, temp_min: 16.0 },
          weather: [{ description: '曇り', icon: '02d' }],
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const request = {} as NextRequest
    await GET(request, { params: Promise.resolve({ city: '東京' } })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('lang=ja'),
      expect.any(Object)
    )
  })

  it('should handle missing API key', async () => {
    delete process.env.OPEN_WEATHER_API_KEY

    const request = {} as NextRequest
    const response = await GET(request, { params: Promise.resolve({ city: 'Tokyo' } })
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('API key')
  })
})