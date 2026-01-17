import type { Forecast } from '@/types/weather'
import WeatherCard from './WeatherCard'

interface ForecastListProps {
  forecasts: Forecast[]
}

export default function ForecastList({ forecasts }: ForecastListProps) {
  if (forecasts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        予報データがありません
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {forecasts.map((forecast, index) => (
        <WeatherCard
          key={`${forecast.date}-${index}`}
          forecast={forecast}
        />
      ))}
    </div>
  )
}