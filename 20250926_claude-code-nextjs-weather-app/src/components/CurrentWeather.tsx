import type { Weather } from '@/types/weather'
import { getWeatherEmoji, getEmojiSizeClass } from '@/lib/weatherEmoji'

interface CurrentWeatherProps {
  weather: Weather
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  const roundedTemp = Math.round(weather.temperature)
  const weatherEmoji = getWeatherEmoji(weather.icon)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">{weather.city}</h2>
      
      <div className="flex items-center justify-center mb-4">
        <div className={`${getEmojiSizeClass('large')} flex items-center justify-center`}>
          <span role="img" aria-label={weather.description}>
            {weatherEmoji}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-5xl font-bold">{roundedTemp}°C</div>
          <div className="text-gray-600 mt-2">{weather.description}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <span className="text-gray-500">最高: {Math.round(weather.tempMax)}°C</span>
        </div>
        <div className="text-center">
          <span className="text-gray-500">最低: {Math.round(weather.tempMin)}°C</span>
        </div>
        {weather.humidity !== undefined && (
          <div className="text-center">
            <span className="text-gray-500">湿度: {weather.humidity}%</span>
          </div>
        )}
        {weather.windSpeed !== undefined && (
          <div className="text-center">
            <span className="text-gray-500">風速: {weather.windSpeed} m/s</span>
          </div>
        )}
      </div>
    </div>
  )
}