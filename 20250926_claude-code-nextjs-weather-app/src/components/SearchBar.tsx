'use client'

import { useState, FormEvent, useId } from 'react'

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading?: boolean
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const inputId = useId()
  const errorId = useId()
  const helpId = useId()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedCity = city.trim()
    
    if (!trimmedCity) {
      setError('都市名を入力してください')
      return
    }
    
    setError('')
    onSearch(trimmedCity)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="sr-only">
          都市名を入力して天気を検索
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="都市名を入力（例: 東京、大阪）"
            aria-label="都市名を入力"
            aria-describedby={`${helpId} ${error ? errorId : ''}`}
            aria-invalid={!!error}
            aria-errormessage={error ? errorId : undefined}
            role="searchbox"
            autoComplete="off"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !city.trim()}
            aria-label={isLoading ? '検索中です。お待ちください' : '天気を検索'}
            aria-busy={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="sr-only">検索中</span>
                <span aria-hidden="true">検索中...</span>
              </span>
            ) : (
              '検索'
            )}
          </button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
        <p id={helpId} className="sr-only">
          日本語または英語で都市名を入力してください。Enterキーまたは検索ボタンで検索を開始します。
        </p>
      </div>
    </form>
  )
}