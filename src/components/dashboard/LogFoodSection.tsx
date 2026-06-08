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
          className={`animate-fade-in text-center text-sm font-medium ${message.includes("Could not") || message.includes("Please") ? "text-orange-900" : "text-sky-800"}`}
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
            <span className="mb-2 block text-sm font-medium text-sky-800">Food Name</span>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="What did you enjoy?"
              className="w-full rounded-2xl border-2 border-sky-200 px-4 py-4 text-lg text-sky-900 placeholder:text-sky-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && foodName.trim()) handleSave();
              }}
            />
          </label>
          <p className="text-xs text-sky-600">Examples: {FOOD_EXAMPLES.join(", ")}</p>
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
