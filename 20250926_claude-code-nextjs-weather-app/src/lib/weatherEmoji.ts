/**
 * OpenWeatherMapのアイコンコードを絵文字にマッピング
 */

const weatherEmojiMap: Record<string, string> = {
  // 晴れ
  '01d': '☀️',  // clear sky (day)
  '01n': '🌙',  // clear sky (night)
  
  // 薄曇り
  '02d': '⛅',  // few clouds (day)
  '02n': '☁️',  // few clouds (night)
  
  // 曇り
  '03d': '☁️',  // scattered clouds
  '03n': '☁️',
  '04d': '☁️',  // broken clouds
  '04n': '☁️',
  
  // 雨
  '09d': '🌧️',  // shower rain
  '09n': '🌧️',
  '10d': '🌦️',  // rain (day)
  '10n': '🌧️',  // rain (night)
  
  // 雷雨
  '11d': '⛈️',  // thunderstorm
  '11n': '⛈️',
  
  // 雪
  '13d': '❄️',  // snow
  '13n': '❄️',
  
  // 霧
  '50d': '🌫️',  // mist
  '50n': '🌫️',
}

/**
 * アイコンコードから絵文字を取得
 * @param iconCode OpenWeatherMapのアイコンコード
 * @returns 対応する絵文字（見つからない場合はデフォルト）
 */
export function getWeatherEmoji(iconCode: string): string {
  return weatherEmojiMap[iconCode] || '🌡️' // デフォルトは温度計
}

/**
 * 絵文字のサイズクラスを取得
 * @param size 'large' | 'medium' | 'small'
 * @returns Tailwindのテキストサイズクラス
 */
export function getEmojiSizeClass(size: 'large' | 'medium' | 'small' = 'medium'): string {
  const sizeClasses = {
    large: 'text-7xl',
    medium: 'text-4xl',
    small: 'text-2xl',
  }
  return sizeClasses[size]
}