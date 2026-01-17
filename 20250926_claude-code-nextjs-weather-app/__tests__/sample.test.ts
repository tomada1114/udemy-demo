// サンプルテスト - Jest環境の動作確認用
describe('Test Environment', () => {
  it('should run a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have test environment configured', () => {
    expect(process.env.OPEN_WEATHER_API_KEY).toBe('test-api-key')
  })

  it('should have fetch mocked', () => {
    expect(global.fetch).toBeDefined()
    expect(jest.isMockFunction(global.fetch)).toBe(true)
  })
})