"use client";

import { useState } from "react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Card } from "@/components/ui/Card";
import { CharacterImage } from "@/components/ui/CharacterImage";
import {
  CHARACTERS,
  pickRandom,
  MUFFIN_REACTION_QUOTES,
  BLUEY_REACTION_QUOTES,
  BINGO_REACTION_QUOTES,
} from "@/lib/characters";
import { playBingoTone, playBlueyChime, playMuffinGiggle } from "@/lib/sounds";

type InteractiveCharacterId = "bluey" | "bingo" | "muffin";

const INTERACTIVE_CHARACTERS: InteractiveCharacterId[] = ["bluey", "bingo", "muffin"];

const REACTION_QUOTES: Record<"bluey" | "bingo" | "muffin", readonly string[]> = {
  bluey: BLUEY_REACTION_QUOTES,
  bingo: BINGO_REACTION_QUOTES,
  muffin: MUFFIN_REACTION_QUOTES,
};

const REACTION_SOUNDS: Record<"bluey" | "bingo" | "muffin", () => void> = {
  bluey: playBlueyChime,
  bingo: playBingoTone,
  muffin: playMuffinGiggle,
};

export function CharacterInteractions() {
  const { characterSoundsEnabled } = useTheme();
  const [activeId, setActiveId] = useState<InteractiveCharacterId | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [bouncing, setBouncing] = useState<InteractiveCharacterId | null>(null);

  function handleCharacterClick(id: InteractiveCharacterId) {
    setActiveId(id);
    setQuote(pickRandom(REACTION_QUOTES[id]));
    setBouncing(id);
    if (characterSoundsEnabled) {
      REACTION_SOUNDS[id]();
    }
    setTimeout(() => setBouncing(null), 600);
  }

  return (
    <Card>
      <p className="mb-3 text-center text-sm font-medium text-sky-700">
        Tap a friend for encouragement!
      </p>
      <div className="flex justify-center gap-4">
        {INTERACTIVE_CHARACTERS.map((id) => {
          const character = CHARACTERS[id];
          const isBouncing = bouncing === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleCharacterClick(id)}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition hover:bg-white/60 active:scale-95 ${
                isBouncing ? "animate-character-bounce" : ""
              }`}
              aria-label={`Talk to ${character.name}`}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white ring-2 ring-sky-200">
                <CharacterImage
                  src={character.image}
                  fallback={character.imageFallback}
                  alt={character.name}
                  fill
                  sizes="64px"
                />
              </div>
              <span className="text-xs font-bold text-sky-800">{character.name}</span>
            </button>
          );
        })}
      </div>
      {activeId && quote && (
        <div
          className={`mt-3 rounded-2xl bg-gradient-to-r ${CHARACTERS[activeId].color} px-4 py-3 text-center`}
          role="status"
        >
          <p className="text-sm font-bold text-sky-900">{CHARACTERS[activeId].name} says:</p>
          <p className="text-base font-bold text-sky-900">{quote}</p>
        </div>
      )}
    </Card>
  );
}
