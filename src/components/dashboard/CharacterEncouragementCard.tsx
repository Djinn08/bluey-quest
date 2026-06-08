"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterImage } from "@/components/ui/CharacterImage";
import {
  CHARACTER_ASSETS,
  COMPANION_GRADIENTS,
  COMPANION_NAMES,
  FLARE_SUPPORT_QUOTES,
  getCompanionImage,
  isStreakMilestone,
  pickQuoteForCompanion,
  pickRandom,
  pickRandomCompanion,
  type CompanionId,
} from "@/lib/characters";

const MUFFIN_MODE_KEY = "bluey-quest-muffin-mode";
const ACTION_COMPLETED_EVENT = "bluey-quest:action-completed";

interface CharacterEncouragementCardProps {
  flareActive?: boolean;
  streakDays?: number;
  hasCompletedToday?: boolean;
}

type ImageVariant = "default" | "heart" | "happy" | "flamingo";

function resolveState(
  flareActive: boolean,
  streakDays: number,
  hasCompletedToday: boolean,
  justCompleted: boolean,
  muffinModeUnlocked: boolean,
): { companion: CompanionId; variant: ImageVariant; quote: string } {
  if (muffinModeUnlocked) {
    return {
      companion: "muffin",
      variant: "flamingo",
      quote: pickQuoteForCompanion("muffin"),
    };
  }
  if (flareActive || isStreakMilestone(streakDays)) {
    return {
      companion: "bluey",
      variant: "heart",
      quote: pickRandom(FLARE_SUPPORT_QUOTES),
    };
  }
  if (justCompleted || hasCompletedToday) {
    return {
      companion: "bingo",
      variant: "happy",
      quote: pickQuoteForCompanion("bingo"),
    };
  }
  const companion = pickRandomCompanion();
  return {
    companion,
    variant: "default",
    quote: pickQuoteForCompanion(companion),
  };
}

export function CharacterEncouragementCard({
  flareActive = false,
  streakDays = 0,
  hasCompletedToday = false,
}: CharacterEncouragementCardProps) {
  const [muffinModeUnlocked, setMuffinModeUnlocked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [companion, setCompanion] = useState<CompanionId>(() => pickRandomCompanion());
  const [variant, setVariant] = useState<ImageVariant>("default");
  const [quote, setQuote] = useState(() => pickQuoteForCompanion(pickRandomCompanion()));

  const applyState = useCallback(
    (overrides?: Partial<{ justCompleted: boolean }>) => {
      const jc = overrides?.justCompleted ?? justCompleted;
      const resolved = resolveState(
        flareActive,
        streakDays,
        hasCompletedToday,
        jc,
        muffinModeUnlocked,
      );
      setCompanion(resolved.companion);
      setVariant(resolved.variant);
      setQuote(resolved.quote);
    },
    [flareActive, streakDays, hasCompletedToday, justCompleted, muffinModeUnlocked],
  );

  useEffect(() => {
    setMuffinModeUnlocked(!!localStorage.getItem(MUFFIN_MODE_KEY));
  }, []);

  useEffect(() => {
    applyState();
  }, [flareActive, streakDays, hasCompletedToday, muffinModeUnlocked, applyState]);

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
    setQuote(pickQuoteForCompanion(companion));
  }

  const imageSrc = useMemo(() => {
    if (companion === "muffin" && variant === "flamingo") {
      return CHARACTER_ASSETS.muffin.flamingoQueen;
    }
    return getCompanionImage(companion, variant);
  }, [companion, variant]);

  const fallback =
    companion === "muffin"
      ? CHARACTER_ASSETS.muffin.defaultPng
      : imageSrc;

  return (
    <div className="relative mt-14 animate-companion-enter">
      <button
        type="button"
        onClick={handleTap}
        className="group relative block w-full text-left"
        aria-label={`${COMPANION_NAMES[companion]} says: ${quote}. Tap for another quote.`}
      >
        <div
          className={`absolute -top-12 left-2 z-10 drop-shadow-lg transition-transform duration-300 group-active:scale-95`}
          style={{ width: 130, height: 130 }}
        >
          <CharacterImage
            src={imageSrc}
            fallback={fallback}
            alt={COMPANION_NAMES[companion]}
            width={130}
            height={130}
            className="object-contain"
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
