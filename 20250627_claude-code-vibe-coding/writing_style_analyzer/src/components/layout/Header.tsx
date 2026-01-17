/**
 * Glassmorphismヘッダーコンポーネント
 * Apple風デザインに基づく半透明ヘッダー
 */

import React from 'react'
import Link from 'next/link'
import { getGlassmorphismClass } from '@/lib/design-utils'
import { TYPOGRAPHY } from '@/lib/design-system'
import { cn } from '@/lib/design-utils'

interface HeaderProps {
  className?: string
}

/**
 * アプリケーションヘッダー
 * 固定ポジションのGlassmorphismデザイン
 */
export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50',
      getGlassmorphismClass('header'),
      className
    )}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* ブランドセクション */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 cursor-pointer hover:scale-105">
            {/* アイコン */}
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg 
                className="w-6 h-6 text-white" 
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
            
            {/* ブランド名 */}
            <div>
              <h1 className={cn(
                'text-xl font-bold',
                TYPOGRAPHY.gradientTitle
              )}>
                Writing Style Analyzer
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                AI時代の個人らしさを守る
              </p>
            </div>
          </Link>
          
          {/* 右側のアクション */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/analyzer" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-white/20 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
              >
                分析する
              </Link>
              <Link 
                href="/history" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-white/20 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
              >
                履歴
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}