import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global test setup
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage with proper return values
const localStorageData: Record<string, string> = {}

const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageData[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageData[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageData[key]
  }),
  clear: vi.fn(() => {
    for (const key in localStorageData) {
      delete localStorageData[key]
    }
  }),
  length: 0,
  key: vi.fn()
}

// Clear localStorage data before each test
export const clearMockLocalStorage = () => {
  for (const key in localStorageData) {
    delete localStorageData[key]
  }
}

vi.stubGlobal('localStorage', localStorageMock)