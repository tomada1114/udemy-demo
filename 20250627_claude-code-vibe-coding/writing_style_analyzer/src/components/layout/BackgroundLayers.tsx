/**
 * 3層構造の背景グラデーションシステム
 * Apple風デザインに基づく美しい多層背景
 */

import React from 'react'
import { BACKGROUND_LAYERS } from '@/lib/design-system'
import { cn } from '@/lib/design-utils'

interface BackgroundLayersProps {
  className?: string
  children?: React.ReactNode
}

/**
 * 3層構造の背景システムコンポーネント
 * - ベースグラデーション
 * - 装飾レイヤー1（全体的な色彩調整）
 * - 装飾レイヤー2,3（blur円による奥行き効果）
 */
export function BackgroundLayers({ className, children }: BackgroundLayersProps) {
  return (
    <div className={cn(BACKGROUND_LAYERS.base, className)}>
      {/* 装飾レイヤー1: 全体的な色彩調整 */}
      <div className={BACKGROUND_LAYERS.decoration1} />
      
      {/* 装飾レイヤー2: 大きなblur円（右上） */}
      <div className={BACKGROUND_LAYERS.decoration2} />
      
      {/* 装飾レイヤー3: 小さなblur円（左下） */}
      <div className={BACKGROUND_LAYERS.decoration3} />
      
      {/* メインコンテンツ */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}