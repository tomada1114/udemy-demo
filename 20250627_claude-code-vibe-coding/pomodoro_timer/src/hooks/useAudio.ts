import { useCallback, useRef } from 'react'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 通知音を再生
  const playNotification = useCallback(() => {
    try {
      // Web Audio APIを使用してビープ音を生成
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // 音の設定
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // 800Hzの音
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime) // 音量30%
      
      // 音を再生（0.5秒間）
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      // 使用後にリソースを解放
      oscillator.onended = () => {
        audioContext.close()
      }
    } catch (error) {
      console.warn('音声再生に失敗しました:', error)
      
      // フォールバック: HTMLAudioElementを使用
      try {
        if (!audioRef.current) {
          // データURIを使用してビープ音を作成
          const beepSound = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Htt2gfBzaBzvLZiTYIG...'
          audioRef.current = new Audio(beepSound)
        }
        audioRef.current.play()
      } catch (fallbackError) {
        console.warn('フォールバック音声再生も失敗しました:', fallbackError)
      }
    }
  }, [])

  return {
    playNotification,
  }
}