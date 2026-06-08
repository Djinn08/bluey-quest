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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 via-sky-50 to-amber-50 px-6 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <CharacterImage
        src="/icons/blueydollarbuck.png"
        fallback="/icons/icon-192.png"
        alt="Bluey Quest Dollarbuck"
        width={100}
        height={100}
        className="object-contain drop-shadow-md"
      />

      <h1 className="mt-5 font-extrabold tracking-tight text-sky-900 text-4xl sm:text-5xl">
        {APP_NAME}
      </h1>

      <div className="mt-6 flex items-end justify-center gap-5">
        <CharacterImage
          src={CHARACTER_ASSETS.bluey.default}
          fallback={CHARACTER_ASSETS.bluey.default}
          alt="Bluey"
          width={110}
          height={110}
          className="object-contain"
        />
        <CharacterImage
          src={CHARACTER_ASSETS.bingo.default}
          fallback={CHARACTER_ASSETS.bingo.default}
          alt="Bingo"
          width={95}
          height={95}
          className="object-contain"
        />
      </div>

      <div className="mt-6 space-y-1 text-center">
        <p className="text-lg font-semibold text-sky-800">Healthy habits.</p>
        <p className="text-lg font-semibold text-sky-800">Cozy rewards.</p>
        <p className="text-lg font-semibold text-orange-700">One day at a time.</p>
      </div>
    </div>
  );
}
