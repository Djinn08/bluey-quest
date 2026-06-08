"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { logFood } from "@/app/actions/game";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const FOOD_EXAMPLES = ["Chicken Sandwich", "Apple", "Big Mac", "Pizza"];

export function LogFoodSection() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await logFood(foodName);
      if (result.success) {
        setFoodName("");
        setOpen(false);
        setMessage("Food logged — nice work!");
        router.refresh();
      } else {
        setMessage(result.error);
      }
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <>
      {message && (
        <p
          className={`animate-fade-in text-center text-sm font-medium ${message.includes("Could not") || message.includes("Please") ? "text-warning" : "text-theme-muted"}`}
          role={message.includes("Could not") ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      <Button variant="secondary" fullWidth onClick={() => setOpen(true)}>
        Log Food
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Log Food">
        <div className="space-y-4">
          <label className="block">
            <span className="text-theme-muted mb-2 block text-sm font-medium">Food Name</span>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="What did you enjoy?"
              className="themed-input w-full rounded-2xl px-4 py-4 text-lg placeholder:opacity-50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && foodName.trim()) handleSave();
              }}
            />
          </label>
          <p className="text-theme-muted text-xs">Examples: {FOOD_EXAMPLES.join(", ")}</p>
          <Button
            fullWidth
            disabled={!foodName.trim() || pending}
            onClick={handleSave}
          >
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
