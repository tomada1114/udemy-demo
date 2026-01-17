/**
 * 文体分析APIエンドポイント
 * Next.js App Router API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { GeminiApiClient, GeminiApiError } from '@/lib/gemini-api'
import { AnalysisRequest } from '@/types/app'

// Gemini API クライアントの初期化
console.log('GEMINI_API_KEY available:', !!process.env.GEMINI_API_KEY)
const geminiClient = new GeminiApiClient(process.env.GEMINI_API_KEY)

/**
 * POST /api/analyze
 * 文体分析を実行するエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body: AnalysisRequest = await request.json()
    
    // バリデーション
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'テキストが提供されていません' },
        { status: 400 }
      )
    }

    // 入力テキストのサニタイゼーション（危険な文字列の除去）
    const sanitizedText = body.text
      .replace(/[<>]/g, '') // HTMLタグ防止
      .replace(/javascript:/gi, '') // JavaScript URL防止
      .trim()

    if (sanitizedText.length === 0) {
      return NextResponse.json(
        { error: 'テキストが空です' },
        { status: 400 }
      )
    }

    if (sanitizedText.length > 2000) {
      return NextResponse.json(
        { error: '文字数が制限を超えています（最大2000文字）' },
        { status: 400 }
      )
    }

    // Gemini API で分析実行（サニタイズされたテキストを使用）
    const analysisResult = await geminiClient.analyzeWritingStyle(sanitizedText)

    // レスポンスを返す（セキュリティヘッダー付き）
    const response = NextResponse.json({
      analysis: analysisResult,
      characterCount: body.characterCount || sanitizedText.length,
      timestamp: Date.now()
    })

    // セキュリティヘッダーの追加
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response

  } catch (error) {
    // エラーハンドリング
    console.error('Error in analyze API:', error)
    
    if (error instanceof GeminiApiError) {
      console.error('Gemini API Error:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      })
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code 
        },
        { status: error.statusCode || 500 }
      )
    }

    // 予期しないエラー
    console.error('Unexpected error in analyze API:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * その他のHTTPメソッドはサポートしない
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}