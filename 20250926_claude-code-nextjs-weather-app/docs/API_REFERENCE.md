# Weather App API Reference

## Overview
This API provides weather information for cities using OpenWeatherMap data. All endpoints are server-side proxies that protect API keys and implement caching.

## Base URL
```
http://localhost:3000/api
```

Production URL will depend on your deployment platform.

## Authentication
No authentication required for API consumers. The server handles OpenWeatherMap API key authentication internally.

## Rate Limiting
- OpenWeatherMap free tier: 60 calls/minute
- Internal caching: 5-minute TTL to prevent rate limit issues

## Endpoints

### 1. Get Current Weather

**Endpoint:** `GET /api/weather/[city]`

**Description:** Returns current weather information for the specified city.

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| city | string | URL path | Yes | City name (English or romanized) |

**Response Schema:**
```typescript
{
  city: string        // City name
  temperature: number // Current temperature (°C)
  description: string // Weather description in Japanese
  icon: string        // Weather icon code (e.g., "01d", "09n")
  tempMax: number     // Maximum temperature (°C)
  tempMin: number     // Minimum temperature (°C)
  humidity?: number   // Humidity percentage (optional)
  windSpeed?: number  // Wind speed in m/s (optional)
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/weather/Tokyo
```

**Example Response:**
```json
{
  "city": "Tokyo",
  "temperature": 25.4,
  "description": "晴れ",
  "icon": "01d",
  "tempMax": 28.2,
  "tempMin": 22.1,
  "humidity": 65,
  "windSpeed": 3.5
}
```

**Error Responses:**

| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| 404 | City not found | `{ "error": "Weather data not found for [city]" }` |
| 500 | Server error | `{ "error": "Failed to fetch weather data" }` |
| 500 | No API key | `{ "error": "API key is not configured" }` |

**Cache Behavior:**
- Results cached for 5 minutes per city
- Cache key: lowercase city name
- Cache cleared on server restart

---

### 2. Get 5-Day Forecast

**Endpoint:** `GET /api/forecast/[city]`

**Description:** Returns 5-day weather forecast for the specified city.

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| city | string | URL path | Yes | City name (English or romanized) |

**Response Schema:**
```typescript
Array<{
  date: string        // Date in YYYY-MM-DD format
  tempMax: number     // Maximum temperature (°C)
  tempMin: number     // Minimum temperature (°C)
  description: string // Weather description in Japanese
  icon: string        // Weather icon code (e.g., "01d", "09n")
}>
```

**Example Request:**
```bash
curl http://localhost:3000/api/forecast/Tokyo
```

**Example Response:**
```json
[
  {
    "date": "2024-01-15",
    "tempMax": 28.2,
    "tempMin": 22.1,
    "description": "晴れ",
    "icon": "01d"
  },
  {
    "date": "2024-01-16",
    "tempMax": 26.5,
    "tempMin": 21.3,
    "description": "曇り",
    "icon": "03d"
  },
  {
    "date": "2024-01-17",
    "tempMax": 24.8,
    "tempMin": 19.2,
    "description": "小雨",
    "icon": "09d"
  },
  {
    "date": "2024-01-18",
    "tempMax": 25.1,
    "tempMin": 20.5,
    "description": "晴れ",
    "icon": "01d"
  },
  {
    "date": "2024-01-19",
    "tempMax": 27.3,
    "tempMin": 21.8,
    "description": "薄曇り",
    "icon": "02d"
  }
]
```

**Error Responses:**

| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| 404 | City not found | `{ "error": "Forecast data not found for [city]" }` |
| 500 | Server error | `{ "error": "Failed to fetch forecast data" }` |
| 500 | No API key | `{ "error": "API key is not configured" }` |

**Cache Behavior:**
- Results cached for 5 minutes per city
- Cache key: `forecast-[lowercase city name]`
- Cache cleared on server restart

**Data Processing:**
- Groups 3-hour forecast data by day
- Uses noon (12:00) weather for daily description
- Calculates daily min/max from all data points

---

## Weather Icon Codes

Common icon codes returned by the API:

| Code | Description | Emoji |
|------|-------------|-------|
| 01d | Clear sky (day) | ☀️ |
| 01n | Clear sky (night) | 🌙 |
| 02d | Few clouds (day) | ⛅ |
| 02n | Few clouds (night) | ☁️ |
| 03d/03n | Scattered clouds | ☁️ |
| 04d/04n | Broken clouds | ☁️ |
| 09d/09n | Shower rain | 🌧️ |
| 10d | Rain (day) | 🌦️ |
| 10n | Rain (night) | 🌧️ |
| 11d/11n | Thunderstorm | ⛈️ |
| 13d/13n | Snow | ❄️ |
| 50d/50n | Mist | 🌫️ |

## Client Integration

### JavaScript/TypeScript Example

```typescript
// Using fetch API
async function getCurrentWeather(city: string) {
  try {
    const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

async function getForecast(city: string) {
  try {
    const response = await fetch(`/api/forecast/${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

// Usage
getCurrentWeather('Tokyo').then(weather => {
  console.log(`Temperature in ${weather.city}: ${weather.temperature}°C`);
});

getForecast('Tokyo').then(forecast => {
  forecast.forEach(day => {
    console.log(`${day.date}: ${day.tempMin}°C - ${day.tempMax}°C`);
  });
});
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useWeather(city: string) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/weather/${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [city]);

  return { weather, loading, error };
}
```

## Error Handling Best Practices

1. **Always check response status**
   ```typescript
   if (!response.ok) {
     const error = await response.json();
     throw new Error(error.error || 'Unknown error');
   }
   ```

2. **Handle network failures**
   ```typescript
   try {
     const response = await fetch(url);
     // ...
   } catch (error) {
     if (error instanceof TypeError) {
       console.error('Network error:', error);
       // Show offline message to user
     }
   }
   ```

3. **Implement retry logic for transient failures**
   ```typescript
   async function fetchWithRetry(url: string, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(url);
         if (response.ok) return response;
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

## City Name Guidelines

For Japanese cities, use romanized names:
- 東京 → Tokyo
- 大阪 → Osaka
- 京都 → Kyoto
- 横浜 → Yokohama
- 名古屋 → Nagoya

The client application includes automatic translation for common Japanese city names.

## Deployment Considerations

### Environment Variables
Set the following in your production environment:
```bash
OPEN_WEATHER_API_KEY=your_production_api_key
```

### CORS Configuration
If hosting API and client separately, configure CORS headers:
```typescript
// In route handlers
const headers = {
  'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### Performance Optimization
- Consider implementing Redis or similar for production caching
- Monitor API usage to stay within rate limits
- Implement request queuing for high traffic
- Consider upgrading OpenWeatherMap plan for production use

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify API key is correctly configured
3. Ensure city names are properly formatted
4. Check OpenWeatherMap API status at https://openweathermap.org/api