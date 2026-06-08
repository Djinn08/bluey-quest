"use client";

import { useEffect, useState } from "react";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { APP_NAME, CHARACTER_ASSETS } from "@/lib/characters";

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

    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 px-8 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      {/* 1. Dollarbuck */}
      <CharacterImage
        src="/icons/blueydollarbuck.png"
        fallback="/icons/icon-192.png"
        alt="Bluey Quest Dollarbuck"
        width={88}
        height={88}
        className="object-contain drop-shadow-md"
        priority
      />

      {/* 2. Bluey Quest */}
      <h1 className="mt-4 font-extrabold tracking-tight text-sky-900 text-4xl sm:text-5xl">
        {APP_NAME}
      </h1>

      {/* 3. Hero artwork — Bluey + Bingo piggyback */}
      <div className="mt-6 w-full max-w-xs">
        <CharacterImage
          src={CHARACTER_ASSETS.hero.blueyBingo}
          fallback={CHARACTER_ASSETS.bluey.default}
          alt="Bluey and Bingo"
          width={320}
          height={280}
          className="mx-auto h-auto w-full max-h-[280px] object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* 4. Tagline */}
      <div className="mt-6 space-y-0.5 text-center">
        <p className="text-base font-semibold text-sky-800">Healthy habits.</p>
        <p className="text-base font-semibold text-sky-800">Cozy rewards.</p>
        <p className="text-base font-semibold text-orange-700">One day at a time.</p>
      </div>
    </div>
  );
}
