/**
 * カスタムエラークラスの定義
 */

export class WeatherAppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NetworkError extends WeatherAppError {
  constructor(message = 'ネットワーク接続を確認してください') {
    super(message, 'NETWORK_ERROR', 503)
  }
}

export class APILimitError extends WeatherAppError {
  constructor(message = 'APIの利用制限に達しました。しばらくお待ちください') {
    super(message, 'API_LIMIT_ERROR', 429)
  }
}

export class CityNotFoundError extends WeatherAppError {
  constructor(cityName: string) {
    super(
      `「${cityName}」という都市が見つかりませんでした。別の都市名をお試しください。`,
      'CITY_NOT_FOUND',
      404
    )
  }
}

export class InvalidAPIKeyError extends WeatherAppError {
  constructor(message = 'APIキーが設定されていません') {
    super(message, 'INVALID_API_KEY', 500)
  }
}

export class DataParsingError extends WeatherAppError {
  constructor(message = 'データの解析に失敗しました') {
    super(message, 'DATA_PARSING_ERROR', 500)
  }
}

/**
 * エラータイプを判別してメッセージを返す
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof WeatherAppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    // APIエラーメッセージの解析
    if (error.message.includes('not found') || error.message.includes('404')) {
      return '指定された都市が見つかりませんでした'
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'ネットワーク接続を確認してください'
    }
    if (error.message.includes('429') || error.message.includes('limit')) {
      return 'APIの利用制限に達しました。しばらくお待ちください'
    }
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return 'APIキーが無効です'
    }
    
    return error.message
  }
  
  return '予期しないエラーが発生しました'
}

/**
 * HTTPステータスコードからエラーを生成
 */
export function createErrorFromStatus(status: number, city?: string): WeatherAppError {
  switch (status) {
    case 404:
      return new CityNotFoundError(city || '指定された都市')
    case 429:
      return new APILimitError()
    case 401:
      return new InvalidAPIKeyError('APIキーが無効です')
    case 503:
    case 502:
    case 500:
      return new NetworkError('サーバーとの通信に失敗しました')
    default:
      return new WeatherAppError(
        'リクエストの処理中にエラーが発生しました',
        'UNKNOWN_ERROR',
        status
      )
  }
}