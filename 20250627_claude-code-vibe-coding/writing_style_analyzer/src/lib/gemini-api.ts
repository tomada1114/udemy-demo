/**
 * Gemini AI API クライアント
 * 文体分析のためのAPI通信を管理
 */

import { GeminiApiResponse } from '@/types/app'

// Gemini API設定
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent'
// API キーはサーバーサイドでのみ使用（NEXT_PUBLIC_ プレフィックスは削除）
const API_KEY = process.env.GEMINI_API_KEY || ''

// エラーメッセージ
const ERROR_MESSAGES = {
  NO_API_KEY: 'Gemini API キーが設定されていません',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  API_ERROR: 'API エラーが発生しました',
  INVALID_RESPONSE: '無効なレスポンスです'
} as const

/**
 * Gemini API リクエストオプション
 */
interface GeminiRequestOptions {
  prompt: string
  maxOutputTokens?: number
  temperature?: number
  topP?: number
  topK?: number
}

/**
 * Gemini API エラー
 */
export class GeminiApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'GeminiApiError'
  }
}

/**
 * Gemini API クライアントクラス
 */
export class GeminiApiClient {
  private apiKey: string

  constructor(apiKey?: string) {
    // サーバーサイドでは process.env.GEMINI_API_KEY を直接使用
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || API_KEY
    
    if (!this.apiKey) {
      throw new GeminiApiError(ERROR_MESSAGES.NO_API_KEY, 'NO_API_KEY')
    }
  }

  /**
   * 文体分析を実行
   */
  async analyzeWritingStyle(text: string): Promise<string> {
    const prompt = this.createAnalysisPrompt(text)
    
    try {
      const response = await this.generateContent({
        prompt,
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      })

      return response.text
    } catch (error) {
      if (error instanceof GeminiApiError) {
        throw error
      }
      throw new GeminiApiError(
        ERROR_MESSAGES.NETWORK_ERROR,
        'NETWORK_ERROR'
      )
    }
  }

  /**
   * Gemini API にコンテンツ生成リクエストを送信
   */
  private async generateContent(options: GeminiRequestOptions): Promise<GeminiApiResponse> {
    const { prompt, maxOutputTokens = 1024, temperature = 0.7, topP = 0.95, topK = 40 } = options

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature,
        topK,
        topP,
        maxOutputTokens,
        stopSequences: []
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new GeminiApiError(
        errorData.error?.message || ERROR_MESSAGES.API_ERROR,
        errorData.error?.code || 'API_ERROR',
        response.status
      )
    }

    const data = await response.json()

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new GeminiApiError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        'INVALID_RESPONSE'
      )
    }

    return {
      text: data.candidates[0].content.parts[0].text,
      finishReason: data.candidates[0].finishReason,
      safetyRatings: data.candidates[0].safetyRatings
    }
  }

  /**
   * 文体分析用のプロンプトを生成
   */
  private createAnalysisPrompt(text: string): string {
    return `あなたは熟練した文体分析の専門家です。以下の文章を分析し、著者の文体の特徴を抽出してください。

【分析対象の文章】
${text}

【分析項目】
以下の観点から文体の特徴を分析し、Markdown形式で出力してください：

## 1. 文体の全体的な印象
- トーン（フォーマル/カジュアル/親しみやすい/専門的など）
- リズムと流れ
- 読者との距離感

## 2. 語彙と表現の特徴
- よく使用する単語や表現
- 専門用語の使用頻度
- 比喩や修辞技法

## 3. 文構造の特徴
- 文の長さの傾向
- 句読点の使い方
- 段落構成のパターン

## 4. 個性的な要素
- 独特な言い回し
- 繰り返し使われるパターン
- 著者らしさが表れている部分

## 5. AIツール用ライティングルール
上記の分析を基に、この文体を再現するための具体的なルールを5〜7個程度、箇条書きで提示してください。

【注意事項】
- 分析は客観的かつ建設的に行ってください
- 個人を特定する情報は含めないでください
- 実用的で具体的なアドバイスを心がけてください`
  }
}

// デフォルトのクライアントインスタンス
export const geminiClient = new GeminiApiClient()