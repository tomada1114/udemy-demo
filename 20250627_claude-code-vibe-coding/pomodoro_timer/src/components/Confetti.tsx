import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  angularVelocity: number
  color: string
  size: number
  shape: 'square' | 'circle'
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
}

export function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      // 紙吹雪を生成
      const colors = [
        '#f87171', // red-400
        '#fb923c', // orange-400
        '#fbbf24', // amber-400
        '#facc15', // yellow-400
        '#a3e635', // lime-400
        '#4ade80', // green-400
        '#2dd4bf', // teal-400
        '#22d3ee', // cyan-400
        '#60a5fa', // blue-400
        '#818cf8', // indigo-400
        '#a78bfa', // violet-400
        '#e879f9', // fuchsia-400
        '#f472b6', // pink-400
      ]

      const newPieces: ConfettiPiece[] = []
      const pieceCount = 150

      for (let i = 0; i < pieceCount; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 10 + 5,
          angle: Math.random() * 360,
          angularVelocity: (Math.random() - 0.5) * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          shape: Math.random() > 0.5 ? 'square' : 'circle',
        })
      }

      setPieces(newPieces)
      setIsVisible(true)

      // 指定時間後に非表示にする
      const timer = setTimeout(() => {
        setIsVisible(false)
        setPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setPieces(prevPieces =>
        prevPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.vx,
          y: piece.y + piece.vy,
          vy: piece.vy + 0.5, // 重力
          angle: piece.angle + piece.angularVelocity,
        })).filter(piece => piece.y < window.innerHeight + 100)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute will-change-transform"
          style={{
            transform: `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.angle}deg)`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            borderRadius: piece.shape === 'circle' ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}