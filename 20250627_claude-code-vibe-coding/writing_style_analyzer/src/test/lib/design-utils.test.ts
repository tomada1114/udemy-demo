/**
 * デザインユーティリティのテスト
 */

import { describe, it, expect } from 'vitest'
import { ThemeColor } from '@/types/design'
import {
  cn,
  createCustomShadow,
  getStateClasses,
  getGlassmorphismClass,
  getResponsivePadding,
  getResponsiveGrid,
  getResponsiveText,
  getFocusClasses,
  getMicroInteraction,
  createDynamicGradient,
  getCardClasses,
  getButtonClasses
} from '@/lib/design-utils'

describe('Design Utils', () => {
  describe('cn (classnames utility)', () => {
    it('複数のクラス名を結合する', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('条件付きクラス名を処理する', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('hidden')
    })

    it('重複するクラス名を適切に処理する', () => {
      const result = cn('p-4', 'p-6') // Tailwind CSSでは後者が優先される
      expect(result).toContain('p-6')
    })
  })

  describe('createCustomShadow', () => {
    it('カスタムシャドウスタイルを生成する', () => {
      const shadow = createCustomShadow('ocean', 'lg')
      expect(shadow).toHaveProperty('boxShadow')
      expect(shadow.boxShadow).toContain('#60A5FA')
    })

    it('異なる強度のシャドウを生成する', () => {
      const shadowSm = createCustomShadow('ocean', 'sm')
      const shadowXl = createCustomShadow('ocean', 'xl')
      
      expect(shadowSm.boxShadow).toBeDefined()
      expect(shadowXl.boxShadow).toBeDefined()
      expect(shadowSm.boxShadow).not.toBe(shadowXl.boxShadow)
    })

    it('存在しないカラーでもデフォルトカラーでシャドウを生成する', () => {
      const shadow = createCustomShadow('nonexistent' as ThemeColor, 'md')
      expect(shadow.boxShadow).toContain('#60A5FA') // デフォルトカラー
    })
  })

  describe('getStateClasses', () => {
    it('デフォルト状態のクラスを返す', () => {
      const classes = getStateClasses('default')
      expect(classes).toContain('transition-all')
    })

    it('ホバー状態のクラスを返す', () => {
      const classes = getStateClasses('hover')
      expect(classes).toContain('hover:scale-105')
      expect(classes).toContain('hover:shadow-xl')
    })

    it('無効状態のクラスを返す', () => {
      const classes = getStateClasses('disabled')
      expect(classes).toContain('opacity-50')
      expect(classes).toContain('cursor-not-allowed')
    })

    it('ベースクラスと状態クラスを結合する', () => {
      const classes = getStateClasses('active', 'bg-blue-500')
      expect(classes).toContain('bg-blue-500')
      expect(classes).toContain('scale-[1.02]')
    })
  })

  describe('getGlassmorphismClass', () => {
    it('ヘッダー用glassmorphismクラスを返す', () => {
      const headerClass = getGlassmorphismClass('header')
      expect(headerClass).toContain('backdrop-blur-xl')
      expect(headerClass).toContain('bg-white/70')
    })

    it('カード用glassmorphismクラスを返す', () => {
      const cardClass = getGlassmorphismClass('card')
      expect(cardClass).toContain('backdrop-blur-xl')
      expect(cardClass).toContain('rounded-2xl')
    })

    it('ボタン用glassmorphismクラスを返す', () => {
      const buttonClass = getGlassmorphismClass('button')
      expect(buttonClass).toContain('backdrop-blur-sm')
      expect(buttonClass).toContain('hover:bg-white/60')
    })
  })

  describe('getResponsivePadding', () => {
    it('レスポンシブパディングクラスを生成する', () => {
      const padding = getResponsivePadding(4, 6, 8)
      expect(padding).toBe('px-4 md:px-6 lg:px-8')
    })

    it('デフォルト値でパディングクラスを生成する', () => {
      const padding = getResponsivePadding()
      expect(padding).toBe('px-4 md:px-6 lg:px-8')
    })
  })

  describe('getResponsiveGrid', () => {
    it('レスポンシブグリッドクラスを生成する', () => {
      const grid = getResponsiveGrid(1, 2, 3)
      expect(grid).toBe('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
    })

    it('デフォルト値でグリッドクラスを生成する', () => {
      const grid = getResponsiveGrid()
      expect(grid).toBe('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
    })
  })

  describe('getResponsiveText', () => {
    it('レスポンシブテキストクラスを生成する', () => {
      const text = getResponsiveText('text-sm', 'text-md', 'text-lg')
      expect(text).toBe('text-sm md:text-md lg:text-lg')
    })

    it('デフォルト値でテキストクラスを生成する', () => {
      const text = getResponsiveText()
      expect(text).toBe('text-lg md:text-xl lg:text-2xl')
    })
  })

  describe('getFocusClasses', () => {
    it('アクセシビリティ対応のフォーカスクラスを返す', () => {
      const focusClasses = getFocusClasses()
      expect(focusClasses).toContain('focus:outline-none')
      expect(focusClasses).toContain('focus:ring-2')
      expect(focusClasses).toContain('focus:ring-blue-500')
    })
  })

  describe('getMicroInteraction', () => {
    it('スケールマイクロインタラクションを返す', () => {
      const interaction = getMicroInteraction('scale')
      expect(interaction).toContain('hover:scale-110')
      expect(interaction).toContain('transition-all')
    })

    it('回転マイクロインタラクションを返す', () => {
      const interaction = getMicroInteraction('rotate')
      expect(interaction).toContain('hover:rotate-6')
    })

    it('フロートマイクロインタラクションを返す', () => {
      const interaction = getMicroInteraction('float')
      expect(interaction).toContain('hover:-translate-y-1')
    })
  })

  describe('createDynamicGradient', () => {
    it('動的グラデーションクラスを生成する', () => {
      const gradient = createDynamicGradient('red-500', 'blue-500', 'to-r')
      expect(gradient).toBe('bg-gradient-to-r from-red-500 to-blue-500')
    })

    it('デフォルト方向でグラデーションを生成する', () => {
      const gradient = createDynamicGradient('red-500', 'blue-500')
      expect(gradient).toBe('bg-gradient-to-br from-red-500 to-blue-500')
    })
  })

  describe('getCardClasses', () => {
    it('基本的なカードクラスを生成する', () => {
      const cardClasses = getCardClasses('ocean', false, false)
      expect(cardClasses).toContain('relative')
      expect(cardClasses).toContain('rounded-2xl')
      expect(cardClasses).toContain('from-sky-100')
    })

    it('インタラクティブなカードクラスを生成する', () => {
      const cardClasses = getCardClasses('ocean', true, false)
      expect(cardClasses).toContain('cursor-pointer')
      expect(cardClasses).toContain('hover:scale-[1.01]')
    })

    it('アクティブなカードクラスを生成する', () => {
      const cardClasses = getCardClasses('ocean', true, true)
      expect(cardClasses).toContain('shadow-2xl')
      expect(cardClasses).toContain('scale-[1.02]')
    })
  })

  describe('getButtonClasses', () => {
    it('プライマリボタンクラスを生成する', () => {
      const buttonClasses = getButtonClasses('primary', 'md')
      expect(buttonClasses).toContain('bg-gradient-to-r')
      expect(buttonClasses).toContain('from-blue-500')
      expect(buttonClasses).toContain('px-6')
      expect(buttonClasses).toContain('py-3')
    })

    it('セカンダリボタンクラスを生成する', () => {
      const buttonClasses = getButtonClasses('secondary', 'sm')
      expect(buttonClasses).toContain('backdrop-blur-sm')
      expect(buttonClasses).toContain('px-3')
      expect(buttonClasses).toContain('py-1.5')
    })

    it('ゴーストボタンクラスを生成する', () => {
      const buttonClasses = getButtonClasses('ghost', 'lg')
      expect(buttonClasses).toContain('bg-transparent')
      expect(buttonClasses).toContain('hover:bg-gray-100')
      expect(buttonClasses).toContain('px-8')
      expect(buttonClasses).toContain('py-4')
    })

    it('フォーカスとアニメーションクラスが含まれる', () => {
      const buttonClasses = getButtonClasses('primary')
      expect(buttonClasses).toContain('focus:outline-none')
      expect(buttonClasses).toContain('hover:scale-105')
    })
  })
})