/**
 * デザインシステムのテスト
 */

import { describe, it, expect } from 'vitest'
import { 
  THEME_COLORS, 
  getColorClass, 
  getAccentColor 
} from '@/lib/design-system'
import { ThemeColor } from '@/types/design'

describe('Design System', () => {
  describe('THEME_COLORS', () => {
    it('8色のテーマカラーが定義されている', () => {
      expect(THEME_COLORS).toHaveLength(8)
    })

    it('各テーマカラーが必要なプロパティを持つ', () => {
      THEME_COLORS.forEach(theme => {
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('class')
        expect(theme).toHaveProperty('value')
        expect(theme).toHaveProperty('accent')
        
        expect(typeof theme.name).toBe('string')
        expect(typeof theme.class).toBe('string')
        expect(typeof theme.value).toBe('string')
        expect(typeof theme.accent).toBe('string')
      })
    })

    it('各テーマカラーのクラスが適切なフォーマット', () => {
      THEME_COLORS.forEach(theme => {
        expect(theme.class).toContain('bg-gradient-to-br')
        expect(theme.class).toContain('from-')
        expect(theme.class).toContain('to-')
        expect(theme.class).toContain('border-')
      })
    })

    it('アクセントカラーがHEX形式', () => {
      THEME_COLORS.forEach(theme => {
        expect(theme.accent).toMatch(/^#[0-9A-F]{6}$/i)
      })
    })

    it('すべてのvalue値が一意', () => {
      const values = THEME_COLORS.map(theme => theme.value)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(values.length)
    })
  })

  describe('getColorClass', () => {
    it('有効なテーマカラーのクラスを返す', () => {
      const colorClass = getColorClass('ocean')
      expect(colorClass).toContain('from-sky-100')
      expect(colorClass).toContain('to-blue-200')
    })

    it('存在しないカラーの場合はデフォルトを返す', () => {
      const colorClass = getColorClass('nonexistent' as ThemeColor)
      const defaultClass = THEME_COLORS[0]!.class
      expect(colorClass).toBe(defaultClass)
    })

    it('すべての定義済みカラーで正しいクラスを返す', () => {
      THEME_COLORS.forEach(theme => {
        const colorClass = getColorClass(theme.value)
        expect(colorClass).toBe(theme.class)
      })
    })
  })

  describe('getAccentColor', () => {
    it('有効なテーマカラーのアクセントカラーを返す', () => {
      const accentColor = getAccentColor('blossom')
      expect(accentColor).toBe('#FB7185')
    })

    it('存在しないカラーの場合はデフォルトを返す', () => {
      const accentColor = getAccentColor('nonexistent' as ThemeColor)
      const defaultAccent = THEME_COLORS[0]!.accent
      expect(accentColor).toBe(defaultAccent)
    })

    it('すべての定義済みカラーで正しいアクセントカラーを返す', () => {
      THEME_COLORS.forEach(theme => {
        const accentColor = getAccentColor(theme.value)
        expect(accentColor).toBe(theme.accent)
      })
    })
  })

  describe('テーマカラーの一貫性チェック', () => {
    it('サンシャイン（sunshine）のプロパティが正しい', () => {
      const sunshine = THEME_COLORS.find(t => t.value === 'sunshine')
      expect(sunshine).toBeDefined()
      expect(sunshine?.name).toBe('サンシャイン')
      expect(sunshine?.accent).toBe('#FCD34D')
    })

    it('オーシャン（ocean）のプロパティが正しい', () => {
      const ocean = THEME_COLORS.find(t => t.value === 'ocean')
      expect(ocean).toBeDefined()
      expect(ocean?.name).toBe('オーシャン')
      expect(ocean?.accent).toBe('#60A5FA')
    })

    it('フォレスト（forest）のプロパティが正しい', () => {
      const forest = THEME_COLORS.find(t => t.value === 'forest')
      expect(forest).toBeDefined()
      expect(forest?.name).toBe('フォレスト')
      expect(forest?.accent).toBe('#34D399')
    })

    it('ラベンダー（lavender）のプロパティが正しい', () => {
      const lavender = THEME_COLORS.find(t => t.value === 'lavender')
      expect(lavender).toBeDefined()
      expect(lavender?.name).toBe('ラベンダー')
      expect(lavender?.accent).toBe('#A78BFA')
    })
  })
})