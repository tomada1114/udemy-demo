import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文体分析 - Writing Style Analyzer',
  description: 'あなたの文章を AI で分析し、独自の文体やライティングルールを抽出します。Gemini AIによる高精度な文体分析。',
  keywords: ['文体分析', 'AI分析', 'ライティング', 'Gemini', '文章解析'],
  openGraph: {
    title: '文体分析 - Writing Style Analyzer',
    description: 'AIであなたの文体を分析し、ライティングルールを生成',
    type: 'website',
  }
}

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}