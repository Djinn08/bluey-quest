"use client";

import { useEffect, useMemo, useState } from "react";
import { useSneakPeek } from "@/components/easter-egg/SneakPeekProvider";
import { CharacterImage } from "@/components/ui/CharacterImage";
import {
  COMPANION_GRADIENTS,
  COMPANION_NAMES,
  FLARE_SUPPORT_QUOTES,
  getCompanionImage,
  isStreakMilestone,
  pickQuoteForCompanion,
  pickRandom,
  pickRandomCompanion,
  type CompanionId,
  type CompanionImageVariant,
} from "@/lib/characters";

const MUFFIN_MODE_KEY = "bluey-quest-muffin-mode";
const ACTION_COMPLETED_EVENT = "bluey-quest:action-completed";

const SSR_FALLBACK_COMPANION: CompanionId = "bluey";
const SSR_FALLBACK_QUOTE = "You're doing great.";

interface CharacterEncouragementCardProps {
  flareActive?: boolean;
  streakDays?: number;
  hasCompletedToday?: boolean;
}

export function CharacterEncouragementCard({
  flareActive = false,
  streakDays = 0,
  hasCompletedToday = false,
}: CharacterEncouragementCardProps) {
  const { registerTap } = useSneakPeek();
  const [mounted, setMounted] = useState(false);
  const [muffinModeUnlocked, setMuffinModeUnlocked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [sessionCompanion, setSessionCompanion] = useState<CompanionId | null>(null);
  const [companion, setCompanion] = useState<CompanionId>(SSR_FALLBACK_COMPANION);
  const [variant, setVariant] = useState<CompanionImageVariant>("default");
  const [quote, setQuote] = useState(SSR_FALLBACK_QUOTE);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setMuffinModeUnlocked(!!localStorage.getItem(MUFFIN_MODE_KEY));
    setSessionCompanion(pickRandomCompanion());
  }, [mounted]);

  useEffect(() => {
    if (!mounted || sessionCompanion === null) return;

    if (muffinModeUnlocked) {
      setCompanion("muffin");
      setVariant("default");
      setQuote(pickQuoteForCompanion("muffin"));
      return;
    }

    if (flareActive || isStreakMilestone(streakDays)) {
      setCompanion("bluey");
      setVariant("heart");
      setQuote(pickRandom(FLARE_SUPPORT_QUOTES));
      return;
    }

    if (justCompleted || hasCompletedToday) {
      setCompanion("bingo");
      setVariant("happy");
      setQuote(pickQuoteForCompanion("bingo"));
      return;
    }

    setCompanion(sessionCompanion);
    setVariant("default");
    setQuote(pickQuoteForCompanion(sessionCompanion));
  }, [
    mounted,
    sessionCompanion,
    muffinModeUnlocked,
    flareActive,
    streakDays,
    hasCompletedToday,
    justCompleted,
  ]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function handler() {
      setJustCompleted(true);
      setCompanion("bingo");
      setVariant("happy");
      setQuote(pickQuoteForCompanion("bingo"));
      clearTimeout(timer);
      timer = setTimeout(() => setJustCompleted(false), 8000);
    }

    window.addEventListener(ACTION_COMPLETED_EVENT, handler);
    return () => {
      window.removeEventListener(ACTION_COMPLETED_EVENT, handler);
      clearTimeout(timer);
    };
  }, []);

  function handleTap() {
    if (!mounted) return;
    setQuote(pickQuoteForCompanion(companion));
    registerTap();
  }

  const imageSrc = useMemo(() => getCompanionImage(companion, variant), [companion, variant]);
  const fallback = useMemo(() => getCompanionImage(companion, "default"), [companion]);

  return (
    <div className="relative mt-14 animate-companion-enter">
      <button
        type="button"
        onClick={handleTap}
        className="group relative block w-full text-left"
        aria-label={`${COMPANION_NAMES[companion]} says: ${quote}. Tap for another quote.`}
      >
        <div
          className="absolute -top-12 left-2 z-10 drop-shadow-lg transition-transform duration-300 group-active:scale-95"
          style={{ width: 135, height: 135 }}
        >
          <CharacterImage
            key={`${companion}-${variant}`}
            src={imageSrc}
            fallback={fallback}
            alt={COMPANION_NAMES[companion]}
            width={135}
            height={135}
            className="h-full w-full object-contain"
          />
        </div>

        <div
          className={`rounded-3xl bg-gradient-to-br ${COMPANION_GRADIENTS[companion]} pl-28 pr-5 py-5 shadow-md shadow-sky-200/60`}
        >
          <p className="text-sm font-semibold text-sky-800/90">{COMPANION_NAMES[companion]} says:</p>
          <p className="mt-1 text-2xl font-extrabold leading-snug text-sky-950">{quote}</p>
        </div>
      </button>
    </div>
  );
}
