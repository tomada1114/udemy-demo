/**
 * テーマカラー管理用カスタムフック
 */

import { useState, useCallback, useEffect } from 'react'
import { ThemeColor } from '@/types/design'
import { THEME_COLORS, getColorClass, getAccentColor } from '@/lib/design-system'

const STORAGE_KEY = 'writing-style-analyzer-theme-color'

export interface UseThemeColorReturn {
  currentColor: ThemeColor
  setColor: (color: ThemeColor) => void
  colorClass: string
  accentColor: string
  availableColors: typeof THEME_COLORS
  isSelected: (color: ThemeColor) => boolean
}

/**
 * テーマカラーの選択と管理を行うフック
 */
export const useThemeColor = (defaultColor: ThemeColor = 'ocean'): UseThemeColorReturn => {
  const [currentColor, setCurrentColor] = useState<ThemeColor>(defaultColor)

  // ローカルストレージからテーマカラーを読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && THEME_COLORS.some(theme => theme.value === saved)) {
        setCurrentColor(saved as ThemeColor)
      }
    } catch (error) {
      console.warn('Failed to load theme color from localStorage:', error)
    }
  }, [])

  // テーマカラーを設定し、ローカルストレージに保存
  const setColor = useCallback((color: ThemeColor) => {
    setCurrentColor(color)
    try {
      localStorage.setItem(STORAGE_KEY, color)
    } catch (error) {
      console.warn('Failed to save theme color to localStorage:', error)
    }
  }, [])

  // 現在のカラークラスを取得
  const colorClass = getColorClass(currentColor)

  // 現在のアクセントカラーを取得
  const accentColor = getAccentColor(currentColor)

  // 指定されたカラーが選択されているかチェック
  const isSelected = useCallback((color: ThemeColor) => {
    return currentColor === color
  }, [currentColor])

  return {
    currentColor,
    setColor,
    colorClass,
    accentColor,
    availableColors: THEME_COLORS,
    isSelected
  }
}