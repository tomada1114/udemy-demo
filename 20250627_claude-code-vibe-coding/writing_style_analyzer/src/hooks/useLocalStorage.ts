/**
 * localStorage管理用カスタムフック
 */

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((val: T) => T)

/**
 * localStorage との同期を行う汎用フック
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  
  // 初期値を取得する関数
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // 状態の初期化
  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  // 値を設定する関数
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // 値を削除する関数
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // コンポーネントマウント時に localStorage から値を読み込み
  useEffect(() => {
    setStoredValue(getStoredValue())
  }, [getStoredValue])

  // localStorage の変更を監視（他のタブでの変更を検知）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
    
    // SSR環境では何もしない
    return undefined
  }, [key])

  return [storedValue, setValue, removeValue]
}