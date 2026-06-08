"use client";

import { useEffect, useState } from "react";

const COLORS = ["#fdba74", "#7dd3fc", "#f472b6", "#a78bfa", "#fbbf24"];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
}

export function ConfettiBurst() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[i % COLORS.length],
      })),
    );
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 h-3 w-2 animate-confetti-fall rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
