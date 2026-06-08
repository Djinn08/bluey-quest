"use client";

import { useEffect, useState } from "react";

interface FloatingRewardProps {
  amount: number;
  onDone: () => void;
}

export function FloatingReward({ amount, onDone }: FloatingRewardProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 1400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-1/3 z-[60] -translate-x-1/2 transition-opacity duration-300 ${
        visible ? "opacity-100 animate-float-reward" : "opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="rounded-full bg-orange-400 px-5 py-2 text-lg font-extrabold text-white shadow-lg shadow-orange-200">
        +{amount} Dollarbucks
      </span>
    </div>
  );
}
