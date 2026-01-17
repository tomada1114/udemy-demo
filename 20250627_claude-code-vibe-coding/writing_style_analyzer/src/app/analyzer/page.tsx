/**
 * 文体分析アプリケーションのメインページ
 */

'use client'

import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { TextInputCard } from '@/components/features/TextInput'
import { AnalysisCard } from '@/components/features/Analysis'
import { Button } from '@/components/ui/button'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useHistory } from '@/hooks/useHistory'
import { useThemeColor } from '@/hooks/useThemeColor'
import { History } from 'lucide-react'
import Link from 'next/link'

export default function AnalyzerPage() {
  const [inputText, setInputText] = useState('')
  const { analyze, result, status, error, reset } = useAnalysis()
  const { addToHistory } = useHistory()
  const { currentColor } = useThemeColor()

  // 分析実行
  const handleAnalyze = async () => {
    await analyze(inputText)
  }

  // 分析結果が出たら履歴に追加
  React.useEffect(() => {
    if (result) {
      addToHistory(result)
    }
  }, [result, addToHistory])

  // 結果をクリアして新しい分析を開始
  const handleNewAnalysis = () => {
    setInputText('')
    reset()
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">文体分析</h1>
              <p className="text-gray-600">あなたの文章の特徴をAIが分析します</p>
            </div>
            <Link href="/history" className="cursor-pointer">
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 flex items-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <History className="w-4 h-4" />
                履歴を見る
              </Button>
            </Link>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="font-semibold">エラーが発生しました</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="max-w-3xl mx-auto">
          {!result ? (
            // 入力フォーム
            <TextInputCard
              value={inputText}
              onChange={setInputText}
              onAnalyze={handleAnalyze}
              isAnalyzing={status === 'analyzing'}
              themeColor={currentColor}
            />
          ) : (
            // 分析結果
            <AnalysisCard
              result={result}
              themeColor={currentColor}
              onClose={handleNewAnalysis}
            />
          )}
        </div>

        {/* プログレス表示（分析中） */}
        {status === 'analyzing' && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="loading-title"
            aria-describedby="loading-description"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30">
              <div className="flex flex-col items-center space-y-4">
                {/* ローディングアニメーション */}
                <div className="relative w-16 h-16" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-white rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className="w-8 h-8 text-blue-600 animate-spin" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 id="loading-title" className="text-lg font-semibold text-gray-800">
                    文体を分析中...
                  </h3>
                  <p id="loading-description" className="text-sm text-gray-600 mt-1">
                    AIがあなたの文章の特徴を抽出しています
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フッター情報 */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            このアプリケーションは Google Gemini AI を使用しています。
            <br />
            無料枠での利用はサービス改善に使用される場合があります。
          </p>
        </div>
      </div>
    </AppLayout>
  )
}