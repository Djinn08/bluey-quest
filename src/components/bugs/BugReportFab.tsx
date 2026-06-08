"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitBugReport } from "@/app/actions/bugs";
import { Button } from "@/components/ui/Button";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { CharacterImage } from "@/components/ui/CharacterImage";
import {
  BUG_INSPECTOR_HEADERS,
  CHARACTERS,
  pickRandom,
} from "@/lib/characters";
import type { BugCategory } from "@/lib/types/database";

const CATEGORIES: { value: BugCategory; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "suggestion", label: "Suggestion" },
  { value: "complaint", label: "Complaint" },
  { value: "feature_request", label: "Feature Request" },
];

const bugInspector = CHARACTERS.buginspector;

type ModalPhase = "form" | "success" | "senior-unlock";

export function BugReportFab() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<ModalPhase>("form");
  const [headerText, setHeaderText] = useState<(typeof BUG_INSPECTOR_HEADERS)[number]>(
    BUG_INSPECTOR_HEADERS[0],
  );
  const [pending, startTransition] = useTransition();
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [seniorUnlock, setSeniorUnlock] = useState<{ title: string; bonus: number } | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open && phase === "form") {
      setHeaderText(pickRandom(BUG_INSPECTOR_HEADERS));
    }
  }, [open, phase]);

  function resetAndClose() {
    setOpen(false);
    setPhase("form");
    setSuccessResponse(null);
    setSeniorUnlock(null);
    setErrorMsg(null);
    setConfetti(false);
    formRef.current?.reset();
  }

  function handleOpen() {
    setPhase("form");
    setSuccessResponse(null);
    setSeniorUnlock(null);
    setErrorMsg(null);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitBugReport(formData);
      if (result.success) {
        formRef.current?.reset();
        setSuccessResponse(result.response);
        if (result.seniorInspectorUnlocked) {
          setSeniorUnlock(result.seniorInspectorUnlocked);
          setConfetti(true);
          setPhase("senior-unlock");
          router.refresh();
        } else {
          setPhase("success");
        }
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <>
      {confetti && <ConfettiBurst />}
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-24 right-4 z-40 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-violet-100 shadow-lg shadow-violet-200 transition hover:bg-violet-200 active:scale-95 sm:bottom-8"
        aria-label="Report a bug to Bug Inspector Muffin"
        title="Bug Inspector Muffin"
      >
        <CharacterImage
          src={bugInspector.image}
          fallback={bugInspector.imageFallback}
          alt="Bug Inspector Muffin"
          width={56}
          height={56}
          className="object-contain"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-sky-950/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bug-inspector-title"
          onClick={resetAndClose}
        >
          <div
            className="w-full max-w-md animate-slide-up rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {phase === "form" && (
              <>
                <BugInspectorHeader subtext={headerText} />
                <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                    <span className="mb-1 block text-sm font-medium text-sky-800">What happened?</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Describe the chaos..."
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

                  {errorMsg && (
                    <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-900" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <Button type="submit" fullWidth disabled={pending}>
                    {pending ? "Muffin is investigating..." : "Submit Report"}
                  </Button>
                </form>
              </>
            )}

            {phase === "success" && successResponse && (
              <div className="space-y-4 text-center">
                <BugInspectorHeader size="lg" />
                <p className="text-lg font-extrabold text-violet-800">{successResponse}</p>
                <Button fullWidth onClick={resetAndClose}>
                  Case Closed
                </Button>
              </div>
            )}

            {phase === "senior-unlock" && seniorUnlock && (
              <div className="space-y-4 text-center">
                <BugInspectorHeader size="lg" />
                <p className="text-2xl font-extrabold text-violet-700">
                  🎖️ {seniorUnlock.title}
                </p>
                <p className="text-lg font-bold text-sky-900">
                  Muffin has promoted you for outstanding bug reporting!
                </p>
                <p className="text-xl font-extrabold text-orange-500">
                  +{seniorUnlock.bonus} Dollarbucks
                </p>
                <Button fullWidth onClick={resetAndClose}>
                  Magnificent
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function BugInspectorHeader({
  subtext,
  size = "md",
}: {
  subtext?: string;
  size?: "md" | "lg";
}) {
  const imageSize = size === "lg" ? 120 : 96;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: imageSize, height: imageSize }}>
        <CharacterImage
          src={bugInspector.image}
          fallback={bugInspector.imageFallback}
          alt="Bug Inspector Muffin"
          width={imageSize}
          height={imageSize}
          className="object-contain"
        />
      </div>
      <div className="min-w-0 text-left">
        <h2 id="bug-inspector-title" className="text-xl font-extrabold text-violet-900">
          🐶 Bug Inspector Muffin
        </h2>
        {subtext && (
          <p className="mt-1 text-sm font-semibold text-violet-700">{subtext}</p>
        )}
      </div>
    </div>
  );
}
