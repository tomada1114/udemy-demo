import { AppLayout } from '@/components/layout/AppLayout'
import { getGlassmorphismClass, cn, getButtonClasses } from '@/lib/design-utils'
import { TYPOGRAPHY } from '@/lib/design-system'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing Style Analyzer - AI時代の個人らしさを守る',
  description: 'AIが生み出す時代だからこそ、あなたらしい文体を見つけて活用しよう。文体分析でライティングルールを自動生成。',
  keywords: ['文体分析', 'AI', 'ライティング', 'Gemini', '文章分析'],
  openGraph: {
    title: 'Writing Style Analyzer',
    description: 'AI時代の個人らしさを守る文体分析アプリ',
    type: 'website',
  }
}

export default function Home() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-12">
        {/* メインタイトル */}
        <div className="text-center mb-12">
          <h1 className={cn(
            'text-4xl md:text-5xl font-bold mb-4',
            TYPOGRAPHY.gradientTitle
          )}>
            Writing Style Analyzer
          </h1>
          <p className={cn(
            'text-lg md:text-xl',
            TYPOGRAPHY.subtitle
          )}>
            AI時代の個人らしさを守る文体分析アプリ
          </p>
        </div>

        {/* メインコンテンツカード */}
        <div className={cn(
          'p-8 md:p-12',
          getGlassmorphismClass('card')
        )}>
          <div className="text-center space-y-6">
            {/* アイコン装飾 */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
                <svg 
                  className="w-16 h-16 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </div>
              {/* 装飾ドット */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            </div>

            <h2 className={cn(
              'text-2xl md:text-3xl font-bold mb-4',
              TYPOGRAPHY.gradientTitle
            )}>
              あなただけの文体を分析
            </h2>

            <p className={cn(
              'text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto',
              TYPOGRAPHY.body
            )}>
              AIが進歩する中で、あなた独自の文体やライティングスタイルを守りませんか？
              このアプリでは、入力されたテキストから文体の特徴を抽出し、
              AIツールで活用しやすい形式で出力します。
            </p>

            {/* 機能紹介カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              {[
                {
                  icon: "📝",
                  title: "文体分析",
                  description: "最大2000文字のテキストから文体の特徴を抽出"
                },
                {
                  icon: "🎯",
                  title: "ルール生成",
                  description: "AIツールで使えるライティングルールを自動生成"
                },
                {
                  icon: "📋",
                  title: "簡単コピー",
                  description: "ワンクリックで結果をクリップボードにコピー"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-6 rounded-xl',
                    getGlassmorphismClass('card'),
                    'hover:scale-105 hover:shadow-xl hover:-translate-y-2 transition-all duration-200'
                  )}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className={cn('text-sm', TYPOGRAPHY.muted)}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="/analyzer"
                className={cn(
                  getButtonClasses('primary', 'lg'),
                  'inline-flex items-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:scale-105'
                )}
              >
                分析を始める
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
