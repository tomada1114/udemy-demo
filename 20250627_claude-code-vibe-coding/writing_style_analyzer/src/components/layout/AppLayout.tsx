/**
 * アプリケーションメインレイアウト
 * Apple風デザインシステムに基づくレスポンシブレイアウト
 */

import React from 'react'
import { BackgroundLayers } from './BackgroundLayers'
import { Header } from './Header'
import { cn } from '@/lib/design-utils'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
}

/**
 * アプリケーション全体のレイアウトコンポーネント
 */
export function AppLayout({ 
  children, 
  className, 
  showHeader = true 
}: AppLayoutProps) {
  return (
    <BackgroundLayers className={cn('relative', className)}>
      {/* ヘッダー */}
      {showHeader && <Header />}
      
      {/* メインコンテンツエリア */}
      <main className={cn(
        'container mx-auto px-4 md:px-6 lg:px-8',
        showHeader ? 'pt-20' : 'pt-8', // ヘッダーがある場合は上部マージンを追加
        'pb-8 min-h-screen'
      )}>
        {children}
      </main>
    </BackgroundLayers>
  )
}