/**
 * ローディング中に表示されるスケルトンスクリーン
 */
export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Current Weather Skeleton */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8">
        <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="ml-4">
            <div className="h-12 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Forecast Skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 現在の天気用の小さなスケルトン
 */
export function CurrentWeatherSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="ml-4">
          <div className="h-12 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

/**
 * 予報リスト用のスケルトン
 */
export function ForecastListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}