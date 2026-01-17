/**
 * デザインシステム用型定義
 */

import { THEME_COLORS } from '@/lib/design-system'

// テーマカラー型
export type ThemeColor = typeof THEME_COLORS[number]['value']

// テーマカラー設定型
export interface ThemeColorConfig {
  name: string
  class: string
  value: ThemeColor
  accent: string
}

// コンポーネントサイズ型
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'

// グラデーション方向型
export type GradientDirection = 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'

// アニメーションタイプ
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce'

// レスポンシブブレークポイント
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

// コンポーネント状態
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading'

// Glassmorphismバリアント
export type GlassmorphismVariant = 'header' | 'card' | 'button' | 'panel'

// 影の強度
export type ShadowIntensity = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'