import React, { useEffect, useState } from 'react';
import './Confetti.css';

interface ConfettiProps {
  show: boolean;
  onComplete: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#10ac84', '#ee5a24', '#0abde3', '#3867d6', '#8c7ae6'
];

const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const newPieces: ConfettiPiece[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // 100個の紙吹雪を生成
      for (let i = 0; i < 100; i++) {
        // 角度をランダムに生成（上方向を基準に±60度の範囲）
        const angle = (Math.random() - 0.5) * Math.PI * 0.8 - Math.PI / 2; // -90度を中心に±72度
        const speed = Math.random() * 8 + 6; // 初期速度
        
        newPieces.push({
          id: i,
          x: centerX + (Math.random() - 0.5) * 100, // 中心付近からスタート
          y: centerY + (Math.random() - 0.5) * 50,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          rotationSpeed: (Math.random() - 0.5) * 15
        });
      }
      
      setPieces(newPieces);

      // 3秒後にエフェクトを終了
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  useEffect(() => {
    if (pieces.length === 0) return;

    const animationFrame = () => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.velocityX,
          y: piece.y + piece.velocityY,
          rotation: piece.rotation + piece.rotationSpeed,
          velocityX: piece.velocityX * 0.98, // 空気抵抗
          velocityY: piece.velocityY + 0.15 // 重力効果（少し強く）
        })).filter(piece => 
          piece.y < window.innerHeight + 50 && 
          piece.x > -50 && 
          piece.x < window.innerWidth + 50
        )
      );
    };

    const interval = setInterval(animationFrame, 16); // 60fps
    return () => clearInterval(interval);
  }, [pieces.length]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;