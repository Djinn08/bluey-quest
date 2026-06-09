"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { saveMoodCheckIn } from "@/app/actions/mood";
import { Button } from "@/components/ui/Button";
import { FloatingReward } from "@/components/ui/FloatingReward";
import {
  getNotesCounterClass,
  MOOD_FACE_OPTIONS,
  MOOD_NOTES_MAX,
} from "@/lib/features/mood-tracking";

export function MoodCheckInSection() {
  const router = useRouter();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [floatingReward, setFloatingReward] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const clearFloating = useCallback(() => setFloatingReward(null), []);

  const notesLength = notes.length;
  const notesRemaining = MOOD_NOTES_MAX - notesLength;

  function handleSave() {
    if (selectedScore === null) {
      setMessage("Please pick how you're feeling today.");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    startTransition(async () => {
      const result = await saveMoodCheckIn(selectedScore, notes);
      if (result.success) {
        if (result.rewardEarned > 0) {
          setFloatingReward(result.rewardEarned);
        }
        router.refresh();
      } else {
        setMessage(result.error);
        setTimeout(() => setMessage(null), 2500);
      }
    });
  }

  return (
    <div className="relative space-y-4">
      {floatingReward !== null && (
        <FloatingReward amount={floatingReward} onDone={clearFloating} />
      )}
      {message && (
        <p
          className={`animate-fade-in text-center text-sm font-medium ${
            message.includes("Could not") ||
            message.includes("Please") ||
            message.includes("pick")
              ? "text-warning"
              : "text-theme-muted"
          }`}
          role={message.includes("Could not") ? "alert" : "status"}
        >
          {message}
        </p>
      )}

      <div>
        <p className="text-theme mb-1 text-base font-semibold">How are you feeling today?</p>
        <p className="text-theme-muted mb-3 text-xs">1 = Worst · 10 = Best</p>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {MOOD_FACE_OPTIONS.map(({ score, face }) => {
            const selected = selectedScore === score;
            return (
              <button
                key={score}
                type="button"
                onClick={() => setSelectedScore(score)}
                aria-label={`Mood ${score} of 10`}
                aria-pressed={selected}
                className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--card-alt)] shadow-md ring-2 ring-[var(--primary)]"
                    : "border-[var(--input-border)] bg-[var(--card)] hover:border-[var(--input-focus)]"
                }`}
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {face}
                </span>
                <span className="text-theme-muted mt-1 text-xs font-bold">{score}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-theme-muted mb-2 block text-sm font-medium">
          Notes <span className="font-normal opacity-70">(optional)</span>
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, MOOD_NOTES_MAX))}
          placeholder="Anything you want to remember about today?"
          rows={3}
          className="themed-input w-full resize-y rounded-2xl px-4 py-3 text-base placeholder:opacity-50"
        />
        <p className={`mt-1 text-right text-xs ${getNotesCounterClass(notesLength)}`}>
          {notesLength} / {MOOD_NOTES_MAX} · {notesRemaining} left
        </p>
      </label>

      <Button fullWidth disabled={selectedScore === null || pending} onClick={handleSave}>
        {pending ? "Saving..." : "Save Check-In"}
      </Button>
    </div>
  );
}
