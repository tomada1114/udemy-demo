import type { Forecast } from '@/types/weather'
import { getWeatherEmoji, getEmojiSizeClass } from '@/lib/weatherEmoji'

interface WeatherCardProps {
  forecast: Forecast
}

export default function WeatherCard({ forecast }: WeatherCardProps) {
  // 日付のフォーマット
  const date = new Date(forecast.date + 'T00:00:00')
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  
  const weatherEmoji = getWeatherEmoji(forecast.icon)

  return (
    <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow">
      <div className="text-sm text-gray-600 mb-2">
        {month}月{day}日
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {dayOfWeek}
      </div>
      
      <div className="flex justify-center mb-2">
        <div className={getEmojiSizeClass('medium')}>
          <span role="img" aria-label={forecast.description}>
            {weatherEmoji}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        {forecast.description}
      </div>
      
      <div className="flex justify-center gap-2 text-sm">
        <span className="text-red-500 font-semibold">{Math.round(forecast.tempMax)}°</span>
        <span className="text-gray-400">/</span>
        <span className="text-blue-500">{Math.round(forecast.tempMin)}°</span>
      </div>
    </div>
  )
}