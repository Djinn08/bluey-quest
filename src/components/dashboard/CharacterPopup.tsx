"use client";

import { useCallback, useEffect, useState } from "react";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { Button } from "@/components/ui/Button";
import { CHARACTERS, POPUP_MESSAGES, pickRandom } from "@/lib/characters";

const STORAGE_KEY = "bluey-quest-character-popup";
const SHOW_CHANCE = 0.1;

type PopupEntry = (typeof POPUP_MESSAGES)[number];

function getLocalDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function CharacterPopup() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "leaving">("hidden");
  const [entry, setEntry] = useState<PopupEntry | null>(null);

  const close = useCallback(() => setPhase("leaving"), []);

  useEffect(() => {
    const today = getLocalDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === today) return;

    localStorage.setItem(STORAGE_KEY, today);
    if (Math.random() >= SHOW_CHANCE) return;

    setEntry(pickRandom(POPUP_MESSAGES));
    setPhase("entering");
  }, []);

  useEffect(() => {
    if (phase !== "entering") return;
    const frame = requestAnimationFrame(() => setPhase("visible"));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => setPhase("hidden"), 300);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden" || !entry) return null;

  const character = CHARACTERS[entry.character];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div className="pointer-events-auto relative w-full max-w-sm">
        <div
          className="absolute -top-10 left-1/2 z-10 h-28 w-28 -translate-x-1/2"
          aria-hidden
        >
          <CharacterImage
            src={character.image}
            fallback={character.imageFallback}
            alt=""
            width={112}
            height={112}
            className="h-full w-full object-contain drop-shadow-lg"
          />
        </div>

        <div
          role="dialog"
          aria-labelledby="character-popup-title"
          className={`rounded-3xl bg-white px-5 pb-5 pt-16 shadow-2xl ring-2 ring-sky-200 transition-opacity duration-300 ${
            phase === "visible" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-full">
              <h2 id="character-popup-title" className="text-lg font-extrabold text-sky-900">
                {entry.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-sky-800">{entry.message}</p>
            </div>
            <div className="mt-1 flex w-full gap-2">
              <Button variant="primary" fullWidth onClick={close}>
                Continue Adventure
              </Button>
              <button
                type="button"
                className="min-h-12 shrink-0 rounded-2xl px-4 text-sm font-semibold text-sky-600 hover:bg-sky-50"
                onClick={close}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
