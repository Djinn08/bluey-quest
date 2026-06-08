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
      <div
        role="dialog"
        aria-labelledby="character-popup-title"
        className={`pointer-events-auto w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-2 ring-sky-200 transition-opacity duration-300 ${
          phase === "visible" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-orange-200">
            <CharacterImage
              src={character.image}
              fallback={character.imageFallback}
              alt={entry.name}
              fill
              sizes="80px"
            />
          </div>
          <h2 id="character-popup-title" className="mt-3 text-lg font-extrabold text-sky-900">
            {entry.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-sky-800">{entry.message}</p>
          <div className="mt-4 flex w-full gap-2">
            <Button variant="primary" fullWidth onClick={close}>
              Continue Adventure
            </Button>
            <button
              type="button"
              className="min-h-12 rounded-2xl px-4 text-sm font-semibold text-sky-600 hover:bg-sky-50"
              onClick={close}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
