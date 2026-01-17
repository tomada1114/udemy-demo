// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock environment variables for testing
process.env.OPEN_WEATHER_API_KEY = 'test-api-key'

// Add custom matchers or global test utilities here
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock fetch globally
global.fetch = jest.fn()

// Node.js環境でのTextEncoder/TextDecoderのポリフィル
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Request/Response/Headers のポリフィル
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(url, init) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Headers(init?.headers)
    }
  }
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body
      this.status = init?.status || 200
      this.statusText = init?.statusText || 'OK'
      this.ok = this.status >= 200 && this.status < 300
    }
    
    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body)
      }
      return this.body
    }
  }
}

if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = {}
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key.toLowerCase()] = value
        })
      }
    }
    
    get(name) {
      return this._headers[name.toLowerCase()]
    }
    
    set(name, value) {
      this._headers[name.toLowerCase()] = value
    }
  }
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})