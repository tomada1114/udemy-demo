/**
 * デザインシステム用ユーティリティ関数
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { 
  ThemeColor, 
  GlassmorphismVariant, 
  ShadowIntensity, 
  ComponentState 
} from '@/types/design'
import { 
  THEME_COLORS, 
  GLASSMORPHISM_STYLES, 
  ANIMATIONS 
} from '@/lib/design-system'

/**
 * Tailwind CSSクラスを結合し、重複を除去
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * テーマカラーに基づいてカスタムシャドウを生成
 */
export function createCustomShadow(
  color: ThemeColor, 
  intensity: ShadowIntensity = 'lg'
): React.CSSProperties {
  const accentColor = THEME_COLORS.find(theme => theme.value === color)?.accent ?? '#60A5FA'
  
  const shadowConfigs = {
    sm: {
      boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px ${accentColor}22`
    },
    md: {
      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px ${accentColor}22`
    },
    lg: {
      boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${accentColor}22`
    },
    xl: {
      boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${accentColor}33`
    },
    xxl: {
      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${accentColor}33`
    }
  }
  
  return shadowConfigs[intensity]
}

/**
 * コンポーネント状態に基づいてスタイルクラスを生成
 */
export function getStateClasses(
  state: ComponentState,
  baseClasses: string = ''
): string {
  const stateClasses = {
    default: '',
    hover: 'hover:scale-105 hover:shadow-xl',
    active: 'scale-[1.02] shadow-2xl',
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'animate-pulse cursor-wait'
  }
  
  return cn(baseClasses, stateClasses[state], ANIMATIONS.base)
}

/**
 * Glassmorphismスタイルを取得
 */
export function getGlassmorphismClass(variant: GlassmorphismVariant): string {
  return GLASSMORPHISM_STYLES[variant]
}

/**
 * レスポンシブパディングクラスを生成
 */
export function getResponsivePadding(
  mobile: number = 4,
  tablet: number = 6,
  desktop: number = 8
): string {
  return `px-${mobile} md:px-${tablet} lg:px-${desktop}`
}

/**
 * グリッドレイアウトクラスを生成
 */
export function getResponsiveGrid(
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3
): string {
  return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`
}

/**
 * テキストサイズをレスポンシブに設定
 */
export function getResponsiveText(
  mobile: string = 'text-lg',
  tablet: string = 'text-xl',
  desktop: string = 'text-2xl'
): string {
  return `${mobile} md:${tablet} lg:${desktop}`
}

/**
 * アクセシビリティ対応のフォーカススタイル
 */
export function getFocusClasses(): string {
  return 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
}

/**
 * ホバー時のマイクロインタラクション
 */
export function getMicroInteraction(type: 'scale' | 'rotate' | 'float' = 'scale'): string {
  const interactions = {
    scale: 'hover:scale-110',
    rotate: 'hover:rotate-6',
    float: 'hover:-translate-y-1'
  }
  
  return cn(interactions[type], ANIMATIONS.base)
}

/**
 * 背景グラデーションを動的に生成
 */
export function createDynamicGradient(
  color1: string,
  color2: string,
  direction: string = 'to-br'
): string {
  return `bg-gradient-${direction} from-${color1} to-${color2}`
}

/**
 * カードコンポーネント用の完全なスタイルクラス
 */
export function getCardClasses(
  color: ThemeColor,
  interactive: boolean = true,
  active: boolean = false
): string {
  const baseClasses = cn(
    'relative w-full p-6 rounded-2xl',
    getGlassmorphismClass('card'),
    THEME_COLORS.find(t => t.value === color)?.class,
    ANIMATIONS.base
  )
  
  if (!interactive) return baseClasses
  
  return cn(
    baseClasses,
    'cursor-pointer',
    active ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl',
    interactive ? 'hover:scale-[1.01]' : ''
  )
}

/**
 * ボタンコンポーネント用のスタイルクラス
 */
export function getButtonClasses(
  variant: 'primary' | 'secondary' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700',
    secondary: cn(getGlassmorphismClass('button'), 'text-gray-700'),
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  }
  
  return cn(
    'font-semibold rounded-xl transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant],
    getFocusClasses(),
    'hover:scale-105'
  )
}