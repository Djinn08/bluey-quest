"use client";

import { Card } from "@/components/ui/Card";
import { CharacterImage } from "@/components/ui/CharacterImage";
import {
  pickDailyCharacterMessage,
  CHARACTERS,
  type CharacterMessage,
} from "@/lib/characters";
import { getTodayDateString } from "@/lib/streak";

interface CharacterEncouragementCardProps {
  override?: CharacterMessage;
}

export function CharacterEncouragementCard({ override }: CharacterEncouragementCardProps) {
  const entry = override ?? pickDailyCharacterMessage(getTodayDateString());
  const character = CHARACTERS[entry.character];

  return (
    <Card className={`bg-gradient-to-r ${character.color} bg-opacity-20`}>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <CharacterImage
            src={character.image}
            fallback={character.imageFallback}
            alt={entry.name}
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-sky-800">{entry.name}</p>
          <p className="text-lg font-bold leading-snug text-sky-900">{entry.message}</p>
        </div>
      </div>
    </Card>
  );
}
