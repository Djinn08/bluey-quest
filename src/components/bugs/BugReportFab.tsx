"use client";

import { useRef, useState, useTransition } from "react";
import { submitBugReport } from "@/app/actions/bugs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { CHARACTERS } from "@/lib/characters";
import type { BugCategory } from "@/lib/types/database";

const CATEGORIES: { value: BugCategory; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "suggestion", label: "Suggestion" },
  { value: "complaint", label: "Complaint" },
  { value: "feature_request", label: "Feature Request" },
];

const bugCharacter = CHARACTERS.buginspector;

export function BugReportFab() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitBugReport(formData);
      if (result.success) {
        setMessage("Thanks Jaydan! Report sent.");
        formRef.current?.reset();
        setTimeout(() => {
          setOpen(false);
          setMessage(null);
        }, 1500);
      } else if (result.error) {
        setMessage(result.error);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-violet-500 shadow-lg shadow-violet-200 transition hover:bg-violet-600 active:scale-95 sm:bottom-8"
        aria-label="Report a bug or suggestion"
        title="Report bug / suggestion"
      >
        <div className="relative h-10 w-10">
          <CharacterImage
            src={bugCharacter.image}
            fallback={bugCharacter.imageFallback}
            alt="Bug Inspector"
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Send Feedback">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-sky-800">Category</span>
            <select
              name="category"
              required
              defaultValue="bug"
              className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none"
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-sky-800">Message</span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="What happened? What would make it better?"
              className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-sky-800">
              Screenshot (optional)
            </span>
            <input
              name="screenshot"
              type="file"
              accept="image/*"
              className="w-full text-sm text-sky-700"
            />
          </label>

          {message && (
            <p className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-900" role="status">
              {message}
            </p>
          )}

          <Button type="submit" fullWidth disabled={pending}>
            {pending ? "Sending..." : "Submit"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
