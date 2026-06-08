"use client";

import { useEffect, useState } from "react";
import { CharacterImage } from "@/components/ui/CharacterImage";

const SPLASH_KEY = "bluey-quest-splash-shown";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);

    const shown = sessionStorage.getItem(SPLASH_KEY);
    if (!isStandalone && shown) return;

    setVisible(true);
    sessionStorage.setItem(SPLASH_KEY, "1");

    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-orange-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="flex items-end justify-center gap-6 px-6">
        <CharacterImage
          src="/characters/bluey.png"
          fallback="/characters/bluey.svg"
          alt="Bluey"
          width={120}
          height={120}
          className="object-contain"
        />
        <CharacterImage
          src="/characters/bingo.png"
          fallback="/characters/bingo.svg"
          alt="Bingo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-sky-900">Bluey Quest</h1>

      <div className="mt-4 space-y-1 text-center">
        <p className="text-lg font-semibold text-sky-800">Healthy habits.</p>
        <p className="text-lg font-semibold text-sky-800">Cozy rewards.</p>
        <p className="text-lg font-semibold text-orange-700">One day at a time.</p>
      </div>
    </div>
  );
}
