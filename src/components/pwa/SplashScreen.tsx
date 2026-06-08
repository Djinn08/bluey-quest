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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="flex w-full max-w-sm flex-col items-center px-8 text-center">
        <CharacterImage
          src="/icons/blueydollarbuck.png"
          fallback="/icons/icon-192.png"
          alt="Bluey Quest Dollarbuck"
          width={80}
          height={80}
          className="h-20 w-20 object-contain drop-shadow-md"
          priority
        />

        <h1 className="mt-5 font-extrabold tracking-tight text-sky-900 text-4xl">
          {APP_NAME}
        </h1>

        <div className="mt-6 w-full">
          <CharacterImage
            src={CHARACTER_ASSETS.group.family}
            fallback={CHARACTER_ASSETS.bluey.default}
            alt="Bluey family"
            width={320}
            height={240}
            className="mx-auto h-auto w-full max-h-[min(42vh,240px)] object-contain drop-shadow-lg"
            priority
          />
        </div>

        <div className="mt-6 space-y-0.5">
          <p className="text-base font-semibold text-sky-800">Healthy habits.</p>
          <p className="text-base font-semibold text-sky-800">Cozy rewards.</p>
          <p className="text-base font-semibold text-orange-700">One day at a time.</p>
        </div>
      </div>
    </div>
  );
}
